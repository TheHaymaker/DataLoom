#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rulesDir = path.join(process.cwd(), 'jsonlogic', 'rules');
const outputDir = path.join(process.cwd(), 'generated', 'ruby', 'jsonlogic');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert snake_case to PascalCase
function toPascalCase(str) {
  return str.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Convert snake_case to SCREAMING_SNAKE_CASE
function toScreamingSnakeCase(str) {
  return str.toUpperCase();
}

// Convert JSON to Ruby hash syntax using Ruby's JSON parser
function jsonToRubyHash(json) {
  // Create a temporary file with the JSON
  const tempFile = path.join(process.cwd(), 'temp.json');
  fs.writeFileSync(tempFile, JSON.stringify(json));
  
  try {
    // Use Ruby to read the file, parse JSON, and convert to hash syntax
    const rubyCode = `
      require 'json'
      file = File.read('${tempFile}')
      puts JSON.parse(file).inspect
    `;
    return execSync(`ruby -e "${rubyCode}"`).toString().trim();
  } finally {
    // Clean up temp file
    fs.unlinkSync(tempFile);
  }
}

const generateRubyCode = () => {
  // Read all rule files
  const ruleFiles = fs.readdirSync(rulesDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
      return {
        name: path.basename(file, '.json'),
        ...JSON.parse(content)
      };
    });

  // Generate constants for rules
  const constants = ruleFiles.map(rule => {
    const constantName = toScreamingSnakeCase(`${rule.name}_RULES`);
    const rubyHash = jsonToRubyHash(rule.rules);
    return `    ${constantName} = ${rubyHash}`;
  }).join('\n\n');

  // Generate Ruby module code
  const moduleCode = `# frozen_string_literal: true

require 'json_logic'

module BusinessLogic
  # Logic engine for applying JSON Logic rules
  class Engine
    class << self
      # Rule definitions
${constants}

      # Apply generic JSON Logic rules to data
      #
      # @param rules [Hash] The JSON Logic rules to apply
      # @param data [Hash] The data to apply the rules to
      # @return [Object] The result of applying the rules
      def apply(rules, data)
        JSONLogic.apply(rules, data)
      end

      ${ruleFiles.map(rule => {
        const methodName = rule.name;
        const constantName = toScreamingSnakeCase(`${rule.name}_RULES`);
        
        // Generate example data as a Ruby hash using Ruby's JSON parser
        const exampleData = jsonToRubyHash(rule.example_data);

        return `
      # Apply ${rule.name} rules
      #
      # @param data [Hash] The data to evaluate against the rules
      # @return [Object] The result of applying the rules
      #
      # @example
      #   data = ${exampleData}
      #   result = JsonLogic::Engine.${methodName}(data)
      def ${methodName}(data)
        apply(${constantName}, data)
      end`;
      }).join('\n')}
    end
  end
end

# Example usage:
#
# require_relative 'logic_engine'
#
# # Order calculation example
# order_data = ${jsonToRubyHash(ruleFiles.find(r => r.name === 'order_calculation')?.example_data)}
# order_total = JsonLogic::Engine.order_calculation(order_data)
#
# # User eligibility example
# user_data = ${jsonToRubyHash(ruleFiles.find(r => r.name === 'user_eligibility')?.example_data)}
# is_eligible = JsonLogic::Engine.user_eligibility(user_data)
`;

  // Write the generated code to a file
  const outputFile = path.join(outputDir, 'engine.rb');
  fs.writeFileSync(outputFile, moduleCode);
  console.log('Ruby JsonLogic files generated successfully!');
};

try {
  generateRubyCode();
} catch (error) {
  console.error('Error generating Ruby JsonLogic files:', error);
  process.exit(1);
}

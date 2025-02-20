#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateTypeScriptCode = () => {
  const outputDir = path.join(__dirname, '..', 'generated', 'ts', 'jsonlogic');
  fs.mkdirSync(outputDir, { recursive: true });

  // Read all rule files
  const rulesDir = path.join(__dirname, '..', 'jsonlogic', 'rules');
  const ruleFiles = fs.readdirSync(rulesDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
      return {
        name: path.basename(file, '.json'),
        ...JSON.parse(content)
      };
    });

  // Generate types for rules
  const ruleTypes = ruleFiles.map(rule => {
    const typeName = `${rule.name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')}Rule`;
    
    return `export type ${typeName} = ${JSON.stringify(rule.rules, null, 2)};`;
  }).join('\n\n');

  // Generate example data types
  const dataTypes = ruleFiles.map(rule => {
    const typeName = `${rule.name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')}Data`;
    
    return `export type ${typeName} = ${JSON.stringify(rule.example_data, null, 2)};`;
  }).join('\n\n');

  // Generate the LogicEngine class
  const engineCode = `
import jsonLogic from 'json-logic-js';

// Type for JsonLogic rules
type JsonLogicRule = Record<string, unknown>;

// Type for rule results
type RuleResult<T> = T extends boolean ? boolean : T extends number ? number : unknown;

${ruleTypes}

${dataTypes}

// Namespace for JsonLogic operations
export const BusinessLogicEngine = {
  apply<T>(rules: JsonLogicRule, data: unknown): RuleResult<T> {
    return jsonLogic.apply(rules, data) as RuleResult<T>;
  },

  // Helper methods for each rule type
  ${ruleFiles.map(rule => {
    const methodName = rule.name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const typeName = rule.name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    // Determine return type based on rule structure
    const getReturnType = (rules) => {
      if (rules.and !== undefined || rules.or !== undefined) return 'boolean';
      if (rules['*'] !== undefined || rules['+'] !== undefined || rules['-'] !== undefined || rules.reduce !== undefined) return 'number';
      return 'unknown';
    };
    
    const returnType = getReturnType(rule.rules);
    
    return `
  ${methodName}(data: ${typeName}Data): ${returnType} {
    const rules = ${JSON.stringify(rule.rules, null, 2)} as ${typeName}Rule;
    return this.apply(rules, data) as ${returnType};
  }`;
  }).join(',\n')}
} as const;

// Example usage:
/*
import { BusinessLogicEngine } from './logic-engine';

// Order calculation example
const orderData = ${JSON.stringify(ruleFiles.find(r => r.name === 'order_calculation')?.example_data, null, 2)};
const orderTotal = BusinessLogicEngine.orderCalculation(orderData);

// User eligibility example
const userData = ${JSON.stringify(ruleFiles.find(r => r.name === 'user_eligibility')?.example_data, null, 2)};
const isEligible = BusinessLogicEngine.userEligibility(userData);
*/
`;

  // Write the generated code to a file
  const outputFile = path.join(outputDir, 'index.ts');
  fs.writeFileSync(outputFile, engineCode);
  console.log('TypeScript JsonLogic files generated successfully!');
};

try {
  generateTypeScriptCode();
} catch (error) {
  console.error('Error generating TypeScript JsonLogic files:', error);
  process.exit(1);
}

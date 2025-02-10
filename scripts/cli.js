const inquirer = require('inquirer').default;
const path = require('path');
const fs = require('fs');
const ck = require('chalk').Chalk;
const ts = require('typescript');

const chalk = new ck({level: 3})

// Cleanup function to handle graceful shutdown
function cleanup() {
  console.log(chalk.gray('\nCleaning up...'));
  // Add any cleanup tasks here if needed
  console.log(chalk.yellow('Goodbye!\n'));
  process.exit(0);
}

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

const samples = {
  array: {
    description: 'Represents a repeated field (array) of strings.',
    content: `syntax = "proto3";

package sample;

message ArrayMessage {
  repeated string items = 1;
}
`
  },
  function: {
    description: 'Defines a service with an RPC method.',
    content: `syntax = "proto3";

package sample;

service SampleService {
  rpc SampleFunction (SampleRequest) returns (SampleResponse);
}

message SampleRequest {
  string input = 1;
}

message SampleResponse {
  string output = 1;
}
`
  },
  object: {
    description: 'Represents an object with various fields.',
    content: `syntax = "proto3";

package sample;

message SampleObject {
  string name = 1;
  int32 id = 2;
  bool isActive = 3;
}
`
  },
  schema: {
    description: 'Represents a schema with a map of properties.',
    content: `syntax = "proto3";

package sample;

message SampleSchema {
  string title = 1;
  string description = 2;
  map<string, string> properties = 3;
}
`
  },
  enum: {
    description: 'Defines an enumeration of named values.',
    content: `syntax = "proto3";

package sample;

enum SampleEnum {
  UNKNOWN = 0;
  OPTION_ONE = 1;
  OPTION_TWO = 2;
}
`
  },
  map: {
    description: 'Represents a map of key-value pairs.',
    content: `syntax = "proto3";

package sample;

message SampleMap {
  map<string, int32> items = 1;
}
`
  },
  oneof: {
    description: 'Defines a field that can hold one of several possible types.',
    content: `syntax = "proto3";

package sample;

message SampleOneof {
  oneof test_oneof {
    string name = 1;
    int32 id = 2;
  }
}
`
  },
  nested: {
    description: 'Represents a message with nested messages.',
    content: `syntax = "proto3";

package sample;

message Outer {
  message Inner {
    string name = 1;
    int32 id = 2;
  }
  Inner inner = 1;
}
`
  },
  any: {
    description: 'Represents a field that can hold any type of message.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/any.proto";

message SampleAny {
  google.protobuf.Any any_field = 1;
}
`
  },
  timestamp: {
    description: 'Represents a point in time.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/timestamp.proto";

message SampleTimestamp {
  google.protobuf.Timestamp timestamp = 1;
}
`
  },
  duration: {
    description: 'Represents a span of time.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/duration.proto";

message SampleDuration {
  google.protobuf.Duration duration = 1;
}
`
  },
  wrapper: {
    description: 'Represents primitive types with additional metadata.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/wrappers.proto";

message SampleWrapper {
  google.protobuf.Int32Value int32_value = 1;
  google.protobuf.StringValue string_value = 2;
}
`
  },
  struct: {
    description: 'Represents a structured data value, including nested lists and maps.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/struct.proto";

message SampleStruct {
  google.protobuf.Struct struct_field = 1;
}
`
  },
  empty: {
    description: 'Represents an empty message.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/empty.proto";

message SampleEmpty {
  google.protobuf.Empty empty_field = 1;
}
`
  },
  extension: {
    description: 'Allows adding fields to existing messages without modifying them.',
    content: `syntax = "proto3";

package sample;

message SampleExtension {
  int32 id = 1;
  extend SampleExtension {
    optional string extension_field = 100;
  }
}
`
  },
  customOptions: {
    description: 'Defines custom options for messages, fields, files, etc.',
    content: `syntax = "proto3";

package sample;

import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  optional string custom_option = 50001;
}

message SampleCustomOptions {
  string name = 1 [(custom_option) = "Custom Option Value"];
}
`
  },
  reserved: {
    description: 'Specifies fields that should not be used in the future to avoid conflicts.',
    content: `syntax = "proto3";

package sample;

message SampleReserved {
  reserved 2, 15, "old_name";
  string name = 1;
  int32 id = 3;
}
`
  },
  defaultValue: {
    description: 'Specifies default values for fields.',
    content: `syntax = "proto3";

package sample;

message SampleDefaultValue {
  string name = 1 [default = "default_name"];
  int32 id = 2 [default = 1234];
}
`
  },
  comments: {
    description: 'Adds comments to describe the purpose of messages and fields.',
    content: `syntax = "proto3";

package sample;

// This is a sample message with comments
message SampleComments {
  // The name of the object
  string name = 1;
  // The ID of the object
  int32 id = 2;
}
`
  },
  financialCalculation: {
    description: 'Defines a complex financial calculation including interest and amortization schedules.',
    content: `syntax = "proto3";

package financial;

// Message to represent a financial instrument
message FinancialInstrument {
  string instrument_id = 1;
  string instrument_type = 2;  // e.g., "loan", "bond", "stock"
  double principal_amount = 3;
  double interest_rate = 4;
  int32 term_in_months = 5;
}

// Message to represent an amortization schedule entry
message AmortizationEntry {
  int32 month = 1;
  double principal_payment = 2;
  double interest_payment = 3;
  double remaining_balance = 4;
}

// Message to represent an amortization schedule
message AmortizationSchedule {
  repeated AmortizationEntry entries = 1;
}

// Message to represent a financial calculation request
message FinancialCalculationRequest {
  FinancialInstrument instrument = 1;
  string calculation_type = 2;  // e.g., "amortization", "interest"
}

// Message to represent a financial calculation response
message FinancialCalculationResponse {
  oneof calculation_result {
    double total_interest = 1;
    AmortizationSchedule amortization_schedule = 2;
  }
}

// Service to perform financial calculations
service FinancialCalculationService {
  rpc Calculate (FinancialCalculationRequest) returns (FinancialCalculationResponse);
}
`
  },
  simpleCalculation: {
    description: 'Defines a simple arithmetic calculation (addition, subtraction, multiplication, division).',
    content: `syntax = "proto3";

package calculation;

// Message to represent a simple calculation request
message SimpleCalculationRequest {
  double number1 = 1;
  double number2 = 2;
  string operation = 3;  // e.g., "addition", "subtraction", "multiplication", "division"
}

// Message to represent a simple calculation response
message SimpleCalculationResponse {
  double result = 1;
}

// Service to perform simple calculations
service SimpleCalculationService {
  rpc Calculate (SimpleCalculationRequest) returns (SimpleCalculationResponse);
}
`
  }
};

const questions = [
  {
    type: 'list',
    name: 'action',
    message: `${chalk.bold.underline.blueBright('Select an action:')}`,
    choices: [
      { name: chalk.yellowBright('Create a protobuf sample'), value: 'create' },
      { name: chalk.yellowBright('Convert a file to protobuf'), value: 'convert' }
    ],
  },
  {
    type: 'list',
    name: 'sampleType',
    message: chalk.bold.underline.blueBright('Select the type of protobuf sample you want to create:'),
    choices: Object.keys(samples).map(key => ({
      name: `${chalk.yellowBright(key)} - ${chalk.grey(samples[key].description)}`,
      value: key
    })),
    when: answers => answers.action === 'create',
  },
  {
    type: 'input',
    name: 'fileName',
    message: chalk.magenta('File name for your protobuf sample:'),
    default: 'sample',
    when: answers => answers.action === 'create',
    validate: (input) => {
      // Strip any file extension if user adds one
      const nameWithoutExt = path.parse(input).name;
      if (nameWithoutExt !== input) {
        return `Please enter the name without extension (using: ${nameWithoutExt})`;
      }
      return true;
    }
  },
  {
    type: 'input',
    name: 'directory',
    message: chalk.dim.blue('The directory in which to save your protobuf sample:'),
    default: './protos',
    when: answers => answers.action === 'create',
    validate: (input) => {
      try {
        const absolutePath = path.resolve(input);
        const projectRoot = path.resolve('.');
        
        if (!absolutePath.startsWith(projectRoot)) {
          return `Invalid path: Must be within project directory (${projectRoot})`;
        }
        
        return true;
      } catch (error) {
        return `Invalid path: ${error.message}`;
      }
    }
  },
  {
    type: 'list',
    name: 'language',
    message: chalk.bold.blue('Select the language of the file to convert:'),
    choices: [
      { name: 'TypeScript', value: 'typescript' },
      // Add more languages here as needed
    ],
    when: answers => answers.action === 'convert',
  },
  {
    type: 'input',
    name: 'inputFile',
    message: chalk.magentaBright('Enter the path to the file:'),
    when: answers => answers.action === 'convert',
  },
  {
    type: 'input',
    name: 'outputFile',
    message: chalk.magentaBright('Enter the output protobuf file name (with .proto extension):'),
    default: 'converted.proto',
    when: answers => answers.action === 'convert',
  },
];

// Validate the provided path to prevent path injection
function validatePath(directory) {
  const absolutePath = path.resolve(directory);
  const projectRoot = path.resolve('.');
  
  if (!absolutePath.startsWith(projectRoot)) {
    throw new Error('Path must be within project directory');
  }
  
  return absolutePath;
}

// Function to convert TypeScript function to protobuf
function convertTsFunctionToProtobuf(inputFile, outputFile) {
  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const sourceFile = ts.createSourceFile(inputFile, fileContent, ts.ScriptTarget.ES2015, true);

  let serviceName = '';
  let rpcName = '';
  let requestMessage = '';
  let responseMessage = '';

  ts.forEachChild(sourceFile, node => {
    if (ts.isFunctionDeclaration(node)) {
      if (node.name) {
        serviceName = node.name.text;
        rpcName = node.name.text;
      }
      if (node.parameters) {
        requestMessage = 'message ' + rpcName + 'Request {\n';
        node.parameters.forEach((param, index) => {
          requestMessage += `  ${convertTsTypeToProto(param.type)} ${param.name.getText()} = ${index + 1};\n`;
        });
        requestMessage += '}\n';
      }
      if (node.type) {
        responseMessage = 'message ' + rpcName + 'Response {\n';
        responseMessage += `  ${convertTsTypeToProto(node.type)} result = 1;\n`;
        responseMessage += '}\n';
      }
    }
  });

  const protoContent = `
syntax = "proto3";

package converted;

service ${serviceName}Service {
  rpc ${rpcName} (${rpcName}Request) returns (${rpcName}Response);
}

${requestMessage}

${responseMessage}
`;

  fs.writeFileSync(outputFile, protoContent);
  console.log(chalk.bold.grey(`\nProtobuf file ${chalk.magentaBright(outputFile)} has been created.\n`));
  console.log(chalk.bold.blue('Thank you for using DataLoom!'));
}

// Function to convert TypeScript types to protobuf types
function convertTsTypeToProto(tsType) {
  switch (tsType.kind) {
    case ts.SyntaxKind.NumberKeyword:
      return 'double';
    case ts.SyntaxKind.StringKeyword:
      return 'string';
    case ts.SyntaxKind.BooleanKeyword:
      return 'bool';
    default:
      return 'string'; // default to string for unknown types
  }
}

// Function to validate file extension
function validateFileExtension(filePath, expectedExtension) {
  return path.extname(filePath) === expectedExtension;
}

console.log(`${chalk.bold.bgBlack.whiteBright('DataLoom. Your source of truth for critical business logic.')} \n`)
inquirer.prompt(questions)
.then((answers) => {
  if (answers.action === 'create') {
    const { sampleType, fileName, directory } = answers;
    const protoContent = samples[sampleType].content;
    
    // Always use name without extension
    const nameWithoutExt = path.parse(fileName).name;
    const absolutePath = path.resolve(directory);
    const filePath = path.join(absolutePath, `${nameWithoutExt}.proto`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, protoContent);
    console.log(chalk.bold.grey(`\nProtobuf file ${chalk.magentaBright(`${nameWithoutExt}.proto`)} has been created at ${chalk.yellow(filePath)}. 🤙🏻 \n`));
    console.log(chalk.bold.bgBlack.whiteBright('Thank you for using DataLoom 😘'));
  } else if (answers.action === 'convert') {
    const { language, inputFile, outputFile } = answers;

    if (language === 'typescript' && !validateFileExtension(inputFile, '.ts')) {
      console.log(chalk.bold.red('\nInvalid file extension. Please provide a TypeScript (.ts) file.\n'));
      return;
    }

    convertTsFunctionToProtobuf(inputFile, outputFile);
  }
})
.catch((error) => {
  if (error.isTtyError) {
    console.log(chalk.red('\nPrompt couldn\'t be rendered in the current environment.\n'));
  } else if (error.message.match(/^User force closed the prompt/)) {
    cleanup();
  } else {
    console.log(chalk.red(`\nAn error occurred: ${error.message}\n`));
  }
  process.exit(1);
});

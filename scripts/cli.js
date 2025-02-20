import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'node:fs';
import * as ck from 'chalk';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, filePath), 'utf8'));
};

const chalk = new ck.Chalk({level: 3})

// Cleanup function to handle graceful shutdown
function cleanup() {
  console.log(chalk.gray('\nCleaning up...'));
  console.log(chalk.yellow('Goodbye!\n'));
  process.exit(0);
}

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

const protoSamples = {
  eventSourcing: {
    description: 'Pattern for capturing all changes to an application state as a sequence of events.',
    content: `syntax = "proto3";

package sample;

message Event {
  string event_id = 1;
  int64 timestamp = 2;
  string aggregate_id = 3;
  
  oneof event_type {
    UserCreated user_created = 4;
    UserUpdated user_updated = 5;
    UserDeleted user_deleted = 6;
  }
}

message UserCreated {
  string email = 1;
  string username = 2;
}

message UserUpdated {
  map<string, string> changed_fields = 1;
}

message UserDeleted {
  string reason = 1;
}
`
  },
  auditTrail: {
    description: 'Pattern for tracking who created or modified an entity and when.',
    content: `syntax = "proto3";

package sample;

message AuditableEntity {
  string entity_id = 1;
  AuditInfo audit_info = 2;
  oneof entity {
    User user = 3;
    Order order = 4;
    Product product = 5;
  }
}

message AuditInfo {
  string created_by = 1;
  int64 created_at = 2;
  string last_modified_by = 3;
  int64 last_modified_at = 4;
  int32 version = 5;
}

message User {
  string user_id = 1;
  string name = 2;
}

message Order {
  string order_id = 1;
  double amount = 2;
}

message Product {
  string product_id = 1;
  string name = 2;
}
`
  },
  softDelete: {
    description: 'Pattern for marking entities as deleted without physically removing them from the database.',
    content: `syntax = "proto3";

package sample;

message SoftDeletableEntity {
  bool is_deleted = 1;
  int64 deleted_at = 2;
  string deleted_by = 3;
  string deletion_reason = 4;
  
  // Original entity data
  oneof entity_data {
    User user = 5;
    Product product = 6;
  }
}

message User {
  string user_id = 1;
  string name = 2;
}

message Product {
  string product_id = 1;
  string name = 2;
}
`
  },
  compositeHierarchy: {
    description: 'Pattern for modeling hierarchical data structures like organizational charts.',
    content: `syntax = "proto3";

package sample;

message Organization {
  string org_id = 1;
  string name = 2;
  repeated Department departments = 3;
}

message Department {
  string dept_id = 1;
  string name = 2;
  repeated Team teams = 3;
}

message Team {
  string team_id = 1;
  string name = 2;
  repeated string member_ids = 3;
}
`
  },
  polymorphicRelationship: {
    description: 'Pattern for modeling relationships between different types of entities.',
    content: `syntax = "proto3";

package sample;

message Comment {
  string comment_id = 1;
  string content = 2;
  
  // Polymorphic relationship
  string target_type = 3;  // "post", "image", "product"
  string target_id = 4;
  
  int64 created_at = 5;
  string created_by = 6;
}
`
  },
  timeSeries: {
    description: 'Pattern for storing time-series data with support for different value types and labels.',
    content: `syntax = "proto3";

package sample;

message TimeSeriesData {
  string metric_name = 1;
  repeated DataPoint data_points = 2;
  
  message DataPoint {
    int64 timestamp = 1;
    oneof value {
      double numeric_value = 2;
      string categorical_value = 3;
    }
    map<string, string> labels = 4;
  }
}
`
  },
  featureFlags: {
    description: 'Pattern for managing feature flags with granular control over users and parameters.',
    content: `syntax = "proto3";

package sample;

message FeatureFlags {
  map<string, Feature> features = 1;
  
  message Feature {
    bool enabled = 1;
    string version = 2;
    map<string, string> parameters = 3;
    repeated string allowed_users = 4;
    repeated string allowed_groups = 5;
  }
}
`
  },
  versionedConfig: {
    description: 'Pattern for managing versioned configuration with support for different value types.',
    content: `syntax = "proto3";

package sample;

message Configuration {
  oneof config_version {
    ConfigV1 v1 = 1;
    ConfigV2 v2 = 2;
  }
  
  message ConfigV1 {
    map<string, string> settings = 1;
  }
  
  message ConfigV2 {
    map<string, ConfigValue> settings = 1;
    
    message ConfigValue {
      oneof value {
        string string_value = 1;
        int32 int_value = 2;
        bool bool_value = 3;
        ConfigObject object_value = 4;
      }
    }
    
    message ConfigObject {
      map<string, string> properties = 1;
    }
  }
}
`
  },
  stateTransition: {
    description: 'Pattern for modeling entities with well-defined state transitions.',
    content: `syntax = "proto3";

package sample;

message Order {
  string order_id = 1;
  
  enum Status {
    STATUS_UNSPECIFIED = 0;
    CREATED = 1;
    PAID = 2;
    SHIPPED = 3;
    DELIVERED = 4;
    CANCELLED = 5;
    REFUNDED = 6;
  }
  
  Status status = 2;
  int64 last_updated = 3;
  repeated StatusTransition status_history = 4;
}

message StatusTransition {
  int64 timestamp = 1;
  Order.Status from_status = 2;
  Order.Status to_status = 3;
  string reason = 4;
  string performed_by = 5;
}
`
  }
};

const jsonLogicSamples = {
  orderCalculation: {
    description: 'Calculate order total with tax and discounts',
    content: loadJsonFile('../jsonlogic/rules/order_calculation.json'),
  },
  userEligibility: {
    description: 'Determine if user is eligible for premium features',
    content: loadJsonFile('../jsonlogic/rules/user_eligibility.json'),
  },
  dynamicPricing: {
    description: 'Calculate product price based on quantity, season, and user tier',
    content: loadJsonFile('../jsonlogic/rules/dynamic_pricing.json'),
  },
  riskAssessment: {
    description: 'Calculate risk score based on multiple factors',
    content: loadJsonFile('../jsonlogic/rules/risk_assessment.json'),
  }
};

const questions = [
  {
    type: 'list',
    name: 'generatorType',
    message: chalk.bold.underline.blueBright('What type of sample would you like to generate?'),
    choices: [
      { name: 'Protobuf Data Model', value: 'proto' },
      { name: 'JsonLogic Business Rules', value: 'jsonlogic' }
    ]
  },
  {
    type: 'list',
    name: 'sampleType',
    message: chalk.bold.underline.blueBright('Select a protobuf data modeling pattern to generate:'),
    choices: Object.keys(protoSamples).map(key => ({
      name: `${chalk.yellowBright(key)} - ${chalk.grey(protoSamples[key].description)}`,
      value: key
    })),
    when: (answers) => answers.generatorType === 'proto'
  },
  {
    type: 'list',
    name: 'sampleType',
    message: chalk.bold.underline.blueBright('Select a JsonLogic business rule to generate:'),
    choices: Object.keys(jsonLogicSamples).map(key => ({
      name: `${chalk.yellowBright(key)} - ${chalk.grey(jsonLogicSamples[key].description)}`,
      value: key
    })),
    when: (answers) => answers.generatorType === 'jsonlogic'
  },
  {
    type: 'input',
    name: 'fileName',
    message: (answers) => chalk.magenta(`File name for your ${answers.generatorType === 'proto' ? 'protobuf' : 'JsonLogic'} sample:`),
    default: (answers) => answers.generatorType === 'proto' ? 'sample' : answers.sampleType,
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
    message: (answers) => chalk.dim.blue(`The directory in which to save your ${answers.generatorType === 'proto' ? 'protobuf' : 'JsonLogic'} sample:`),
    default: (answers) => answers.generatorType === 'proto' ? './protos' : './jsonlogic/rules',
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
  }
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

console.log(`${chalk.bold.bgBlack.whiteBright('DataLoom. Your source of truth for critical business logic.')} \n`)
inquirer.prompt(questions)
.then((answers) => {
  const { generatorType, sampleType, fileName, directory } = answers;
  const nameWithoutExt = path.parse(fileName).name;
  const absolutePath = path.resolve(directory);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
  
  if (generatorType === 'proto') {
    const protoContent = protoSamples[sampleType].content;
    const filePath = path.join(absolutePath, `${nameWithoutExt}.proto`);
    
    fs.writeFileSync(filePath, protoContent);
    console.log(chalk.bold.grey(`\nProtobuf file ${chalk.magentaBright(`${nameWithoutExt}.proto`)} has been created at ${chalk.yellow(filePath)}. 🤙🏻 \n`));
  } else {
    const jsonLogicContent = JSON.stringify(jsonLogicSamples[sampleType].content, null, 2);
    const filePath = path.join(absolutePath, `${nameWithoutExt}.json`);
    
    fs.writeFileSync(filePath, jsonLogicContent);
    console.log(chalk.bold.grey(`\nJsonLogic file ${chalk.magentaBright(`${nameWithoutExt}.json`)} has been created at ${chalk.yellow(filePath)}. 🤙🏻 \n`));
  }
  
  console.log(chalk.bold.bgBlack.whiteBright('Thank you for using DataLoom 😘'));
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

#!/usr/bin/env node

const protobuf = require('protobufjs');
const path = require('node:path');
const fs = require('node:fs');

// Proto to SQL type mapping
const protoToSnowflake = {
  string: 'VARCHAR',
  int32: 'INTEGER',
  int64: 'BIGINT',
  float: 'FLOAT',
  double: 'DOUBLE',
  bool: 'BOOLEAN',
  google_protobuf_Timestamp: 'TIMESTAMP_NTZ',
};

// Proto to JSON Schema type mapping
const protoToJsonSchema = {
  string: 'string',
  int32: 'integer',
  int64: 'integer',
  float: 'number',
  double: 'number',
  bool: 'boolean',
  google_protobuf_Timestamp: 'string',
};

function generateJsonSchema(root, messageName) {
  const message = root.lookupType(messageName);
  const properties = {};
  
  for (const field of message.fieldsArray) {
    const type = field.type;
    if (field.map) {
      properties[field.name] = {
        type: 'object',
        additionalProperties: {
          type: protoToJsonSchema[field.keyType] || 'string'
        }
      };
    } else if (field.repeated) {
      properties[field.name] = {
        type: 'array',
        items: {
          type: protoToJsonSchema[type] || 'string'
        }
      };
    } else {
      properties[field.name] = {
        type: protoToJsonSchema[type] || 'string'
      };
    }
  }

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties
  };
}

function generateSnowflakeTable(root, messageName) {
  const message = root.lookupType(messageName);
  const tableName = message.name.toUpperCase();
  let sql = `CREATE OR REPLACE TABLE ${tableName} (\n`;
  
  const columns = message.fieldsArray.map(field => {
    const type = field.type;
    if (field.map) {
      return `  ${field.name} VARIANT`; // Store maps as VARIANT
    }
    
    if (field.repeated) {
      return `  ${field.name} ARRAY`; // Store arrays as ARRAY
    } 

    return `  ${field.name} ${protoToSnowflake[type] || 'VARCHAR'}`;
    
  });

  sql += columns.join(',\n');
  sql += '\n);\n';

  // Create a flattened view for Tableau
  if (message.fieldsArray.some(f => f.map || f.repeated)) {
    sql += `\nCREATE OR REPLACE VIEW ${tableName}_FLATTENED AS\nSELECT\n`;
    
    const viewColumns = message.fieldsArray.map(field => {
      if (field.map) {
        return `  f.value::string as ${field.name}`;
      }
      
      if (field.repeated) {
        return `  f.value as ${field.name}`;
      }
        return `  ${field.name}`;
      
    });

    sql += viewColumns.join(',\n');
    sql += `\nFROM ${tableName}\n`;
    sql += `CROSS JOIN LATERAL FLATTEN(input => ${message.fieldsArray.find(f => f.map || f.repeated).name}) f;\n`;
  }

  return sql;
}

try {
  const protoDir = path.join(__dirname, '..', 'protos');
  const outDir = path.join(__dirname, '..', 'generated', 'data');
  
  // Create output directory
  fs.mkdirSync(outDir, { recursive: true });
  
  // Load and parse proto file
  protobuf.load(path.join(protoDir, 'example.proto'), (err, root) => {
    if (err) throw err;

    // Generate for each message type
    const messages = ['business_logic.UrlAnalyticsRequest', 'business_logic.UrlAnalyticsResponse'];
    
    for (const messageName of messages) {
      // Generate JSON Schema
      const jsonSchema = generateJsonSchema(root, messageName);
      fs.writeFileSync(
        path.join(outDir, `${messageName.split('.')[1]}.schema.json`),
        JSON.stringify(jsonSchema, null, 2)
      );

      // Generate Snowflake DDL
      const snowflakeSQL = generateSnowflakeTable(root, messageName);
      fs.writeFileSync(
        path.join(outDir, `${messageName.split('.')[1]}.snowflake.sql`),
        snowflakeSQL
      );
    }

    // Generate enum table for AnalyticsParams
    const enumType = root.lookupEnum('business_logic.AnalyticsParams');
    let enumSQL = 'CREATE OR REPLACE TABLE ANALYTICS_PARAMS (\n';
    enumSQL += '  id INTEGER,\n';
    enumSQL += '  name VARCHAR\n';
    enumSQL += ');\n\n';
    
    // Insert statements for enum values
    enumSQL += 'INSERT INTO ANALYTICS_PARAMS (id, name) VALUES\n';
    const values = Object.entries(enumType.values)
      .map(([name, id]) => `  (${id}, '${name}')`)
      .join(',\n');
    enumSQL += `${values};\n`;

    fs.writeFileSync(
      path.join(outDir, 'AnalyticsParams.snowflake.sql'),
      enumSQL
    );

    console.log('Data warehouse files generated successfully!');
  });} catch (error) {
  console.error('Error generating data warehouse files:', error);
  process.exit(1);
}

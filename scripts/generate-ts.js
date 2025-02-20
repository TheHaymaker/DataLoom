#!/usr/bin/env node

const { execSync } = require('node:child_process');
const path = require('node:path');

try {
  // Assuming the proto files are in the protos directory
  const protoDir = path.join(__dirname, '..', 'protos');
  const outDir = path.join(__dirname, '..', 'generated', 'ts', 'protobuf');

  // Create output directory if it doesn't exist
  execSync(`mkdir -p ${outDir}`);

  // Generate TypeScript code from proto files
  execSync(`protoc \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=${outDir} \
    --ts_proto_opt=esModuleInterop=true,outputJsonMethods=true,useEnumNames=true \
    --proto_path=${protoDir} \
    --proto_path=/opt/homebrew/Cellar/protobuf/29.3/include \
    ${protoDir}/*.proto`,
    { stdio: 'inherit' }
  );

  console.log('TypeScript files generated successfully!');
} catch (error) {
  console.error('Error generating TypeScript files:', error);
  process.exit(1);
}

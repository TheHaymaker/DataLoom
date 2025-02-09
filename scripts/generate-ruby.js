#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

try {
  // Assuming the proto files are in the protos directory
  const protoDir = path.join(__dirname, '..', 'protos');
  const outDir = path.join(__dirname, '..', 'generated', 'ruby');

  // Create output directory if it doesn't exist
  execSync(`mkdir -p ${outDir}`);

  // Generate Ruby code from proto files
  execSync(`protoc \
    --ruby_out=${outDir} \
    --proto_path=${protoDir} \
    --proto_path=/opt/homebrew/Cellar/protobuf/29.3 \
    ${protoDir}/*.proto`,
    { stdio: 'inherit' }
  );

  console.log('Ruby files generated successfully!');
} catch (error) {
  console.error('Error generating Ruby files:', error);
  process.exit(1);
}

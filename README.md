# Protobuf IR Project

This project translates and generates protobuf interfaces into both TypeScript modules and Ruby gems.

## Prerequisites

- `protoc` (Protocol Buffers compiler)
- `protoc-gen-ts` (TypeScript plugin for `protoc`)
- `ruby` (for Ruby gem generation)

## Setup

For Ruby gem generation:

```sh
# Install protobuf compiler
brew install protobuf

# Install google-protobuf gem in Gemfile
bundle install

# OR

# Install ruby protobuf gem
gem install google-protobuf
```

For TypeScript generation:

```sh
npm install
```

## Generate TypeScript Modules

Run the following script to generate TypeScript modules from the protobuf schema:

```sh
./scripts/generate_ts.sh
```

The generated files will be located in the `ts_out` directory.

## Generate Ruby Gems

Run the following script to generate Ruby gems from the protobuf schema:

```sh
./scripts/generate_ruby.sh
```

The generated files will be located in the `ruby_out` directory.

## Generate Intermediate Representation (IR)

Run the following script to generate the intermediate representation from the protobuf schema:

```sh
./scripts/generate_ir.sh
```

The generated files will be located in the `ir_out` directory.

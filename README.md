# Protobuf IR Project

This project translates and generates protobuf interfaces into both TypeScript modules and Ruby gems (for now - more target outputs to come)

## Prerequisites

- `protoc` (Protocol Buffers compiler)
- `protoc-gen-ts` (TypeScript plugin for `protoc`)
- `ruby` (for Ruby gem generation)
- `node` (see .nvmrc for LTS version)

## Setup

For Ruby gem generation:

```sh
# Install protobuf compiler
brew install protobuf
```

AND

```sh
# Install google-protobuf gem in Gemfile
bundle install
```

OR

```sh
# Install ruby protobuf gem
gem install google-protobuf
```

For TypeScript generation:

```sh
npm install
```


## Generate Usable Outputs from Intermediate Representation (IR)

Run the following script to generate the source code targets from the IR protobuf schema. We use the `protoc` compiler to generate the TypeScript and Ruby code from the protobuf schema. We chose to abstract these bash commands into a Nodee script to make it easier to run and maintain (avoid forcing users to modify local file permissions to make the bash scripts executable, for instance). The node scripts should just work.


### Generate TypeScript Modules

Run the following script to generate TypeScript modules from the protobuf schema:

```sh
npm run generate:ts
```

The generated files will be located in the `generated/ts` directory.


### Generate Ruby Gems

Run the following script to generate Ruby gems from the protobuf schema:

```sh
npm run generate:ruby
```

The generated files will be located in the `generated/ruby` directory.


## To Do

- [ ] Provide a way to generate the protobuf schema from the TypeScript and Ruby modules.
- [ ] Provide a means of publishing the generated TypeScript and Ruby modules to a package registry.
- [ ] Provide a means to specific a package registry namespace (e.g., `@my-org/my-package`) for the generated modules.
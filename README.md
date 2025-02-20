# DataLoom

![DataLoom Logo](https://github.com/TheHaymaker/DataLoom/blob/main/dataloom-small.png)

DataLoom weaves together different data representations and business logic across languages and platforms, creating a unified fabric of consistent data models.

Intermediate Representation (IR) is a common language for representing data models and business logic. It's a core component of the DataLoom.

> Haven't heard of IR before?
>
> Not sure what a protobuf is or how to map your schemas to a protobuf?
>
> We got you covered. Our CLI docs empower you with sample protobuf defintions for common 
> problems and data structures. The CLI will help guide you and give you the tools to 
> start defining your data models in protobuf format. Our sample protobuf definitions are 
> designed to be used as a starting point for your own data models, and they can be 
> easily adapted to fit your specific needs.
>
> We prioritize the shape, structure and hierarchy of the data.
>

## Overview

This project is heavily inspired by [Morphir](https://github.com/finos/morphir) - albeit at a much smaller and more localized scale.

Encapsulate business logic in a single place and distribute it across different programming languages, teams and applications. This allows for strong data integrity and consistency across the organization.

It focuses on generating TypeScript modules, Ruby gems, and SQL schemas from protobuf interfaces. The project is designed to provide a comprehensive solution for working with protobuf interfaces in various programming languages and databases (with Snowflake DDL, fivetran, and Tableau support in mind).

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

## CLI Workflows

DataLoom tries to empower you to start using `protobufs-as-intermediate-representation` quickly via its CLI:

### Create Protobuf Sample

This workflow allows you to create sample protobuf files from predefined templates. These templates cover common use cases that prioritize the shape, structure and hierarhcy of the data.

https://github.com/user-attachments/assets/61d706ca-d890-4944-a2d7-fd36e29be586


## Generate Usable Outputs from Intermediate Representation (IR)

Run the following script to generate the source code targets from the IR protobuf schema. We use the `protoc` compiler to generate the TypeScript and Ruby code from the protobuf schema. We chose to abstract these bash commands into a Nodee script to make it easier to run and maintain (avoid forcing users to modify local file permissions to make the bash scripts executable, for instance). The node scripts should just work.


To generate new targets, run the following script:

```sh
npm run generate:all
```

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


### Generate Data Warehouse Assets

Run the following script to generate data warehouse-friendly formats from the protobuf schema:

```sh
npm run generate:data
```

This generates:

1. Snowflake DDL files (`*.snowflake.sql`):
   - Tables for storing protobuf message data
   - Flattened views optimized for Tableau
   - Lookup tables for enum values

2. JSON Schema files (`*.schema.json`):
   - Fivetran-compatible schemas
   - Proper type mappings for all fields

The generated files will be located in the `generated/data` directory.

## Quick Example

Using an IR representation of a data model, we can generate a variety of outputs, including TypeScript modules, Ruby gems, and SQL schemas.

For instance, we can transform the following protobuf schema:

```protobuf
syntax = "proto3";

package VisitId;

message VisitIdBusinessLogic {
  string name = 1;
  int32 cookieExpiration = 2;
  bool contains_attribution_query_params = 3;
  
  oneof visit_id_source {
    string visit_id = 4;
    string cookie_name = 5;  // If provided, the visit_id will be parsed from this cookie
  }
  map<string, string> attribution_params = 6;
}

message AttributionParams {
  map<string, string> params = 1;
}

// These are the valid keys for attribution_params
message AttributionParamKeys {
  string url_params = 1;
  string utm_source = 2;
  string utm_medium = 3;
  string utm_campaign = 4;
  string utm_term = 5;
  string utm_content = 6;
  string gclid = 7;
  string fbclid = 8;
  string msclkid = 9;
  string dclid = 10;
  string ad_id = 11;
  string ad_name = 12;
  string ad_group_id = 13;
  string ad_group_name = 14;
  string gtm_id = 15;
  string gtm_event = 16;
  string gtm_trigger = 17;
  string gtm_variable = 18;
  string gtm_data_layer = 19;
  string gtm_container = 20;
  string gtm_account = 21;
  string gtm_workspace = 22;
  string gtm_version = 23;
  string gtm_environment = 24;
}

```

Then, we can generate a TypeScript module. When we do this, we get the following TypeScript module:

```ts
export const protobufPackage = "VisitId";

export interface VisitIdBusinessLogic {
  name: string;
  cookieExpiration: number;
  containsAttributionQueryParams: boolean;
  visitId?:
    | string
    | undefined;
  /** If provided, the visit_id will be parsed from this cookie */
  cookieName?: string | undefined;
  attributionParams: { [key: string]: string };
}

export interface VisitIdBusinessLogic_AttributionParamsEntry {
  key: string;
  value: string;
}

export interface AttributionParams {
  params: { [key: string]: string };
}

export interface AttributionParams_ParamsEntry {
  key: string;
  value: string;
}

/** These are the valid keys for attribution_params */
export interface AttributionParamKeys {
  urlParams: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  fbclid: string;
  msclkid: string;
  dclid: string;
  adId: string;
  adName: string;
  adGroupId: string;
  adGroupName: string;
  gtmId: string;
  gtmEvent: string;
  gtmTrigger: string;
  gtmVariable: string;
  gtmDataLayer: string;
  gtmContainer: string;
  gtmAccount: string;
  gtmWorkspace: string;
  gtmVersion: string;
  gtmEnvironment: string;
}

function createBaseVisitIdBusinessLogic(): VisitIdBusinessLogic {
  return {
    name: "",
    cookieExpiration: 0,
    containsAttributionQueryParams: false,
    visitId: undefined,
    cookieName: undefined,
    attributionParams: {},
  };
}
```

Which can then be used in a TypeScript application as follows:

```typescript
import { VisitIdBusinessLogic, AttributionParamKeys } from './generated/ts/visitIdBusinessLogic';

// Create a type for valid attribution param keys
type AttributionParamKey = keyof AttributionParamKeys;

const visitCookieDetails = VisitIdBusinessLogic.create({
  attributionParams: {
    'utm_source': 'kdjflkdjfsl',  // TypeScript will know these are valid keys
    'utm_medium': 'social'
  }
});

// You can also type your params object
const params: Record<AttributionParamKey, string> = {
  utm_source: 'kdjflkdjfsl',
  gcl_test: 'test'  // TypeScript error: 'gcl_test' is not a valid AttributionParamKey
};

// Access values safely
const sourceValue = visitCookieDetails.attributionParams['utm_source'];
```

By leveraging protobuf -- and its mature codegen ecosystem and cross-language support -- we can generate a variety of outputs, including TypeScript modules, Ruby gems, and SQL schemas (and more!) while focusing on the shape, structure and hierarchy of our data models. 

In addition to modeling data, we can also use JsonLogic to build complex business logic as well.

## Business Logic Engine Implementation

DataLoom generates strongly-typed business logic engines for both TypeScript and Ruby from the same JSON Logic rules. This ensures consistent business logic across your applications while leveraging each language's strengths.

It accomplishes this by using a common business-logic format [JsonLogic](https://jsonlogic.com), and exposes sample implementations (as we do in protobufs) to get you started.


https://github.com/user-attachments/assets/58d16611-7eb2-416c-a540-e017f3e548ab

As a user, you're then able to `apply` the rules of that business logic directly to your data. Sample implementations break it down for you below.


### TypeScript Implementation

The TypeScript implementation provides strong typing and modern ES6+ features:

```typescript
// Type-safe rule definitions
type DynamicPricingRule = {
  "*": [
    { "var": "product.base_price" },
    { "if": [{ ">=": [{ "var": "quantity" }, 10] }, 0.9, 1] },
    // ... more rules
  ]
};

// Strongly typed data interfaces
type DynamicPricingData = {
  product: {
    base_price: number;
  };
  quantity: number;
  season: string;
  user: {
    tier: string;
  };
};

// Type-safe business logic engine
export const BusinessLogicEngine = {
  apply<T>(rules: JsonLogicRule, data: unknown): RuleResult<T> {
    return jsonLogic.apply(rules, data) as RuleResult<T>;
  },
  
  dynamicPricing(data: DynamicPricingData): number {
    // Implementation with type checking
  }
};
```

### Ruby Implementation

The Ruby implementation focuses on clean, documented class methods:

```ruby
module BusinessLogic
  class Engine
    class << self
      # Rule definitions with Ruby syntax
      DYNAMIC_PRICING_RULES = {
        "*" => [
          { "var" => "product.base_price" },
          { "if" => [{ ">=" => [{ "var" => "quantity" }, 10] }, 0.9, 1] },
          # ... more rules
        ]
      }

      # Documented method with example usage
      # @param data [Hash] The data to evaluate
      # @return [Object] The result
      # @example
      #   data = {"product" => {"base_price" => 100}}
      #   result = Engine.dynamic_pricing(data)
      def dynamic_pricing(data)
        apply(DYNAMIC_PRICING_RULES, data)
      end
    end
  end
end
```

### Key Differences

1. **Type Safety**
   - TypeScript: Compile-time type checking with interfaces
   - Ruby: Runtime type checking with optional documentation

2. **Method Organization**
   - TypeScript: Namespace object with typed methods
   - Ruby: Class methods with yard-style documentation

3. **Rule Definition**
   - TypeScript: Type-safe rule templates
   - Ruby: Hash constants with symbol keys

### Usage Comparison

```typescript
// TypeScript
const orderData: OrderCalculationData = {
  order: {
    items: [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 }
    ],
    discount_percentage: 0.1,
    tax_rate: 0.08
  }
};
const total = BusinessLogicEngine.orderCalculation(orderData);
```

```ruby
# Ruby
order_data = {
  "order" => {
    "items" => [
      { "price" => 10, "quantity" => 2 },
      { "price" => 20, "quantity" => 1 }
    ],
    "discount_percentage" => 0.1,
    "tax_rate" => 0.08
  }
}
total = BusinessLogic::Engine.order_calculation(order_data)
```

Both implementations produce identical results:

```typescript
// Result of order calculation example:
// total = 44.172000000000004 (calculated as follows):
// 1. Sum of items: (10 * 2) + (20 * 1) = 40
// 2. Apply discount: 40 * (1 - 0.1) = 36
// 3. Apply tax: 36 * (1 + 0.08) = 44.172000000000004
```

### Testing Cross-Language Consistency

DataLoom ensures business logic consistency across languages through automated testing. Here's how we verify identical behavior:

```typescript
// TypeScript test runner (scripts/test-runner.ts)
import { BusinessLogicEngine } from '../generated/ts/jsonlogic/index.js';

const testCases = {
  orderCalculation: {
    data: {
      order: {
        items: [
          { price: 10, quantity: 2 },
          { price: 20, quantity: 1 }
        ],
        discount_percentage: 0.1,
        tax_rate: 0.08
      }
    }
  }
  // ... other test cases
};

// Run tests and output results
for (const [testName, { data }] of Object.entries(testCases)) {
  const result = BusinessLogicEngine[testName](data);
  console.log(`${testName}:${JSON.stringify(result)}`);
}
```

```ruby
# Ruby test runner (within compare-outputs.sh)
test_cases = {
  "orderCalculation" => {
    "data" => {
      "order" => {
        "items" => [
          {"price" => 10, "quantity" => 2},
          {"price" => 20, "quantity" => 1}
        ],
        "discount_percentage" => 0.1,
        "tax_rate" => 0.08
      }
    }
  }
  # ... other test cases
}

test_cases.each do |test_name, test_data|
  method_name = test_name.gsub(/([A-Z])/) { "_#{$1.downcase}" }
  result = BusinessLogic::Engine.send(method_name, test_data["data"])
  puts "#{test_name}:#{formatted_result.inspect}"
end
```

The outputs are compared using a shell script that ensures both implementations produce identical results:

```bash
# Compare TypeScript and Ruby outputs
if diff -w ruby_output.txt ts_output.txt > diff_output.txt; then
  echo "✅ All tests passed! Outputs match between Ruby and TypeScript implementations."
else
  echo "❌ Test outputs differ:"
  cat diff_output.txt
fi
```

This results in the following output:

```bash
Compiling TypeScript test runner...
Running TypeScript tests...
TypeScript output:
dynamicPricing:65.02499999999999
orderCalculation:44.172000000000004
riskAssessment:80
userEligibility:true
Running Ruby tests...
Ruby output:
dynamicPricing:65.02499999999999
orderCalculation:44.172000000000004
riskAssessment:80
userEligibility:true
Comparing outputs...
✅ All tests passed! Outputs match between Ruby and TypeScript implementations.
```

This testing infrastructure ensures that:
1. Business logic remains consistent across languages
2. Changes to rules are validated in both implementations
3. Edge cases are handled identically
4. Numeric precision and type coercion behave consistently

## IR Workflow

### Without a Data Model strategy using Intermediate Representation (IR)

```mermaid
---
title: "Without DataLoom / IR"
config:
  theme: dark
---
journey
   section Engineering Logic
      Discuss, define and use logic in silo: 1: Engineering,
   section Data logic
      Discuss, define and use logic in silo: 1: Data,
   section Product logic
      Discuss, define and use logic in silo: 1: Product,
   section Marketing logic
      Discuss, define and use logic in silo: 1: Marketing,

   section Backend Engineering
      Copy/paste logic: 1: Engineering,
      Manual mapping: 1: Engineering,
      Uneven data quality: 1: Engineering,
   section Frontend Engineering
      Copy/paste logic: 1: Engineering,
      Manual mapping: 1: Engineering,
      Uneven data quality: 1: Engineering,

   section Data
   Copy/paste logic: 1: Data,
      Manual mapping: 1: Data,
      Uneven data quality: 1: Data,
   section Database I/O & Querying
      Copy/paste logic: 1: Engineering, Data,
      Manual mapping: 1: Engineering, Data,
      Uneven data quality: 1: Engineering, Data,
   section Analytics & Reporting
      Copy/paste logic: 1: Engineering, Data, Marketing,
      Manual mapping: 1: Engineering, Data, Marketing,
      Uneven data quality: 1: Engineering, Data, Marketing,
```

### After DataLoom

```mermaid
---
title: With DataLoom / IR workflow
config:
  theme: dark
---
journey
   section Create Business Logic
      Discuss: 4: Stakeholders,
      Define: 5: Stakeholders, Engineering, Product, Data, DataLoom,
      Capture: 5: Data, DataLoom,
      Refine: 5: Stakeholders, Engineering, Product, Data, DataLoom,
      Validate: 5: Stakeholders, Engineering, Product, Data, DataLoom,
      Update: 5: Stakeholders, Engineering, Product, Data, DataLoom,   

   section Distribute Business Logic
      Compile Targets: 5: Engineering, Data, DataLoom,
      Publish compiled packages: 5:  Engineering, DataLoom,
      Communicate Changelog: 5: Stakeholders, Engineering, Product, Data, DataLoom,
 
   section Consume Business Logic
      Import target packages: 5: Engineering, Data, Marketing,
      Consume classes, schemas, etc: 5:  Engineering, Data,
```

## To Do

- [ ] Provide a way to generate the protobuf schema from the TypeScript and Ruby modules.
- [ ] Provide a means of publishing the generated TypeScript and Ruby modules to a package registry.
- [ ] Provide a means to specific a package registry namespace (e.g., `@my-org/my-package`) for the generated modules.
- [ ] Provide prerequisites and dev environment setup isntructions for Windows and Linux users (only tested on macOS).
- [ ] Target additional languages
  - [ ] Scala
  - [ ] Clojure
  - [ ] Java
  - [ ] Go
  - [ ] Rust
  - [ ] JavaScript?
  - [ ] PHP
  - [ ] C
  - [ ] C++
  - [ ] C#
  - [ ] Python
  - [ ] GraphQL
  - [ ] Zig
  - [ ] Haskell
  - [ ] Bash?
  - [ ] Lua
  - [ ] Standard Schema?
  - [ ] Zod?
  - [ ] JSON Schema
  - [ ] Prisma?
  - [ ] Kotlin
  - [ ] Dart
  - [ ] Swift
  - [ ] Julia
  - [ ] R
  - [ ] Elixir
  - [ ] TB

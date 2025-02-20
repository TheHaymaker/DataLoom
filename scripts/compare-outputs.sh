#!/bin/bash

# Compile TypeScript test runner
echo "Compiling TypeScript test runner..."
npx tsc scripts/test-runner.ts --module ES2020 --target ES2020 --moduleResolution node --outDir dist

# Run TypeScript tests and capture output
echo "Running TypeScript tests..."
node dist/scripts/test-runner.js > ts_output.txt

echo "TypeScript output:"
cat ts_output.txt

# Run Ruby tests and capture output
echo "Running Ruby tests..."
ruby -r './generated/ruby/jsonlogic/engine.rb' -e '
test_cases = {
  "dynamicPricing" => {
    "data" => {
      "product" => {"base_price" => 100},
      "quantity" => 15,
      "season" => "summer",
      "user" => {"tier" => "gold"}
    }
  },
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
  },
  "riskAssessment" => {
    "data" => {
      "credit_score" => 720,
      "late_payments" => 1,
      "years_employed" => 3,
      "debt_to_income" => 0.35
    }
  },
  "userEligibility" => {
    "data" => {
      "user" => {
        "subscription_months" => 6,
        "activity_score" => 85,
        "tier" => "standard",
        "referrals" => 7,
        "account_status" => "active"
      }
    }
  }
}

test_cases.each do |test_name, test_data|
  method_name = test_name.gsub(/([A-Z])/) { "_#{$1.downcase}" }
  result = BusinessLogic::Engine.send(method_name, test_data["data"])
  # Format numbers to remove trailing .0
  formatted_result = result.is_a?(Float) && result.to_i == result ? result.to_i : result
  puts "#{test_name}:#{formatted_result.inspect}"
end
' > ruby_output.txt


echo "Ruby output:"
cat ruby_output.txt
# Compare outputs
echo "Comparing outputs..."
if diff -w ruby_output.txt ts_output.txt > diff_output.txt; then
  echo "✅ All tests passed! Outputs match between Ruby and TypeScript implementations."
else
  echo "❌ Test outputs differ:"
  cat diff_output.txt
fi

# Cleanup
rm -f ts_output.txt ruby_output.txt diff_output.txt
rm -rf dist

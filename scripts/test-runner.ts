import { BusinessLogicEngine } from '../generated/ts/jsonlogic/index.js';

// Test cases with sample data
const testCases = {
  dynamicPricing: {
    data: {
      product: { base_price: 100 },
      quantity: 15,
      season: "summer",
      user: { tier: "gold" }
    }
  },
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
  },
  riskAssessment: {
    data: {
      credit_score: 720,
      late_payments: 1,
      years_employed: 3,
      debt_to_income: 0.35
    }
  },
  userEligibility: {
    data: {
      user: {
        subscription_months: 6,
        activity_score: 85,
        tier: "standard",
        referrals: 7,
        account_status: "active"
      }
    }
  }
};

// Run all test cases
for (const [testName, { data }] of Object.entries(testCases)) {
  const result = BusinessLogicEngine[testName](data);
  console.log(`${testName}:${JSON.stringify(result)}`);
}

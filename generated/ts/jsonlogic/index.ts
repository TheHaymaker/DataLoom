
import jsonLogic from 'json-logic-js';

// Type for JsonLogic rules
type JsonLogicRule = Record<string, unknown>;

// Type for rule results
type RuleResult<T> = T extends boolean ? boolean : T extends number ? number : unknown;

export type DynamicPricingRule = {
  "*": [
    {
      "var": "product.base_price"
    },
    {
      "if": [
        {
          ">=": [
            {
              "var": "quantity"
            },
            10
          ]
        },
        0.9,
        1
      ]
    },
    {
      "if": [
        {
          "in": [
            {
              "var": "season"
            },
            [
              "summer",
              "winter"
            ]
          ]
        },
        0.85,
        1
      ]
    },
    {
      "if": [
        {
          "==": [
            {
              "var": "user.tier"
            },
            "gold"
          ]
        },
        0.85,
        {
          "if": [
            {
              "==": [
                {
                  "var": "user.tier"
                },
                "silver"
              ]
            },
            0.9,
            {
              "if": [
                {
                  "==": [
                    {
                      "var": "user.tier"
                    },
                    "bronze"
                  ]
                },
                0.95,
                1
              ]
            }
          ]
        }
      ]
    }
  ]
};

export type OrderCalculationRule = {
  "*": [
    {
      "+": [
        {
          "reduce": [
            {
              "var": "order.items"
            },
            {
              "+": [
                {
                  "*": [
                    {
                      "var": "current.price"
                    },
                    {
                      "var": "current.quantity"
                    }
                  ]
                },
                {
                  "var": "accumulator"
                }
              ]
            },
            0
          ]
        },
        {
          "-": [
            1,
            {
              "var": "order.discount_percentage"
            }
          ]
        }
      ]
    },
    {
      "+": [
        1,
        {
          "var": "order.tax_rate"
        }
      ]
    }
  ]
};

export type RiskAssessmentRule = {
  "reduce": [
    [
      {
        "if": [
          {
            ">=": [
              {
                "var": "credit_score"
              },
              750
            ]
          },
          10,
          {
            "if": [
              {
                ">=": [
                  {
                    "var": "credit_score"
                  },
                  650
                ]
              },
              20,
              30
            ]
          }
        ]
      },
      {
        "if": [
          {
            "==": [
              {
                "var": "late_payments"
              },
              0
            ]
          },
          10,
          {
            "if": [
              {
                "<=": [
                  {
                    "var": "late_payments"
                  },
                  2
                ]
              },
              20,
              30
            ]
          }
        ]
      },
      {
        "if": [
          {
            ">=": [
              {
                "var": "years_employed"
              },
              5
            ]
          },
          10,
          {
            "if": [
              {
                ">=": [
                  {
                    "var": "years_employed"
                  },
                  2
                ]
              },
              20,
              30
            ]
          }
        ]
      },
      {
        "if": [
          {
            "<=": [
              {
                "var": "debt_to_income"
              },
              0.3
            ]
          },
          10,
          {
            "if": [
              {
                "<=": [
                  {
                    "var": "debt_to_income"
                  },
                  0.4
                ]
              },
              20,
              30
            ]
          }
        ]
      }
    ],
    {
      "+": [
        {
          "var": "current"
        },
        {
          "var": "accumulator"
        }
      ]
    },
    0
  ]
};

export type UserEligibilityRule = {
  "and": [
    {
      ">=": [
        {
          "var": "user.subscription_months"
        },
        3
      ]
    },
    {
      ">=": [
        {
          "var": "user.activity_score"
        },
        75
      ]
    },
    {
      "or": [
        {
          "==": [
            {
              "var": "user.tier"
            },
            "premium"
          ]
        },
        {
          ">=": [
            {
              "var": "user.referrals"
            },
            5
          ]
        }
      ]
    },
    {
      "==": [
        {
          "var": "user.account_status"
        },
        "active"
      ]
    }
  ]
};

export type DynamicPricingData = {
  "product": {
    "base_price": 100
  },
  "quantity": 15,
  "season": "summer",
  "user": {
    "tier": "gold"
  }
};

export type OrderCalculationData = {
  "order": {
    "items": [
      {
        "price": 10,
        "quantity": 2
      },
      {
        "price": 20,
        "quantity": 1
      }
    ],
    "discount_percentage": 0.1,
    "tax_rate": 0.08
  }
};

export type RiskAssessmentData = {
  "credit_score": 720,
  "late_payments": 1,
  "years_employed": 3,
  "debt_to_income": 0.35
};

export type UserEligibilityData = {
  "user": {
    "subscription_months": 6,
    "activity_score": 85,
    "tier": "standard",
    "referrals": 7,
    "account_status": "active"
  }
};

// Namespace for JsonLogic operations
export const BusinessLogicEngine = {
  apply<T>(rules: JsonLogicRule, data: unknown): RuleResult<T> {
    return jsonLogic.apply(rules, data) as RuleResult<T>;
  },

  // Helper methods for each rule type
  
  dynamicPricing(data: DynamicPricingData): number {
    const rules = {
  "*": [
    {
      "var": "product.base_price"
    },
    {
      "if": [
        {
          ">=": [
            {
              "var": "quantity"
            },
            10
          ]
        },
        0.9,
        1
      ]
    },
    {
      "if": [
        {
          "in": [
            {
              "var": "season"
            },
            [
              "summer",
              "winter"
            ]
          ]
        },
        0.85,
        1
      ]
    },
    {
      "if": [
        {
          "==": [
            {
              "var": "user.tier"
            },
            "gold"
          ]
        },
        0.85,
        {
          "if": [
            {
              "==": [
                {
                  "var": "user.tier"
                },
                "silver"
              ]
            },
            0.9,
            {
              "if": [
                {
                  "==": [
                    {
                      "var": "user.tier"
                    },
                    "bronze"
                  ]
                },
                0.95,
                1
              ]
            }
          ]
        }
      ]
    }
  ]
} as DynamicPricingRule;
    return this.apply(rules, data) as number;
  },

  orderCalculation(data: OrderCalculationData): number {
    const rules = {
  "*": [
    {
      "+": [
        {
          "reduce": [
            {
              "var": "order.items"
            },
            {
              "+": [
                {
                  "*": [
                    {
                      "var": "current.price"
                    },
                    {
                      "var": "current.quantity"
                    }
                  ]
                },
                {
                  "var": "accumulator"
                }
              ]
            },
            0
          ]
        },
        {
          "-": [
            1,
            {
              "var": "order.discount_percentage"
            }
          ]
        }
      ]
    },
    {
      "+": [
        1,
        {
          "var": "order.tax_rate"
        }
      ]
    }
  ]
} as OrderCalculationRule;
    return this.apply(rules, data) as number;
  },

  riskAssessment(data: RiskAssessmentData): number {
    const rules = {
  "reduce": [
    [
      {
        "if": [
          {
            ">=": [
              {
                "var": "credit_score"
              },
              750
            ]
          },
          10,
          {
            "if": [
              {
                ">=": [
                  {
                    "var": "credit_score"
                  },
                  650
                ]
              },
              20,
              30
            ]
          }
        ]
      },
      {
        "if": [
          {
            "==": [
              {
                "var": "late_payments"
              },
              0
            ]
          },
          10,
          {
            "if": [
              {
                "<=": [
                  {
                    "var": "late_payments"
                  },
                  2
                ]
              },
              20,
              30
            ]
          }
        ]
      },
      {
        "if": [
          {
            ">=": [
              {
                "var": "years_employed"
              },
              5
            ]
          },
          10,
          {
            "if": [
              {
                ">=": [
                  {
                    "var": "years_employed"
                  },
                  2
                ]
              },
              20,
              30
            ]
          }
        ]
      },
      {
        "if": [
          {
            "<=": [
              {
                "var": "debt_to_income"
              },
              0.3
            ]
          },
          10,
          {
            "if": [
              {
                "<=": [
                  {
                    "var": "debt_to_income"
                  },
                  0.4
                ]
              },
              20,
              30
            ]
          }
        ]
      }
    ],
    {
      "+": [
        {
          "var": "current"
        },
        {
          "var": "accumulator"
        }
      ]
    },
    0
  ]
} as RiskAssessmentRule;
    return this.apply(rules, data) as number;
  },

  userEligibility(data: UserEligibilityData): boolean {
    const rules = {
  "and": [
    {
      ">=": [
        {
          "var": "user.subscription_months"
        },
        3
      ]
    },
    {
      ">=": [
        {
          "var": "user.activity_score"
        },
        75
      ]
    },
    {
      "or": [
        {
          "==": [
            {
              "var": "user.tier"
            },
            "premium"
          ]
        },
        {
          ">=": [
            {
              "var": "user.referrals"
            },
            5
          ]
        }
      ]
    },
    {
      "==": [
        {
          "var": "user.account_status"
        },
        "active"
      ]
    }
  ]
} as UserEligibilityRule;
    return this.apply(rules, data) as boolean;
  }
} as const;

// Example usage:
/*
import { BusinessLogicEngine } from './logic-engine';

// Order calculation example
const orderData = {
  "order": {
    "items": [
      {
        "price": 10,
        "quantity": 2
      },
      {
        "price": 20,
        "quantity": 1
      }
    ],
    "discount_percentage": 0.1,
    "tax_rate": 0.08
  }
};
const orderTotal = BusinessLogicEngine.orderCalculation(orderData);

// User eligibility example
const userData = {
  "user": {
    "subscription_months": 6,
    "activity_score": 85,
    "tier": "standard",
    "referrals": 7,
    "account_status": "active"
  }
};
const isEligible = BusinessLogicEngine.userEligibility(userData);
*/

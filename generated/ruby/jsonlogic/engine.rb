# frozen_string_literal: true

require 'json_logic'

module BusinessLogic
  # Logic engine for applying JSON Logic rules
  class Engine
    class << self
      # Rule definitions
    DYNAMIC_PRICING_RULES = {"*"=>[{"var"=>"product.base_price"}, {"if"=>[{">="=>[{"var"=>"quantity"}, 10]}, 0.9, 1]}, {"if"=>[{"in"=>[{"var"=>"season"}, ["summer", "winter"]]}, 0.85, 1]}, {"if"=>[{"=="=>[{"var"=>"user.tier"}, "gold"]}, 0.85, {"if"=>[{"=="=>[{"var"=>"user.tier"}, "silver"]}, 0.9, {"if"=>[{"=="=>[{"var"=>"user.tier"}, "bronze"]}, 0.95, 1]}]}]}]}

    ORDER_CALCULATION_RULES = {"*"=>[{"+"=>[{"reduce"=>[{"var"=>"order.items"}, {"+"=>[{"*"=>[{"var"=>"current.price"}, {"var"=>"current.quantity"}]}, {"var"=>"accumulator"}]}, 0]}, {"-"=>[1, {"var"=>"order.discount_percentage"}]}]}, {"+"=>[1, {"var"=>"order.tax_rate"}]}]}

    RISK_ASSESSMENT_RULES = {"reduce"=>[[{"if"=>[{">="=>[{"var"=>"credit_score"}, 750]}, 10, {"if"=>[{">="=>[{"var"=>"credit_score"}, 650]}, 20, 30]}]}, {"if"=>[{"=="=>[{"var"=>"late_payments"}, 0]}, 10, {"if"=>[{"<="=>[{"var"=>"late_payments"}, 2]}, 20, 30]}]}, {"if"=>[{">="=>[{"var"=>"years_employed"}, 5]}, 10, {"if"=>[{">="=>[{"var"=>"years_employed"}, 2]}, 20, 30]}]}, {"if"=>[{"<="=>[{"var"=>"debt_to_income"}, 0.3]}, 10, {"if"=>[{"<="=>[{"var"=>"debt_to_income"}, 0.4]}, 20, 30]}]}], {"+"=>[{"var"=>"current"}, {"var"=>"accumulator"}]}, 0]}

    USER_ELIGIBILITY_RULES = {"and"=>[{">="=>[{"var"=>"user.subscription_months"}, 3]}, {">="=>[{"var"=>"user.activity_score"}, 75]}, {"or"=>[{"=="=>[{"var"=>"user.tier"}, "premium"]}, {">="=>[{"var"=>"user.referrals"}, 5]}]}, {"=="=>[{"var"=>"user.account_status"}, "active"]}]}

      # Apply generic JSON Logic rules to data
      #
      # @param rules [Hash] The JSON Logic rules to apply
      # @param data [Hash] The data to apply the rules to
      # @return [Object] The result of applying the rules
      def apply(rules, data)
        JSONLogic.apply(rules, data)
      end

      
      # Apply dynamic_pricing rules
      #
      # @param data [Hash] The data to evaluate against the rules
      # @return [Object] The result of applying the rules
      #
      # @example
      #   data = {"product"=>{"base_price"=>100}, "quantity"=>15, "season"=>"summer", "user"=>{"tier"=>"gold"}}
      #   result = JsonLogic::Engine.dynamic_pricing(data)
      def dynamic_pricing(data)
        apply(DYNAMIC_PRICING_RULES, data)
      end

      # Apply order_calculation rules
      #
      # @param data [Hash] The data to evaluate against the rules
      # @return [Object] The result of applying the rules
      #
      # @example
      #   data = {"order"=>{"items"=>[{"price"=>10, "quantity"=>2}, {"price"=>20, "quantity"=>1}], "discount_percentage"=>0.1, "tax_rate"=>0.08}}
      #   result = JsonLogic::Engine.order_calculation(data)
      def order_calculation(data)
        apply(ORDER_CALCULATION_RULES, data)
      end

      # Apply risk_assessment rules
      #
      # @param data [Hash] The data to evaluate against the rules
      # @return [Object] The result of applying the rules
      #
      # @example
      #   data = {"credit_score"=>720, "late_payments"=>1, "years_employed"=>3, "debt_to_income"=>0.35}
      #   result = JsonLogic::Engine.risk_assessment(data)
      def risk_assessment(data)
        apply(RISK_ASSESSMENT_RULES, data)
      end

      # Apply user_eligibility rules
      #
      # @param data [Hash] The data to evaluate against the rules
      # @return [Object] The result of applying the rules
      #
      # @example
      #   data = {"user"=>{"subscription_months"=>6, "activity_score"=>85, "tier"=>"standard", "referrals"=>7, "account_status"=>"active"}}
      #   result = JsonLogic::Engine.user_eligibility(data)
      def user_eligibility(data)
        apply(USER_ELIGIBILITY_RULES, data)
      end
    end
  end
end

# Example usage:
#
# require_relative 'logic_engine'
#
# # Order calculation example
# order_data = {"order"=>{"items"=>[{"price"=>10, "quantity"=>2}, {"price"=>20, "quantity"=>1}], "discount_percentage"=>0.1, "tax_rate"=>0.08}}
# order_total = JsonLogic::Engine.order_calculation(order_data)
#
# # User eligibility example
# user_data = {"user"=>{"subscription_months"=>6, "activity_score"=>85, "tier"=>"standard", "referrals"=>7, "account_status"=>"active"}}
# is_eligible = JsonLogic::Engine.user_eligibility(user_data)

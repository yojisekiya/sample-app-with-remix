// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").InputQuery} InputQuery
* @typedef {import("../generated/api").FunctionResult} FunctionResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
  (input) => {
    const targets = input.cart.lines
      // Only include cart lines with a quantity of two or more
      // and a targetable product variant
      .filter(line => line.quantity >= 2 &&
        line.merchandise.__typename == "ProductVariant")
      .map(line => {
        const variant = /** @type {ProductVariant} */ (line.merchandise);
        return /** @type {Target} */ ({
          // Use the variant ID to create a discount target
          productVariant: {
            id: variant.id
          }
        });
      });

    if (!targets.length) {
      // You can use STDERR for debug logs in your function
      console.error("No cart lines qualify for volume discount.");
      return EMPTY_DISCOUNT;
    }

    // The @shopify/shopify_function package applies JSON.stringify() to your function result
    // and writes it to STDOUT
    return {
      discounts: [
        {
          // Apply the discount to the collected targets
          targets,
          // Define a percentage-based discount
          value: {
            percentage: {
              value: "10.0"
            }
          }
        }
      ],
      discountApplicationStrategy: DiscountApplicationStrategy.First
    };
  };

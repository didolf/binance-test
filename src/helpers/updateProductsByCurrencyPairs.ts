import { CurrencyPair } from "../types/miniTicker";
import { FormattedProduct } from "../types/exchange";

export const updateProductsByCurrencyPairs = (
  products: FormattedProduct[],
  currencyPairs: CurrencyPair[]
) =>
  products.map((product) => {
    const { pairCode } = product;
    const currencyPair = currencyPairs.find(
      ({ pairCode: currencyPairCode }) => pairCode === currencyPairCode
    );
    if (currencyPair) {
      return { ...product, ...currencyPair };
    }
    return product;
  });

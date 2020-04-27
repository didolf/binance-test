import { FormattedProduct } from "../types/exchange";

export const groupByParentMarket = (products: FormattedProduct[]) => {
  const parentMarkets = new Map<string, Set<string>>();
  products.forEach((product) => {
    const { parentMarket } = product;

    if (!parentMarkets.has(parentMarket)) {
      parentMarkets.set(parentMarket, new Set<string>());
    }
    if (parentMarkets.get(parentMarket)) {
      (parentMarkets.get(parentMarket) as Set<string>).add(product.quoteAsset);
    }
  });
  return parentMarkets;
};

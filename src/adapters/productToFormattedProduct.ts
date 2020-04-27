import { Product, FormattedProduct } from "../types/exchange";

export const productToFormattedProduct = (
  product: Product
): FormattedProduct => {
  const {
    b: baseAsset,
    q: quoteAsset,
    c: latestPrice,
    o: openPrice,
    h: highPrice,
    l: lowPrice,
    pm: parentMarket,
    pn: categoryOfParentMarket,
    s: pairCode,
    v: volume,
  } = product;
  const change = parseFloat((latestPrice / openPrice - 1).toFixed(2));
  return {
    baseAsset,
    quoteAsset,
    openPrice,
    highPrice,
    lowPrice,
    parentMarket,
    categoryOfParentMarket,
    pair: `${baseAsset}/${quoteAsset}`,
    latestPrice,
    pairCode,
    volume,
    change,
  };
};

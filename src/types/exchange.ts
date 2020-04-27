import { CurrencyPair } from "./miniTicker";

export interface Product {
  b: string;
  q: string;
  c: number;
  o: number;
  h: number;
  l: number;
  v: number;
  pm: string;
  pn: string;
  s: string;
}
export const isProduct = (data: any): data is Product => {
  if (typeof data !== "object") return false;
  const { b, q, c, o, h, l, pm, pn, s, v } = data;
  if (
    typeof b !== "string" ||
    typeof q !== "string" ||
    typeof pm !== "string" ||
    typeof pn !== "string" ||
    typeof s !== "string" ||
    typeof c !== "number" ||
    typeof o !== "number" ||
    typeof h !== "number" ||
    typeof l !== "number" ||
    typeof v !== "number"
  ) {
    return false;
  }
  return true;
};

export interface FormattedProduct extends CurrencyPair {
  baseAsset: string;
  quoteAsset: string;
  parentMarket: string;
  categoryOfParentMarket: string;
  pair: string;
}
export const isFormattedProduct = (data: any): data is FormattedProduct => {
  if (typeof data !== "object") return false;
  const {
    baseAsset,
    quoteAsset,
    latestPrice,
    openPrice,
    highPrice,
    lowPrice,
    parentMarket,
    categoryOfParentMarket,
    pairCode,
    pair,
    change,
  } = data;
  if (
    typeof baseAsset !== "string" ||
    typeof quoteAsset !== "string" ||
    typeof parentMarket !== "string" ||
    typeof categoryOfParentMarket !== "string" ||
    typeof pairCode !== "string" ||
    typeof pair !== "string" ||
    typeof latestPrice !== "number" ||
    typeof openPrice !== "number" ||
    typeof highPrice !== "number" ||
    typeof lowPrice !== "number" ||
    typeof change !== "number"
  ) {
    return false;
  }
  return true;
};

export interface Products {
  data: Product[];
}

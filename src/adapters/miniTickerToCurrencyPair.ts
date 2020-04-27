import { MiniTickerUpd, CurrencyPair } from "../types/miniTicker";

export const miniTickerToCurrencyPair = (data: MiniTickerUpd): CurrencyPair => {
  const { s, c, o, h, l, v } = data;
  const latestPrice = parseFloat(c);
  const openPrice = parseFloat(o);
  const change = parseFloat((latestPrice / openPrice - 1).toFixed(2));
  return {
    pairCode: s,
    latestPrice,
    openPrice,
    highPrice: parseFloat(h),
    lowPrice: parseFloat(l),
    volume: parseFloat(v),
    change,
  };
};

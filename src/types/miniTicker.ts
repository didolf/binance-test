export interface MiniTickerUpd {
  E: number;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
}

export interface CurrencyPair {
  pairCode: string;
  latestPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  change: number;
}

export const isMiniPickerUpd = (data: any): data is MiniTickerUpd => {
  if (typeof data !== "object") return false;
  const { E, s, c, o, h, l, v, q } = data;
  if (
    typeof E !== "number" ||
    typeof s !== "string" ||
    typeof c !== "string" ||
    typeof o !== "string" ||
    typeof h !== "string" ||
    typeof l !== "string" ||
    typeof v !== "string" ||
    typeof q !== "string"
  ) {
    return false;
  }
  return true;
};

export const isCurrencyPair = (data: any): data is CurrencyPair => {
  if (typeof data !== "object") return false;
  const {
    pairCode,
    latestPrice,
    openPrice,
    highPrice,
    lowPrice,
    volume,
    change
  } = data;
  if (
    typeof pairCode !== "string" ||
    typeof latestPrice !== "number" ||
    typeof openPrice !== "number" ||
    typeof highPrice !== "number" ||
    typeof lowPrice !== "number" ||
    typeof volume !== "number" ||
    typeof change !== "number"
  ) {
    return false;
  }
  return true;
};

export interface MiniTickerStream {
  stream: string;
  data: MiniTickerUpd[];
}

import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import nodeFetch from "node-fetch";

import { FormattedProduct, isFormattedProduct } from "../src/types/exchange";
import { GetServerSideProps } from "next";
import {
  MiniTickerUpd,
  CurrencyPair,
  isMiniPickerUpd,
} from "../src/types/miniTicker";
import { miniTickerToCurrencyPair } from "../src/adapters/miniTickerToCurrencyPair";
import { ProductsView } from "../src/components";
import { groupByParentMarket } from "../src/helpers/groupByParentMarket";
import { updateProductsByCurrencyPairs } from "../src/helpers/updateProductsByCurrencyPairs";

interface MainPageProps {
  formattedProducts: FormattedProduct[];
}

const MainPage = ({ formattedProducts }: MainPageProps) => {
  const [products, setProducts] = useState(formattedProducts);
  const parentMarkets = useMemo(() => groupByParentMarket(formattedProducts), [
    formattedProducts,
  ]);
  const [updWs, setUpdWs] = useState<WebSocket | undefined>();
  useEffect(() => {
    setUpdWs(
      new WebSocket("wss://stream.binance.com/stream?streams=!miniTicker@arr")
    );
  }, []);
  useEffect(() => {
    if (updWs) {
      updWs.onmessage = (ev: MessageEvent) => {
        let miniTickers: MiniTickerUpd[] = [];
        try {
          const parsedData = JSON.parse(ev.data);

          miniTickers = parsedData.data.filter(isMiniPickerUpd);
        } catch (err) {}
        const updateProducts: CurrencyPair[] = miniTickers.map(
          miniTickerToCurrencyPair
        );
        setProducts((prevProducts) =>
          updateProductsByCurrencyPairs(prevProducts, updateProducts)
        );
      };
      updWs.onclose = () => {
        setUpdWs(
          new WebSocket(
            "wss://stream.binance.com/stream?streams=!miniTicker@arr"
          )
        );
      };
      updWs.onerror = () => {
        setUpdWs(
          new WebSocket(
            "wss://stream.binance.com/stream?streams=!miniTicker@arr"
          )
        );
      };
    }
  }, [updWs]);
  const onCloseWS = useCallback(() => {
    if (updWs) {
      updWs.close();
    }
  }, [updWs]);
  return (
    <ProductsView
      onCloseWS={onCloseWS}
      products={products}
      parentMarkets={parentMarkets}
    />
  );
};

export async function getServerSideProps(context: GetServerSideProps) {
  const formattedProducts = await (
    await nodeFetch("http://localhost:3000/get-products")
  ).json();
  return {
    props: {
      formattedProducts: Array.isArray(formattedProducts)
        ? formattedProducts.filter(isFormattedProduct)
        : [],
    },
  };
}
export default MainPage;

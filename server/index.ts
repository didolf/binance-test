import express from "express";
import nodeFetch from "node-fetch";
import querystring from "query-string";
import next from "next";
import { isProduct } from "../src/types/exchange";
import { productToFormattedProduct } from "../src/adapters/productToFormattedProduct";

const dev = process.env.ENV !== 'PRODUCTION';
const app = next({ dev });

const renderHandler = app.getRequestHandler();
app.prepare().then(() => {
  const server = express();
  server.get("/get-products", async (req, res) => {
    const queryParams = querystring.stringify(req.query);
    const result = await nodeFetch(
      `https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products?${queryParams}`
    ).then((res) => res.json());
    if (Array.isArray(result?.data)) {
      const formattedResult = result.data.map((product: any) => {
        if (isProduct(product)) {
          return productToFormattedProduct(product);
        }
        return null;
      });

      return res.json(formattedResult);
    }
    res.status(500).json({ success: false });
  });

  server.get("*", (req, res) => {
    return renderHandler(req, res);
  });

  server.listen(3000);
});

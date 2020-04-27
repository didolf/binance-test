import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Paper,
  Typography,
  Divider,
  Button,
  Grid,
  Select,
  MenuItem,
  Input,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { FormattedProduct } from "../../types/exchange";
import { ProductsTable } from "../ProductsTable/ProductsTable";
import { filterProducts } from "../../helpers/filterProducts";

interface ProductsViewProps {
  products: FormattedProduct[];
  parentMarkets: Map<string, Set<string>>;
  onCloseWS: () => void;
}

enum Metrics {
  CHANGE = "CHANGE",
  VOLUME = "VOLUME",
}

type ColumnName = keyof FormattedProduct;

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  parentMarkets,
  onCloseWS,
}) => {
  const [search, setSearch] = useState("");
  const [curParentMarket, setCurParentMarket] = useState<string | null>(null);
  const [activeMetrics, setActiveMetrics] = useState(Metrics.VOLUME);
  const [filter, setFilter] = useState<string | undefined | null>();

  useEffect(() => {
    if (parentMarkets) {
      const firstParentMarket = [...parentMarkets.keys()][0];
      if (firstParentMarket && parentMarkets.get(firstParentMarket)) {
        const firstCurrency = [
          ...(parentMarkets.get(firstParentMarket) as Set<string>).keys(),
        ][0];
        setCurParentMarket(firstParentMarket);
        setFilter(firstCurrency);
      }
    }
  }, [parentMarkets]);

  const changeActiveCurrency = useCallback(
    (market: string, currency: string | null) => {
      setCurParentMarket(market);
      setFilter(currency);
    },
    []
  );

  const changeSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearch(ev.target.value),
    []
  );

  const changeMetrics = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, value: string) =>
      setActiveMetrics(value as Metrics),
    []
  );
  const currencyButtons = useMemo(() => {
    const buttons = [];
    const selects = [];
    for (const [market, currenciesMap] of parentMarkets.entries()) {
      const currencies = [...currenciesMap.keys()];
      const isActive = curParentMarket === market;
      if (currencies.length === 1) {
        buttons.push(
          <Button
            key={market}
            color={isActive ? "primary" : undefined}
            variant={isActive ? "outlined" : "text"}
            onClick={() => {
              changeActiveCurrency(market, currencies[0]);
            }}
          >
            {currencies[0]}
          </Button>
        );
      } else {
        selects.push(
          <Select
            key={market}
            color={isActive ? "primary" : undefined}
            defaultValue={market}
            value={isActive ? filter || market : market}
            onChange={(
              ev: React.ChangeEvent<{ name?: string; value: any }>
            ) => {
              if (ev.target.value !== market) {
                changeActiveCurrency(market, ev.target.value);
              } else {
                changeActiveCurrency(market, null);
              }
            }}
            disableUnderline={!isActive}
          >
            <MenuItem value={market}>{market}</MenuItem>
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        );
      }
    }
    return buttons.concat(selects);
  }, [parentMarkets, changeActiveCurrency, filter, curParentMarket]);

  const columns = useMemo<
    {
      id: ColumnName;
      label: string;
      width: number;
      format?: (data: string | number) => string;
    }[]
  >(
    () => [
      {
        id: "pair" as ColumnName,
        label: "Pair",
        width: 150,
      },
      {
        id: "latestPrice" as ColumnName,
        label: "Last Price",
        width: 150,
        format: (latestPrice: React.ReactText) => (latestPrice as number).toFixed(9),
      },
      activeMetrics === Metrics.CHANGE
        ? {
            id: "change" as ColumnName,
            label: "Change",
            width: 100,
            format: (change: React.ReactText) => ((change as number) * 100).toFixed(2),
          }
        : { id: "volume" as ColumnName, label: "Volume", width: 100 },
    ],
    [activeMetrics]
  );

  return (
    <Paper style={{ width: 500, padding: 15 }}>
      <Typography variant="h6" gutterBottom>
        Market
      </Typography>
      <Divider />
      <Grid
        style={{ padding: "10px 15px" }}
        spacing={3}
        container
        alignItems="center"
      >
        <Grid item xs={4} alignContent="center">
          <Button onClick={onCloseWS}>Close WS</Button>
        </Grid>
        {currencyButtons.map((button) => (
          <Grid item alignContent="center" xs={2}>
            {button}
          </Grid>
        ))}
      </Grid>
      <Grid container>
        <Grid item xs={6} justify="space-between">
          <Input
            placeholder="Search"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            value={search}
            onChange={changeSearch}
          />
        </Grid>
        <Grid item xs={6}>
          <RadioGroup
            row
            style={{ justifyContent: "flex-end" }}
            name="metrics"
            value={activeMetrics}
            onChange={changeMetrics}
          >
            <FormControlLabel
              value={Metrics.CHANGE}
              control={<Radio color="primary" />}
              label="Change"
              labelPlacement="start"
            />
            <FormControlLabel
              value={Metrics.VOLUME}
              control={<Radio color="primary" />}
              label="Volume"
              labelPlacement="start"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <ProductsTable
        products={filterProducts(products, search, curParentMarket, filter)}
        columns={columns}
      />
    </Paper>
  );
};

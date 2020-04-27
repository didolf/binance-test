import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
} from "@material-ui/core";
import { getComparator, stableSort } from "./helpers";

export type Order = "asc" | "desc";
interface Column<Product> {
  id: keyof Product;
  label: string;
  width: number;
  format?: (data: string | number) => string;
};

export const ProductsTable = <Product extends any>({
  columns,
  products,
}: {
  columns: Column<Product>[];
  products: Product[];
}) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>(columns[0].id);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Product
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const createSortHandler = (property: keyof Product) => (
    event: React.MouseEvent<unknown>
  ) => {
    handleRequestSort(event, property);
  };
  return (
    <TableContainer style={{ maxHeight: 440 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                sortDirection={orderBy === column.id ? order : false}
                key={column.id.toString()}
                style={{ maxWidth: column.width }}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(
            products,
            getComparator<Product, keyof Product>(order, orderBy)
          ).map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.pair}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell
                      style={{ maxWidth: column.width }}
                      key={column.id.toString()}
                    >
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

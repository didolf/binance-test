import { FormattedProduct } from "../types/exchange";

export const filterProducts = (
  products: FormattedProduct[],
  search: string | null | undefined,
  curParentMarket: string | null | undefined,
  filter: string | null | undefined
): FormattedProduct[] => {
  return products.filter(({ parentMarket, quoteAsset, baseAsset }) => {
    if (
      search &&
      !baseAsset
        .toString()
        .toLocaleLowerCase()
        .startsWith(search.toLocaleLowerCase())
    )
      return false;
    if (curParentMarket && curParentMarket !== parentMarket) {
      return false;
    }
    if (filter && filter !== quoteAsset) return false;
    return true;
  });
};

import ProductList from "@/components/ProductList";
import ProductListSkeletons from "@/components/ProductListSkeletons";
import ProductsSearch from "@/components/ProductsSearch";
import { DBProduct, SortOrders } from "@/types";
import { pick } from "lodash";
import { Suspense } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import { Metadata } from "next";
import CreateProduct from "@/components/CreateProductButton";

const filterParams = [
  'seller_id',
  'search',
  'category_id',
];

const sortParams = [
  "key",
  "order",
  "limit",
];
interface IProductsPageProps {
  searchParams?: Partial<{
    seller_id: string;
    search: string;
    key: keyof DBProduct;
    order: SortOrders;
    limit: number;
  }>;
}

export default async function ProductsPage({
  searchParams = {},
}: IProductsPageProps) {
  const filter: Partial<DBProduct> = pick(searchParams, filterParams);
  const sort = pick(searchParams, sortParams);

  return (
    <div>
      <CreateProduct />
      <ProductsSearch />
      <Suspense>
        <CategoryFilter />
      </Suspense>
      <div>
        <Suspense fallback={<ProductListSkeletons />}>
          <ProductList filter={filter} sort={sort} />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Products',
};
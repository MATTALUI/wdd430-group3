import ProductList from "@/components/ProductList";
import ProductListSkeletons from "@/components/ProductListSkeletons";
import ProductsSearch from "@/components/ProductsSearch";
import { DBProduct } from "@/types";
import { pick } from "lodash";
import { Suspense } from "react";
import Link from "next/link";

const filterParams = [
  'seller_id',
];
interface IProductsPageProps {
  searchParams?: Partial<{
    seller_id: string;
  }>;
}

export default async function ProductsPage({
  searchParams = {},
}:IProductsPageProps) {
  const filter: Partial<DBProduct> = pick(searchParams, filterParams);
  const sort = {};

  return (
    <div>
      <Link href={`/products/new`}
          className="bg-accent mb-4 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add New Product
      </Link>
      <ProductsSearch />
      <div>
        <Suspense fallback={<ProductListSkeletons />}>
          <ProductList filter={filter} sort={sort} />
        </Suspense>
      </div>
    </div>
  );
}
import ProductList from "@/components/ProductList";
import ProductListSkeletons from "@/components/ProductListSkeletons";
import ProductsSearch from "@/components/ProductsSearch";
import { DBProduct, SortOrders } from "@/types";
import { pick } from "lodash";
import { Suspense } from "react";
import { CreateProduct } from "@/components/Buttons";
import { getCategories } from "@/lib/data";


const filterParams = [
  'seller_id',
  'search'
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
}:IProductsPageProps) {
  const filter: Partial<DBProduct> = pick(searchParams, filterParams);
  const sort = pick(searchParams, sortParams);
  const categoryList = await getCategories()
  console.log(categoryList)


  return (
    <div>
      <CreateProduct />
      <ProductsSearch/>
      <div>
        <Suspense fallback={<ProductListSkeletons />}>
          <ProductList filter={filter} sort={sort} />
        </Suspense>
      </div>
    </div>
  );
}
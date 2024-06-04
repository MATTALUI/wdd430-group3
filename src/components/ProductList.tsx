import { getProducts } from "@/lib/data";
import type { DBProduct, IQueryBuilder } from "@/types";
import Link from "next/link";
import { FaRegStar, FaStar } from "react-icons/fa";
import truncate from "lodash/truncate";
import RatingStars from "./RatingStars";

export default async function ProductList({
  filter,
  sort,
}: IQueryBuilder<DBProduct> = {}) {
  const products = await getProducts({ filter, sort });

  return (
    <div className="py-4">
      {!products.length && (
        <div className="bg-sky-100 border border-sky-400 text-sky-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No Products</strong>
          <span className="block sm:inline">{`Don't`} see what {`you're`} looking for? Try browsing <Link href="/products" className="font-bold underline">all products</Link> instead!</span>
        </div>
      )}
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="my-2 flex p-2 bg-gray-50 rounded-md hover:opacity-75 shadow"
        >
          <div className="flex-2">
            <img src={product.images[0]?.src} alt="product image" />
          </div>
          <div className="flex-4 ps-2">
            <div className="flex">
              <span className="flex-4 text-primary font-bold">{product.name}</span>
              <span className="ps-2 flex-1">$ {product.price.toFixed(2)}</span>
            </div>
            <div className="text-xs">Seller name here</div>
            <RatingStars
              defaultValue={product.rating}
              readonly
            />
            <div className="max-h-40 text-sm opacity-50">
              {truncate(product.description, { length: 200 })}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
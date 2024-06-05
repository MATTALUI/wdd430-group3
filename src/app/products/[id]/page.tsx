import RatingStars from "@/components/RatingStars";
import { getProduct } from "@/lib/data";
import { FaRegStar, FaStar } from "react-icons/fa";
import ReviewsForm from '@/components/ReviewsForm';
import Image from "next/image";
import { Metadata } from "next";
import { EditProduct } from "@/components/EditProductButton";
import Link from "next/link";

interface IProductPageProps {
  params: {
    id: string;
  }
}
export default async function ProductPage({
  params: { id: productId },
}: IProductPageProps) {
  const product = await getProduct(productId);

  return (
    <div>
      <EditProduct id={productId} sellerId={product.seller.id} />
      <div className="w-full flex-wrap items-center justify-center justify-items-center object-contain">
        {product.images.length > 0 ? (
          product.images.slice(0, 1).map(img => (
            <img className="p-2" width={250} height={250} key={img.id} src={img.src} alt="product image" />
          ))
        ) : (
          <div className="aspect-square w-full bg-primary rounded opacity-75 text-center flex items-center justify-center">
            No Image Available
          </div>
        )}
      </div>
      <div className="flex font-bold justify-between">
        <h1 className="text-primary text-xl">{product.name}</h1>
        <span >USD$ {product.price}</span>
      </div>
      <div>By <Link className="text-orange-300" href={`/sellers/${product.seller.id}`}>{product.seller.firstName} {product.seller.lastName}</Link></div>
      <RatingStars
        defaultValue={product.rating}
        readonly
      />
      <div>
        <a
          href={`mailto:${product.seller.email}`}
          className="bg-primary text-white p-2 rounded inline-block mt-4"
        >
          Contact Seller
        </a>
      </div>
      <div className="mt-4">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
      <div className="mt-4">
        <h2>Reviews</h2>
        <ReviewsForm />
        {product.reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 rounded px-4 py-2 flex pt-2 mb-2"
          >
            <div className="w-20">
              <img src={"https://picsum.photos/300/300"} alt="seller profile pic" />
            </div>
            <div className="flex-1 ps-2">
              <div>{`Reviewer Name`}</div>
              <RatingStars
                defaultValue={review.stars}
                readonly
              />
              <div className="mt-4">
                <p>{'"'}{review.text}{'"'}</p>
              </div>
              <div className="text-slate-600 text-sm">{review.createdAt.toDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Product Details',
};
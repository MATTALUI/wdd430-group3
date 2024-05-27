import RatingStars from "@/components/RatingStars";
import { getProduct } from "@/lib/data";
import { FaRegStar, FaStar } from "react-icons/fa";
import ReviewsForm from '@/components/ReviewsForm';


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
      <div>
        {product.images.length && (
          <img src={product.images[0].src} alt="product image"/>
        )}
      </div>
      <div className="flex justify-between">
        <h1>{product.name}</h1>
        <span>$420.69</span>
      </div>
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
            className="bg-gray-50 rounded px-4 py-2 flex pt-2"
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
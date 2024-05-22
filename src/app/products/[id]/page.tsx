import { getProduct } from "@/lib/data";
import { FaRegStar, FaStar } from "react-icons/fa";

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
          <img src={product.images[0].src} />
        )}
      </div>
      <div className="flex justify-between">
        <h1>{product.name}</h1>
        <span>$420.69</span>
      </div>
      <div className="flex">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStar />
        <FaRegStar />
      </div>
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
      </div>
    </div>
  );
}
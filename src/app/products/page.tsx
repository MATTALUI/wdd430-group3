import { getProducts } from "@/lib/data";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div>
      {products.length} products available
    </div>
  );
}
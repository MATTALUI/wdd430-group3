import ProductForm from "@/components/EditProductForm";
import { getProduct } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const id = params.id;
  const [product] = await Promise.all([
    getProduct(id)
  ]);
  
  if (!product) {
    notFound();
  }

  return (
    <ProductForm product={product}/>
  );
}
import ProductForm from "@/components/CreateProductForm";
import { getCategoriesWithPictures } from "@/lib/data";

export default async function CreateProducts() {
  const categories = await getCategoriesWithPictures();
  return (
    <ProductForm categories={categories}/>
  );
}
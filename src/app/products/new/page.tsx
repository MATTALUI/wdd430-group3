import ProductForm from "@/components/CreateProductForm";
import { getCategoriesWithPictures } from "@/lib/data";
import { Metadata } from "next";

export default async function CreateProducts() {
  const categories = await getCategoriesWithPictures();
  return (
    <ProductForm categories={categories}/>
  );
}

export const metadata: Metadata = {
  title: 'Adding Products',
};
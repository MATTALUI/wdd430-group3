import ProductForm from "@/components/CreateProductForm";
import { Metadata } from "next";

export default function CreateProducts() {
  return (
    <ProductForm />
  );
}

export const metadata: Metadata = {
  title: 'Adding Products',
};
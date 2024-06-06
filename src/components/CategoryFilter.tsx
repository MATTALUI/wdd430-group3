import { getCategoriesWithPictures } from "@/lib/data";
import CategoryDropdown from "./CategoryDropdown";

export default async function CategoryFilter() {
  const categories = await getCategoriesWithPictures();
  return (
    <div className="flex-1">
      <CategoryDropdown categories={categories} /> 
    </div>
  );
}
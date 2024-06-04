import Link from "next/link";

const categoriesCount = 6;
const mockCategories = new Array(categoriesCount).fill(null);

export default async function CategoriesDashSkeleton() {

    return (
        <section className="mb-10 sm:mx-40">
            <h2 className="text-xl font-bold my-5 text-center">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-5  justify-items-center">
                {mockCategories.map((_, i) => (
                    <div className="w-full">
                        <div className="animate-pulse opacity-25 bg-white h-60 rounded-full"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}
import Link from "next/link";

const PRODUCT_SKELETON_COUNT = 3;
const mockProducts = new Array(PRODUCT_SKELETON_COUNT).fill(null);

export default async function PopularItemsSkeletons() {

    return (
        <section className="mb-10 sm:mx-40">
            <h2 className="text-xl font-bold my-5 text-center">Popular Items</h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-5 justify-items-center max-w-full">
                {mockProducts.map((_, i) => {
                    return (
                        <div
                            key={i}
                            className="bg-white rounded-lg overflow-hidden shadow-md w-full h-44 animate-pulse opacity-25"
                        >
  
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
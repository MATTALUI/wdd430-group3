import { getRandomProducts } from "@/lib/data";
import Link from "next/link";

export default async function TopProducts() {
    const topThreeProds = await getRandomProducts();

    return (
        <section className="mb-10 sm:mx-40">
            <h2 className="text-xl font-bold my-5 text-center">Popular Items</h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-5 justify-items-center max-w-full">
                {topThreeProds.map((product, i) => {
                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden shadow-md w-full"
                        >
                            <Link
                                href={`/products/${product.id}`}
                                className="block text-center"
                            >
                                <img
                                    src={product.images[0]?.src}
                                    alt={product.name}
                                    className="w-full h-auto object-cover rounded-t-lg"
                                />
                                <div className="p-2">
                                    <span className="block text-gray-700 text-sm font-bold mb-2">
                                        {product.name}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
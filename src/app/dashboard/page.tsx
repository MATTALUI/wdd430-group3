import Link from "next/link";
import TopProducts from "@/components/popularItems";
import { Suspense } from "react";

export default async function Dashboard() {
  return (
    <div>
        <img
            src="https://picsum.photos/1200/300"
            alt="Hero Image"
            className="w-auto 0 h-auto sm:mx-40 mx-auto object-cover"
        />

        <Suspense>
            <TopProducts />
        </Suspense>


        <section className="mb-10 sm:mx-40">
            <h2 className="text-xl font-bold my-5 text-center">Categories</h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-5 justify-items-center">
                <Link href="/category/1" className="block text-center mb-5 relative">
                    <img src="https://picsum.photos/300/300" alt="Category 1" className="max-w-200 h-auto object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Category 1</span> {/* Text */}
                </Link>
                <Link href="/category/1" className="block text-center mb-5 relative">
                    <img src="https://picsum.photos/300/300" alt="Category 2" className="max-w-200 h-auto object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Category 2</span> {/* Text */}
                </Link>
                <Link href="/category/1" className="block text-center mb-5 relative">
                    <img src="https://picsum.photos/300/300" alt="Category 3" className="max-w-200 h-auto object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Category 3</span> {/* Text */}
                </Link>
                <Link href="/category/1" className="block text-center mb-5 relative">
                    <img src="https://picsum.photos/300/300" alt="Category 4" className="max-w-200 h-auto object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Category 4</span> {/* Text */}
                </Link>
                <Link href="/category/1" className="block text-center mb-5 relative">
                    <img src="https://picsum.photos/300/300" alt="Category 5" className="max-w-200 h-auto object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Category 5</span> {/* Text */}
                </Link>
                <Link href="/category/1" className="block text-center mb-5 relative">
                    <img src="https://picsum.photos/300/300" alt="Category 6" className="max-w-200 h-auto object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Category 6</span> {/* Text */}
                </Link>
            </div>
        </section>

    </div>
  );
}
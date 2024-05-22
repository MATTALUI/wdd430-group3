"use client"
import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
        <img
            src="https://picsum.photos/1200/300"
            alt="Hero Image"
            className="w-auto 0 h-auto sm:mx-40 mx-auto object-cover"
        />

        <section className="mb-10 sm:mx-40">
        <h2 className="text-xl font-bold my-5 text-center">Popular Items</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-5 justify-items-center max-w-full">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <Link href="/product/1" className="block text-center">
                    <img src="https://picsum.photos/500/300" alt="Popular Item 1" className="w-full h-auto object-cover rounded-t-lg" />
                    <div className="p-2">
                    <span className="block text-gray-700 text-sm font-bold mb-2">Product 1</span>
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <Link href="/product/2" className="block text-center">
                    <img src="https://picsum.photos/500/300" alt="Popular Item 2" className="w-full h-auto object-cover rounded-t-lg" />
                    <div className="p-2">
                    <span className="block text-gray-700 text-sm font-bold mb-2">Product 2</span>
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <Link href="/product/3" className="block text-center">
                    <img src="https://picsum.photos/500/300" alt="Popular Item 3" className="w-full h-auto object-cover rounded-t-lg" />
                    <div className="p-2">
                    <span className="block text-gray-700 text-sm font-bold mb-2">Product 3</span>
                    </div>
                </Link>
            </div>
        </div>
        </section>


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
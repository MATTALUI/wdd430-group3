import { getCategoriesWithPictures } from "@/lib/data";
import Link from "next/link";

export default async function CategoriesMenu(){
    const categories = await getCategoriesWithPictures();

    return (
        <section className="mb-10 sm:mx-40">
            <h2 className="text-xl font-bold my-5 text-center">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-5  justify-items-center">
                {categories.map((cat, i) => {
                    return (
                        <Link 
                            key={cat.id}
                            href="#" 
                            className="block text-center mb-5 relative"
                        >
                            <img
                                src={cat.pictureSrc ?? ""} 
                                alt={cat.name} 
                                className="max-w-200 h-auto object-cover rounded-full" 
                            />
                            <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                {cat.name} 
                            </span>
                        </Link>                
                    );
                })}
            </div>
        </section>
    );
}
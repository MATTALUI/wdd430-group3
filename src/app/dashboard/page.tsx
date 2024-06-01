import Link from "next/link";
import TopProducts from "@/components/popularItems";
import CategoriesMenu from "@/components/categoriesMenu";
import { Suspense } from "react";

export default async function Dashboard() {
  return (
    <div>
        <div
            className="sm:mx-40 mx-auto w-auto bg-cover bg-bottom"
            style={{
                height: '300px',
                backgroundImage: 'url(https://images.pexels.com/photos/3654776/pexels-photo-3654776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            }}
        ></div>
        <Suspense>
            <TopProducts />
        </Suspense>

        <Suspense>
            <CategoriesMenu />
        </Suspense>

    </div>
  );
}
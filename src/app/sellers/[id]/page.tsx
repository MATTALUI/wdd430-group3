import ProductList from "@/components/ProductList";
import ProductListSkeletons from "@/components/ProductListSkeletons";
import { getUser } from "@/lib/data";
import { SortOrders } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface ISellersPageProps {
  params: ISellersPageParams;
  searchParams: { profileUpdated?: string };
}
interface ISellersPageParams {
  id: string;
}

const PRODUCT_COUNT = 3;

export default async function SellersPage({
  params,
  searchParams,
}: ISellersPageProps) {
  const { id } = params;
  const user = await getUser({ id });
  const profileUpdated = searchParams.profileUpdated === 'true';

  return (
    <div>
      <div className="mb-2">
        <Image
          src={user.profileImage || ""}
          alt="profile picture"
          className="w-full block"
        />
      </div>
      <div className="mb-1 text-lg font-bold">
        {user.firstName} {user.lastName}
      </div>
      <div className="mb-2 text-sm">
        <Link href={`/sellers/edit/${user.id}`} className="text-blue-600"> Edit</Link>
      </div>
      {profileUpdated && (
        <div className="mb-4 text-green-500">Profile updated successfully!</div>
      )}
      <div className="mb-4">
        <div className="font-bold">My story</div>
        <div>
          {user.description}
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <div className="font-bold">Recent Products</div>
          <Link
            href={`/products?creatorId=${user.id}`}
            className="text-blue-600"
          >
            See all
          </Link>

        </div>
        <div>
          <Suspense fallback={
            <ProductListSkeletons count={PRODUCT_COUNT} />
          }>
            <ProductList
              filter={{
                seller_id: user.id,
              }}
              sort={{
                key: "created_at",
                order: SortOrders.Descending,
                limit: PRODUCT_COUNT,
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
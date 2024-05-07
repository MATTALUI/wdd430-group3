import ProductList from "@/components/ProductList";
import ProductListSkeletons from "@/components/ProductListSkeletons";
import { getUser } from "@/lib/data";
import { SortOrders } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface ISellersPageProps {
  params: ISellersPageParams;
}
interface ISellersPageParams {
  id: string;
}

const PRODUCT_COUNT = 3;

export default async function SellersPage({
  params,
}: ISellersPageProps) {
  const { id } = params;
  const user = await getUser({ id });

  return (
    <div>
      <div className="mb-2">
        <img
          src={user.profileImage || ""}
          alt="profile picture"
          className="w-full block"
        />
      </div>
      <div className="mb-5 text-lg font-bold">
        {user.firstName} {user.lastName}
      </div>
      <div className="mb-4">
        <div className="font-bold">My story</div>
        <div>
          {" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras maximus metus eu auctor venenatis. Cras ullamcorper lectus sit amet mi maximus, ac lobortis orci feugiat. Nullam non velit felis. Morbi sit amet neque quis dolor tempus rutrum eu a felis. Mauris ipsum leo, viverra at aliquet sit amet, feugiat nec tortor. Fusce ultrices consectetur turpis vel iaculis. Nam et faucibus quam, sed suscipit sem. Morbi suscipit aliquet ipsum, sit amet lacinia augue imperdiet ut. Fusce ut egestas lacus. Nullam gravida quam sapien, sed sollicitudin quam vestibulum vel. Integer vehicula ipsum sit amet metus condimentum malesuada. Aliquam erat volutpat. In imperdiet ante diam, eu ullamcorper erat tincidunt a. Aliquam orci nunc, tempus eu est vel, scelerisque consequat nisl. Sed vehicula elementum nisi, vitae fringilla mi malesuada tempor. Nullam ut velit porta risus laoreet ultrices in quis neque. Maecenas sit amet fermentum augue, iaculis dictum est. Maecenas eleifend, nisi eu elementum interdum, augue risus viverra libero, non mattis risus quam non mauris. Phasellus sed nulla augue. Etiam rutrum ultricies ornare. Nunc euismod purus vel quam tincidunt cursus sed in nunc. Mauris lobortis magna nec elit hendrerit, at bibendum tellus ornare. Mauris a pharetra nibh. Aliquam rutrum molestie urna non laoreet. "}
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
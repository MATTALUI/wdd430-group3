"use client"
import Link from 'next/link';
import { useSession } from "next-auth/react";

interface ICreateProductButtonProps {
  sellerId?: string;
}

export default function CreateProductButton({
  sellerId
}:ICreateProductButtonProps) {

  const session = useSession();
  const userId = session.data?.user?.id;
  const notOwnPage = sellerId && sellerId !== userId;
  if (!userId || notOwnPage) return null;
  return (
    <Link
      href={`/products/new`}
      className="bg-accent mb-4 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full block text-center">
      Add New Product
    </Link>
  );
}
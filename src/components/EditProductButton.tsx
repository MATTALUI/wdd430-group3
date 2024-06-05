"use client"
import { BiPencil, BiTrash } from 'react-icons/bi';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function EditProduct({ id, sellerId }: { id: string, sellerId: string }) {
  const session = useSession();
  const userId = session.data?.user?.id;

  if (!userId || sellerId !== userId) return null;
  return (
    <Link
      href={`/products/${id}/edit`}
      className="bg-accent text-white p-2 rounded block w-full mb-4">
      <BiPencil className='inline-block' /> Edit Product
    </Link>
  );
}
import { BiPencil, BiTrash } from 'react-icons/bi';
import Link from 'next/link';
import { deleteProduct } from '@/lib/actions';

export function EditProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/products/${id}/edit`}
      className="bg-accent text-white p-2 rounded inline-block mt-4">
      <BiPencil />
    </Link>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  const deleteProductWithId = deleteProduct.bind(null, id);
  return (
    <form action={deleteProductWithId}>
      <button className="rounded-md border bg-primary text-white p-2">
        <span className="sr-only">Delete</span>
        <BiTrash />
      </button>
    </form>
  );
}
import { BiTrash } from 'react-icons/bi';
import { deleteProduct } from '@/lib/actions';

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
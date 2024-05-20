export default function ProductForm() {
  return (
    <form action={}>
      <div>
        <div className="mb-2 flex items-center">
          <Image
            src={}
            className=""
            width={28}
            height={28}
            alt={`${invoice.name}'s profile picture`}
          />
          <p>{invoice.name}</p>
        </div>
        <p className="text-sm text-gray-500">{invoice.email}</p>
      </div>
    </form>
  );
}
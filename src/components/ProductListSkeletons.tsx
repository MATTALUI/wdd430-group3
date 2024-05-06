interface IProductListSkeletonsProps {
  count?: number;
}
export default function ProductListSkeletons({
  count = 25,
}: IProductListSkeletonsProps) {

  return (
    <div>
      {new Array(count).fill(null).map(() => (
        <div className="animate-pulse shadow rounded-md my-2 flex p-2 bg-gray-50 opacity-25">
          <div className="flex flex-1">
            <div className="flex-2">
              <div className="w-full bg-gray-300 aspect-square" />
            </div>
            <div className="flex-4 ps-2">
              <div className="flex mb-2">
                <div className="flex-4 pe-2">
                  <div className="h-6 bg-gray-300 rounded-md" />
                </div>
                <div className="flex-2 p2-2">
                  <div className="h-6 bg-gray-300 rounded-md" />
                </div>
              </div>
              <div className="pb-2">
                <div className="h-2 bg-gray-300 rounded-md w-1/2" />
              </div>
              <div className="flex justify-start mb-4">
                <div className="aspect-square w-4 rounded-full bg-gray-300 me-2" />
                <div className="aspect-square w-4 rounded-full bg-gray-300 me-2" />
                <div className="aspect-square w-4 rounded-full bg-gray-300 me-2" />
                <div className="aspect-square w-4 rounded-full bg-gray-300 me-2" />
                <div className="aspect-square w-4 rounded-full bg-gray-300 me-2" />
              </div>
              <div>
                <div className="h-3 bg-gray-300 rounded-md mb-2" />
                <div className="h-3 bg-gray-300 rounded-md mb-2" />
                <div className="h-3 bg-gray-300 rounded-md mb-2" />
                <div className="h-3 bg-gray-300 rounded-md mb-2" />
                <div className="h-3 bg-gray-300 rounded-md mb-2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
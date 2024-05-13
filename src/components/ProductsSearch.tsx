import { FaMagnifyingGlass } from "react-icons/fa6";

export default function ProductsSearch() {
  return (
    <div>
      <div>
        <div className="relative mt-2 rounded-md shadow-sm flex">
          <input
            type="text"
            name="search"
            className="block w-full rounded-l-md border-0 py-1.5 pl-7 pr-20 text-gray-900  placeholder:text-gray-400 focus:ring-2  sm:text-sm sm:leading-6"
            placeholder="Search"
          />
          <div className="flex items-center bg-blue-600 text-white w-4 rounded-r-md w-12 cursor-pointer justify-center align-center">
            <FaMagnifyingGlass />
          </div>
        </div>
      </div>
    </div>
  );
}
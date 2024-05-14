"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function ProductsSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('search') || "";
  });

  const updateSearchTerm = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, [setSearch]);

  const submitSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, replace, search]);

  return (
    <div>
      <div>
        <div className="relative mt-2 rounded-md shadow-sm flex">
          <input
            type="text"
            name="search"
            value={search}
            className="block w-full rounded-l-md border-0 py-1.5 pl-7 pr-20 text-gray-900  placeholder:text-gray-400 focus:ring-2  sm:text-sm sm:leading-6"
            placeholder="Search"
            onChange={updateSearchTerm}
          />
          <div
            className="flex items-center bg-blue-600 text-white rounded-r-md w-24 cursor-pointer justify-center align-center"
            onClick={submitSearch}
          >
            <FaMagnifyingGlass />
          </div>
        </div>
      </div>
    </div>
  );
}
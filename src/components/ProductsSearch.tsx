"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, Fragment, useMemo } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Listbox, Transition } from '@headlessui/react'
import clsx from "clsx";
import { SortOrders } from "@/types";

const sortableKeys = [
  { label: "Date Added", value: "created_at" },
  { label: "Name", value: "name" },
]

const orderKeys = [
  { label: "Descending", value: SortOrders.Descending },
  { label: "Ascending", value: SortOrders.Ascending },
]

const categoryKeys = [
  { label: "Candles", value: "d0e73609-8c23-491f-8044-361e3bad95ba02ef648f-f4a5-4852-b3fd-0cc17e8cc2999c152eac-515f-4429-b610-65ff1f4624a004e5ea35-2663-4cb4-bff2-cbd8b0b387eb" },
  { label: "Jewelry", value: "empty" },
  { label: "Pottery", value: "empty" },
  { label: "Textiles", value: "empty" },
  { label: "Paintings", value: "empty" },
  { label: "Music", value: "0c44b8a7-184e-4644-bfed-98b0cf30f674" },
]

export default function ProductsSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('search') || "";
  });
  const [sort, setSort] = useState(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('key') || "created_at";
  });
  const [order, setOrder] = useState(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('order') || SortOrders.Descending;
  });
  const [category, setCategory] = useState(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('category') || "";
  });

  const updateSort = useCallback((newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams);
    params.set('key', newSort);

    replace(`${pathname}?${params.toString()}`);
  }, [setSort, searchParams, pathname, replace]);

  const updateOrder = useCallback((newOrder: string) => {
    setOrder(newOrder);
    const params = new URLSearchParams(searchParams);
    params.set('order', newOrder);

    replace(`${pathname}?${params.toString()}`);
  }, [setOrder, searchParams, pathname, replace]);

  const updateCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
    const params = new URLSearchParams(searchParams);
    params.set('category', newCategory);

    replace(`${pathname}?${params.toString()}`);
  }, [setSort, searchParams, pathname, replace]);

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

  const sortLabel = useMemo(() => {
    return Object.entries(sortableKeys).find(([_, { value }]) => value === sort)?.[1]?.label || "";
  }, [sort]);

  const orderLabel = useMemo(() => {
    return Object.entries(orderKeys).find(([_, { value }]) => value === order)?.[1]?.label || "";
  }, [order]);

  const categoryLabel = useMemo(() => {
    return Object.entries(categoryKeys).find(([_, { value }]) => value === category)?.[1]?.label || "";
  }, [category]);

  return (
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
      <div className="flex">
        <div className="flex-1">
          <Listbox value={sort} onChange={updateSort}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                    <span>{sortLabel}</span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {sortableKeys.map((key) => (
                        <Listbox.Option
                          key={key.value}
                          className={({ active }) =>
                            clsx(
                              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={key.value}
                        >
                          {({ selected, active }) => (
                            <div className="flex items-center">
                              <span
                                className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                              >
                                {key.label}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div className="flex-1">
          <Listbox value={order} onChange={updateOrder}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                    <span>{orderLabel}</span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {orderKeys.map((key) => (
                        <Listbox.Option
                          key={key.value}
                          className={({ active }) =>
                            clsx(
                              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={key.value}
                        >
                          {({ selected, active }) => (
                            <div className="flex items-center">
                              <span
                                className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                              >
                                {key.label}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div className="flex-1">
          <Listbox value={category} onChange={updateCategory}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                    <span>{categoryLabel}</span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {categoryKeys.map((key) => (
                        <Listbox.Option
                          key={key.value}
                          className={({ active }) =>
                            clsx(
                              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={key.value}
                        >
                          {({ selected, active }) => (
                            <div className="flex items-center">
                              <span
                                className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                              >
                                {key.label}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
      </div>
    </div>
  );
}
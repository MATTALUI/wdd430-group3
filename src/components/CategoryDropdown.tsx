import { getCategoriesWithPictures } from "@/lib/data";
"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, Fragment, useMemo, Suspense } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Listbox, Transition } from '@headlessui/react'
import clsx from "clsx";
import { Category, SortOrders } from "@/types";
export default async function CategoryDropdown({
  categories,
}: {
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [categoryId, setCategoryId] = useState(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('category_id') || "";
  });

  const updateCategoryId = useCallback((newId: string) => {
    setCategoryId(newId);
    const params = new URLSearchParams(searchParams);
    params.set('category_id', newId);

    replace(`${pathname}?${params.toString()}`);
  }, [setCategoryId, searchParams, pathname, replace]);

  const categoryLabel = useMemo(() => {
    return categories.find(c => c.id === categoryId)?.name || "Filter Category"
  }, [categories, categoryId]);

  return (
    <Listbox value={categoryId} onChange={updateCategoryId}>
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
                {categories.map((cat) => (
                  <Listbox.Option
                    key={cat.id}
                    className={({ active }) =>
                      clsx(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={cat.id}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center">
                        <span
                          className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                        >
                          {cat.name}
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
  )
}
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, Fragment, useMemo } from "react";
import { Listbox, Transition } from '@headlessui/react'
import clsx from "clsx";
import { getCategories } from "@/lib/data";


const categoryKeys = [
    { label: "All Categories", value: "" },
    { label: "Candles", value: "Candles" },
    { label: "Jewelry", value: "Jewelry" },
    { label: "Pottery", value: "Pottery" },
    { label: "Textiles", value: "Textiles" },
    { label: "Paintings", value: "Paintings" },
    { label: "Music", value: "Music" },
]

export default async function CategoryDropdown() {
    const categoryList = await getCategories()
    console.log(categoryList)
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [category, setCategory] = useState(() => {
        const params = new URLSearchParams(searchParams);
        return params.get('category') || "";
    });

    const updateCategory = useCallback((newCategory: string) => {
        setCategory(newCategory);
        const params = new URLSearchParams(searchParams);
        params.set('category', newCategory);
    
        replace(`${pathname}?${params.toString()}`);
    }, [setCategory, searchParams, pathname, replace]);

    const categoryLabel = useMemo(() => {
        return Object.entries(categoryKeys).find(([_, { value }]) => value === category)?.[1]?.label || "";
    }, [category]);
    
    return (
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
    )
}
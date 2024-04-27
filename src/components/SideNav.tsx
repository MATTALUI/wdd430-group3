"use client"

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useMemo } from "react";

interface ISidenavProps {
  open: boolean;
  toggleSidenav: () => void;
}
export default function SideNav({
  open,
  toggleSidenav
}: ISidenavProps) {

  const stopProp = useCallback((e:React.MouseEvent) => {
    e.stopPropagation();
  },[]);

  const links = useMemo(() => [
    { text: "Products", href: "/products" },
    { text: "My Products", href: "/products?creator=myidwillgohereeventually" },
    { text: "My Profile", href: "/sellers/myidwillgohereeventually" },
    { text: "Logout", href: "/" },
  ], [])

  return (
    <div
      onClick={toggleSidenav}
      className={clsx(
        "fixed top-0 left-0 overflow-hidden transition-all h-screen",
        open ? "w-screen" : "w-0"
      )}
    >
      <div
        onClick={stopProp}
        className="bg-red-900 w-9/12 h-screen pt-12 text-gray-50"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            onClick={toggleSidenav}
            className="block font-bold px-4 py-2 hover:bg-red-950"
            href={link.href}
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  )
}
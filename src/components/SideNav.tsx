"use client"

import clsx from "clsx";
import { useCallback } from "react";

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
        className="bg-red-900 w-9/12 h-screen"
      >
        Sidenav
      </div>
    </div>
  )
}
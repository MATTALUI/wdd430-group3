"use client"
import { useCallback, useState } from "react";
import SideNav from "./SideNav";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Navbar() {
  const [sidenavOpen, setSidenavOpen] = useState(false);

  const toggleSidenav = useCallback(() => {
    setSidenavOpen(!sidenavOpen);
  }, [sidenavOpen, setSidenavOpen]);

  return (
    <>
      <nav className="bg-red-800 p-4">
        <button
          className="hover:bg-red-900 text-gray-100 p-2 rounded-sm border-red-900 transition-all"
          onClick={toggleSidenav}
        >
          <GiHamburgerMenu />
        </button>
      </nav>
      <SideNav
        open={sidenavOpen}
        toggleSidenav={toggleSidenav}
      />
    </>
  );
}
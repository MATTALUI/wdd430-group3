"use client"
import { useCallback, useState } from "react";
import SideNav from "./SideNav";
import { GiHamburgerMenu } from "react-icons/gi";
import logoImage from "../../public/images/logo-hh.png";
import Image from 'next/image';
import Link from "next/link";

export default function Navbar() {
  const [sidenavOpen, setSidenavOpen] = useState(false);

  const toggleSidenav = useCallback(() => {
    setSidenavOpen(!sidenavOpen);
  }, [sidenavOpen, setSidenavOpen]);

  return (
    <>
      <nav className="bg-primary p-4 flex justify-between items-center">
        <div>
          <button
            className="hover:bg-red-900 text-gray-100 p-2 rounded-sm border-red-900 transition-all"
            onClick={toggleSidenav}
            aria-label="Menu"
          >
            <GiHamburgerMenu />
          </button>
        </div>
        <div>
          <Link href="/">
            <Image
              src={logoImage}
              alt=""
              placeholder="blur"
              style={{
                width: '220px',
                height: 'auto'
              }}

            />
          </Link>
        </div>
        <h1 className="invisible">Handcrafted Haven</h1>
      </nav>
      <SideNav
        open={sidenavOpen}
        toggleSidenav={toggleSidenav}
      />
    </>
  );
}

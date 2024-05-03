import { signOut } from "next-auth/react"
import clsx from "clsx";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

type NavLink = {
  text: string;
  href: string;
};
interface ISidenavProps {
  open: boolean;
  toggleSidenav: () => void;
}
export default function SideNav({
  open,
  toggleSidenav
}: ISidenavProps) {
  const { status, data } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = data?.user;

  const stopProp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const logout = useCallback(async () => {
    toggleSidenav();
    await signOut();
  }, []);

  const links = useMemo(() =>
    [
      { text: "Products", href: "/products" },
      user?.id && { text: "My Products", href: `/products?creator=${user.id}` },
      user?.id && { text: "My Profile", href: `/sellers/${user.id}` },
      !isLoggedIn && { text: "Login", href: "/login" },
    ].filter(l => !!l) as NavLink[],
    [isLoggedIn, user?.id]
  );

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
        className="bg-accent w-9/12 h-screen pt-12 text-gray-50"
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
        {isLoggedIn && (
          <div
            onClick={logout}
            className="block font-bold px-4 py-2 hover:bg-red-950 cursor-pointer"
          >
            Log Out
          </div>
        )}
      </div>
    </div>
  )
}
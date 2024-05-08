"use client"
import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
        <Link
            className="block bg-accent text-white font-bold py-4 px-4 my-10 max-w-80 mx-auto rounded focus:outline-none focus:shadow-outline hover:opacity-75"
            href="/products"
        >
            My Products
        </Link>
        <Link
            className="block bg-accent text-white font-bold py-4 px-4 my-10 max-w-80 mx-auto rounded focus:outline-none focus:shadow-outline hover:opacity-75"
            href="/sellers"
        >
            My Profile
        </Link>
    </div>
  );
}
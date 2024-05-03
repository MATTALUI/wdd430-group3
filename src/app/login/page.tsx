"use client"

import { authenticate } from "@/lib/actions";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function LoginPage() {
  const [errorMessage, attemptLogin] = useFormState(authenticate, undefined);

  return (
    <div>
      <div className="w-full max-w-xs">
        <form action={attemptLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" name="password"/>
          </div>
          <div className="flex items-center justify-between">
            <input type="submit" value="Sign In" className="bg-accent hover:opacity-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
            <Link
              className="inline-block align-baseline font-bold text-sm text-secondary"
              href="/signup"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
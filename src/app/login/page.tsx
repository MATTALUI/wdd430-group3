"use client"

import { authenticate } from "@/lib/actions";
import clsx from "clsx";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginPage() {
  const { pending } = useFormStatus();
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="email"
              type="email"
              placeholder="hello@handcrafted"
              name="email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              name="password"
            />
          </div>
          {!!errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Unable to Log In</strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <input
              type="submit"
              value="Sign In"
              className={clsx(
                "bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                !pending && "hover:opacity-75",
                pending && "opacity-50 cursor-not-allowed"
              )}
              disabled={pending}
            />
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
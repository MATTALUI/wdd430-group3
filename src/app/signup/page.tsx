import Link from "next/link";

export default function SignupPage() {
  return (
    <div>
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-lg font-bold mb-2">Create Account</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="LastName"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="Last Name"
            />
          </div>
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
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-0 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
              Repeat Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="repeatPassword" type="password" placeholder="********" />
          </div>
          <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">User Type</span>
            <div className="mb-2">
              <input
                type="radio"
                id="buyer"
                name="userType"
                value="buyer"
              />
              <label htmlFor="buyer">Buyer</label>
            </div>
            <div>
              <input
                type="radio"
                id="seller"
                name="userType"
                value="seller"
              />
              <label htmlFor="seller">Seller (artisans & crafters)</label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-accent hover:opacity-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Create
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-secondary"
              href="/login"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
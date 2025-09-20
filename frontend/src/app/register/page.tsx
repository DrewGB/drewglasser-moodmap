import NavBar from "@/components/Navbar";
import Link from "next/link";

export default function Register() {
  return (
    <div className="bg-brand-muted min-h-dvh flex flex-col justify-around">
      <NavBar />
      <main className="">
        
        <div className="p-10 w-1/2 mx-auto bg-brand-accent rounded-2xl">
            <form action="" method="post">
                <h1 className="text-2xl mb-4">Create an Account</h1>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="firstName">
                        First Name
                    </label>
                    <input className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="lastName">
                        Last Name
                    </label>
                    <input className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName" type="text" placeholder="Last Name" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="username">
                        E-mail
                    </label>
                    <input className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="E-mail" />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="">
                    Confirm Password
                  </label>
                  <input className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" />
                </div>
                <div className="flex items-center justify-between">
                  <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Sign In
                  </button>
                  <Link className="inline-block align-baseline font-bold text-sm text-white hover:text-gray-200" href="/">
                    Already have an account?
                  </Link>
                </div>
            </form>
        </div>
        
      </main>
    </div>
  );
}

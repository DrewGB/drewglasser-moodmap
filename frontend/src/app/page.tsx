import Link from "next/link";

export default function Home() {
  return (
    <div id="landing-main" className="bg-black min-h-dvh overflow-hidden absolute top-0 left-0 w-full">
      <div id="image-shader" className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      <nav className="bg-brand-bg p-6 flex absolute top-0 left-0 w-full justify-between">
        <Link href={"/"}>
          <h1 className="text-2xl">MoodMap</h1>
        </Link>
        <ul>
        </ul>
      </nav>
      <main className="grid grid-cols-3 min-h-dvh overflow-hidden">
        <div className="m-10 col-span-2 flex flex-col justify-around">
          <div>
            <h1 className="text-2xl">Welcome to MoodMap!</h1>
            <p className="mt-5">Journal how you are feeling and see your mood mapped out so you can understand how your mood is changing over time.</p>
          </div>
          
        </div>
        <div className="bg-brand-primary h-full flex flex-col justify-around">
          <form className="m-10" action="" method="post">
            <h1 className="text-2xl mb-4">Sign in</h1>
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
            <div className="flex items-center justify-between">
              <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Sign In
              </button>
              <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/register">
                Don't have an account?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

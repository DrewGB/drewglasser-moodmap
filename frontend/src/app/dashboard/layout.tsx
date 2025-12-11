import LogoutButton from "@/components/LogoutButton";
import NavBar from "@/components/Navbar";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-brand-muted min-h-dvh overflow-hidden absolute top-0 left-0 w-full">

      <nav className="bg-brand-bg p-6 flex absolute top-0 left-0 w-full justify-between">
        <Link href={"/dashboard"}>
          <h1 className="text-4xl">MoodMap</h1>
        </Link>
        <ul>
        </ul>
      </nav>
      <div className="p-11 bg-white"></div>
      <main className="grid grid-cols-6 min-h-dvh overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="bg-brand-primary h-full flex flex-col w-full">
        <ul className="w-full">
          {/* Home */}
          <li>
            <Link
              href="/dashboard"
              className="block w-full p-3 text-center hover:bg-brand-bg"
            >
              <span className="text-brand-text text-2xl">Home</span>
            </Link>
          </li>

          {/* Create entry */}
          <li>
            <Link
              href="/dashboard/create"
              className="block w-full p-3 text-center hover:bg-brand-bg"
            >
              <span className="text-brand-text text-2xl">Create Entry</span>
            </Link>
          </li>

          {/* All entries */}
          <li>
            <Link
              href="/dashboard/list"
              className="block w-full p-3 text-center hover:bg-brand-bg"
            >
              <span className="text-brand-text text-2xl">All Entries</span>
            </Link>
          </li>

          {/* Logout */}
          <li className="">
            <LogoutButton />
          </li>
        </ul>
          
        </div>
        <div className="col-span-5 text-black">
          {children}
          
        </div>
        
      </main>
    </div>
    )
}
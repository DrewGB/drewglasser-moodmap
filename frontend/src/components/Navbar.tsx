import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="absolute left-0 top-0 w-full bg-brand-bg p-6 flex justify-between">
            <Link href="/">
                <h1 className="text-2xl">MoodMap</h1>
            </Link>
            <ul>
                <Link href="/" className="bg-brand-accent hover:bg-brand-accent-hover rounded p-2 px-3">Sign In</Link>
            </ul>
      </nav>
    )
}
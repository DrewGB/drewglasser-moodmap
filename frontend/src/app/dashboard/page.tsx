import Link from "next/link";

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <Link href="/dashboard/create" className="bg-brand-accent hover:bg-brand-accent-hover rounded p-2 px-3">Create</Link>
        </div>
    )
}
import Link from "next/link";

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl">Dashboard</h1>
            <Link href="/dashboard/create" className="bg-brand-accent text-brand-muted hover:bg-brand-accent-hover rounded p-2 px-3">Create</Link>
        </div>
    )
}
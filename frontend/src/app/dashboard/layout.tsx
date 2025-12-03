import NavBar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-brand-muted min-h-dvh flex flex-col justify-around">
            <NavBar />
            <main className="">
                {children}
            </main>
        </div>
    )
}
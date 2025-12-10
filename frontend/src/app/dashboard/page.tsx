"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

type Entry = {
    id: string;
    title: string;
    mood: number;
    body: string;
    created_at: string;
    updated_at: string;
}

type Entries = {
    data: Entry[];
    count: number;
}

export default function Dashboard() {
    const [entries, setEntries] = useState<Entries>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/entries", {
                    method: "GET"
                });
        
                if (!res.ok) {
                    setError("Failed to load entries");
                    return;
                }
        
                const json: Entries = await res.json();
                setEntries(json);
            } catch(err){
                console.error(err);
                setError("Something went wrong while loading your entries");
            }

        })();
    }, []);

    return (
        <div className="min-h-screen m-3 p-2 bg-slate-200 border rounded-2xl flex flex-col">
            <h1 className="ml-2 mt-2 text-3xl">Welcome to Your Dashboard</h1>

            <div className="flex-1 flex gap-8 p-4">
                <div className="flex-1 border rounded-2xl">
                <h2 className="text-xl m-2">Recent Journal Entries</h2>

                {error && <p className="text-red-500">{error}</p>}
                {!entries && !error && <p>Loading your entries…</p>}
                {entries && entries.count === 0 && (
                    <p>You don&apos;t have any entries yet.</p>
                )}

                {entries && entries.count > 0 ? (
                    <div className="flex flex-col gap-2">
                        {entries.data.slice(0, 10).map((e) => (
                            <Link
                            key={e.id}
                            href={`/dashboard/entries/${e.id}`}
                            className="block border rounded p-2 mt-2 ml-2 mr-2 hover:bg-gray-300"
                            >
                            <strong>{e.title || "(Untitled)"}</strong> — Mood: {e.mood} —{" "}
                            {new Date(e.created_at).toLocaleDateString()}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>
                        You have no created entries. Create an entry to see your mood over
                        time!
                    </p>
                )}
                </div>

                <div className="flex-1 border rounded-2xl flex items-center justify-center">
                    <p className="text-4xl"><strong>Insert Graph Here</strong></p>
                </div>
            </div>
        </div>
    )
}
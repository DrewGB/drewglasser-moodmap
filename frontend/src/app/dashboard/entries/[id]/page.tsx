"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Entry = {
    id: string;
    title: string;
    mood: number;
    body: string;
    created_at: string;
    updated_at: string;
}

export default function EntryPage(){
    const params = useParams<{ id: string}>();
    const id = params.id

    const [entry, setEntry] = useState<Entry | null>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        (async () => {
            if (!id) return;
            try{
                const res = await fetch(`/api/entries/${id}`, {
                    method: "GET",
                    cache: "no-store",
                })

                if (res.status === 404){
                    setError("Entry not found");
                    return;
                }

                if(!res.ok) {
                    setError("Something went wrong while loading the entry")
                    return;
                }

                const data: Entry = await res.json()
                setEntry(data)
            } catch (err) {
                console.error(err);
                setError("Something went wrong while loading the entry")
            }
        })();
    }, [id])

    if(error){
        return (
            <div className="mt-5 mb-5">
                <p className="text-4xl">{error}</p>
            </div>
        )
    }

    if(!entry){
        return (
            <div className="m-auto">
                <p className="text-3xl">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex-1 px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-4">
            {/* Title + meta */}
            <div className="space-y-1">
                <h1 className="text-4xl font-semibold">
                {entry.title}
                </h1>
                <p className="text-sm text-slate-600">
                Date: {new Date(entry.created_at).toLocaleDateString()} · Mood:{" "}
                <span className="font-semibold">{entry.mood}</span>
                </p>
            </div>

            {/* Body */}
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {entry.body}
            </div>
            </div>
        </div>
    )
}
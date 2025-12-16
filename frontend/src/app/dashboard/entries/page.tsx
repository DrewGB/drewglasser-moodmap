"use client";

import { MoodChart } from "@/components/MoodChart";
import Link from "next/link";
import { useEffect, useState } from "react";

type Entry = {
  id: string;
  title: string;
  mood: number;
  body: string;
  created_at: string;
  updated_at: string;
};

type Entries = {
  data: Entry[];
  count: number;
};

export default function Entries() {
  const [entries, setEntries] = useState<Entries>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/entries", {
          method: "GET",
        });

        if (!res.ok) {
          setError("Failed to load entries");
          return;
        }

        const json: Entries = await res.json();
        setEntries(json);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading your entries");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen m-4 p-6 bg-slate-100 border border-slate-200 rounded-2xl shadow-lg flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">All Entries</h1>
      </header>

      <main className="flex-1 grid grid-cols-1 gap-6">
        {/* Entries card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          

          <div className="p-4 space-y-3 flex-1">
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {!error && !entries && (
              <p className="text-sm text-slate-500">
                Loading your entries…
              </p>
            )}

            {entries && entries.count > 0 && (
              <div className="space-y-2 max-h-[26rem] overflow-y-auto pr-1">
                {entries.data
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((e) => (
                    <Link
                      key={e.id}
                      href={`/dashboard/entries/${e.id}`}
                      className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {e.title || "(Untitled)"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(e.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm font-semibold">
                          Mood:{" "}
                          <span className="text-purple-700">
                            {e.mood}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}

            {entries && entries.count === 0 && !error && (
              <p className="text-sm text-slate-500">
                You haven&apos;t created any entries yet. Start journaling to
                see your mood trends.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

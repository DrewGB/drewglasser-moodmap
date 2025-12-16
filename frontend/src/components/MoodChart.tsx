"use client"
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

type Entry = {
    id: string;
    title: string;
    mood: number;
    body: string;
    created_at: string;
    updated_at: string;
};

type MoodChartProps = {
    entries: Entry[];
};

export function MoodChart({ entries } : MoodChartProps){
    if (!entries || entries.length === 0) {
        return <p className="text-center text-sm text-gray-500">No data yet.</p>;
    }

    const data = entries
        .slice()
        .sort(
            (a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        .map((e) => ({
            dateLabel: new Date(e.created_at).toLocaleDateString(),
            mood: e.mood,
        }))



    return (
        <LineChart
            style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
            responsive
            data={data}
            margin={{
                top: 20,
                right: 20,
                bottom: 5,
                left: 0,
            }}
            >
            <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="mood" stroke="purple" strokeWidth={2} name="Mood" />
            <XAxis dataKey="dateLabel" />
            <YAxis
                label={{ value: "Mood", position: "insideLeft", angle: -90 }}
                domain={[1, 10]}
                ticks={[1,2,3,4,5,6,7,8,9,10]}
            />
            <Legend align="right" />
            <Tooltip />
        </LineChart>
    )
}
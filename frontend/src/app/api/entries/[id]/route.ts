import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(_: NextRequest, { params } : { params: { id: string}},){
    const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const res = await fetch(`${base}/entries/${params.id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    })

    if(!res.ok)
    {
        return NextResponse.json({ error: "Failed to get entry" }, { status: res.status })
    }

    const entry = await res.json()
    return NextResponse.json(entry)
}
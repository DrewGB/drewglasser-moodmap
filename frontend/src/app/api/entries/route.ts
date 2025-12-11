import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Route: POST /api/entries
 * Create a new entry in the database
 * @param request - The request object
 * @returns The new entry
 */
export async function POST(request: NextRequest){
    // get the base URL from the environment variables
    const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

    // get the mood, title, and body from the request body
    const { mood, title, body } = await request.json()

    // get the access token from the cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    // if the access token is not found, return a 401 error
    if (!accessToken) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    // send entry data to backend api
    const res = await fetch(`${base}/entries/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            mood,
            title,
            body 
        }),
    })

    // if the response is not ok, return a 400 error
    if (!res.ok) {
        return NextResponse.json({ error: "Failed to create entry" }, { status: res.status })
    }

    // return the new entry
    const newEntry = await res.json()
    return NextResponse.json(newEntry)
}

export async function GET(){
    const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const res = await fetch(`${base}/entries/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    })

    if(!res.ok)
    {
        return NextResponse.json({ error: "Failed to get entries" }, { status: res.status })
    }

    const entries = await res.json()
    return NextResponse.json(entries)
}
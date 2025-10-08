import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"
    
    const { email, password} = await request.json()
    
    const res = await fetch(`${base}/login/access-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: email,
            password: password,
        })
    })

    const data = await res.json()
    
    if (!res.ok)
    {
        return NextResponse.json(
            { error: data?.detail || "Invalid credentials"},
            { status: res.status }
        )
    }

    const response = NextResponse.json({ success: true })
    
    response.cookies.set({
        name: "access_token",
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60,
    })
    console.log("Setting Cookie")
    return response
}
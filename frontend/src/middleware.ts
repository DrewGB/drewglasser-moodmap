import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("access_token")?.value;

    if(!token){
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
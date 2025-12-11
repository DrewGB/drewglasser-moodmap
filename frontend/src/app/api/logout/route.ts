import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Remove the auth cookie
  cookieStore.delete("access_token");

  const res = NextResponse.json({ success: true });
  return res;
}

import { NextRequest, NextResponse } from "next/server";

const CORRECT_PASSWORD = process.env.SITE_PASSWORD || "afiliantka2025";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === CORRECT_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

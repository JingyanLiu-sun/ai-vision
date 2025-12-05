import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/";
  const absolute = new URL(callbackUrl, `${url.protocol}//${url.host}`).toString();
  const res = NextResponse.redirect(absolute);
  res.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  return res;
}

export async function POST(request) {
  let callbackUrl = "/";
  try {
    const body = await request.json();
    if (body && typeof body.callbackUrl === "string") {
      callbackUrl = body.callbackUrl || "/";
    }
  } catch {}
  const url = new URL(request.url);
  const absolute = new URL(callbackUrl, `${url.protocol}//${url.host}`).toString();
  const res = NextResponse.redirect(absolute);
  res.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  return res;
}

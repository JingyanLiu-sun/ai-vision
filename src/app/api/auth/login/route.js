import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/sqlite";
import { findUserByPhonePrisma } from "@/app/lib/prisma";
import { signJwt } from "@/app/lib/jwt";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const phone = String(data?.phone || "").trim();
  const password = String(data?.password || "");
  if (!phone || !password) return new Response("Missing credentials", { status: 400 });

  const user = await findUserByPhonePrisma(phone);
  if (!user) return new Response("User not found", { status: 404 });
  const { hash } = hashPassword(password, user.salt);
  if (hash !== user.password_hash) return new Response("Invalid credentials", { status: 401 });

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";
  const token = signJwt({ sub: user.id, phone: user.phone }, secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 3600,
  });
  return res;
}

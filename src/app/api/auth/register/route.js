import { NextResponse } from "next/server";
import { validatePhone, hashPassword } from "@/app/lib/sqlite";
import { createUserPrisma, findUserByPhonePrisma, ensureUsersTable } from "@/app/lib/prisma";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const phone = String(data?.phone || "").trim();
  const password = String(data?.password || "");
  if (!validatePhone(phone)) return new Response("Invalid phone", { status: 400 });
  if (password.length < 6) return new Response("Password too short", { status: 400 });

  try {
    await ensureUsersTable();
    const exists = await findUserByPhonePrisma(phone);
    if (exists) return new Response("Phone already registered", { status: 409 });
    const { salt, hash } = hashPassword(password);
    await createUserPrisma(phone, hash, salt);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = typeof err?.message === "string" ? err.message : String(err || "Unknown error");
    return new Response(`Registration failed: ${msg}`, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { validatePhone, createUser } from "@/app/lib/sqlite";

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

  const user = await createUser(phone, password);
  if (!user) return new Response("Phone already registered", { status: 409 });

  return NextResponse.json({ ok: true });
}

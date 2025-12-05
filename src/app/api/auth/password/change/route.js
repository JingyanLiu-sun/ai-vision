import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserById, hashPassword, updateUserPasswordById } from "@/app/lib/sqlite";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const oldPassword = String(body?.oldPassword || "");
  const newPassword = String(body?.newPassword || "");
  if (!oldPassword || !newPassword) return new Response("Missing fields", { status: 400 });
  if (newPassword.length < 6) return new Response("Password too short", { status: 400 });

  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const user = await findUserById(session.user.id);
  if (!user) return new Response("User not found", { status: 404 });
  const { hash } = hashPassword(oldPassword, user.salt);
  if (hash !== user.password_hash) return new Response("Invalid credentials", { status: 401 });

  const ok = await updateUserPasswordById(user.id, newPassword);
  if (!ok) return new Response("Update failed", { status: 500 });
  return NextResponse.json({ ok: true });
}


import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/sqlite";
import { updateUserPasswordByIdPrisma, findUserByPhonePrisma } from "@/app/lib/prisma";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const phone = String(body?.phone || "").trim();
  const newPassword = String(body?.newPassword || "");
  const adminKey = String(body?.adminKey || "");
  if (!phone || !newPassword || !adminKey) return new Response("Missing fields", { status: 400 });
  if (newPassword.length < 6) return new Response("Password too short", { status: 400 });

  const expected = process.env.ADMIN_RESET_KEY || "";
  if (!expected || adminKey !== expected) return new Response("Forbidden", { status: 403 });

  const user = await findUserByPhonePrisma(phone);
  if (!user) return new Response("User not found", { status: 404 });

  const { salt, hash } = hashPassword(newPassword);
  const ok = await updateUserPasswordByIdPrisma(user.id, hash, salt);
  if (!ok) return new Response("Update failed", { status: 500 });
  return NextResponse.json({ ok: true });
}

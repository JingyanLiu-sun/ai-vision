import { NextResponse } from "next/server";
import { updateUserPasswordById, findUserByPhone } from "@/app/lib/sqlite";

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

  const user = await findUserByPhone(phone);
  if (!user) return new Response("User not found", { status: 404 });

  const ok = await updateUserPasswordById(user.id, newPassword);
  if (!ok) return new Response("Update failed", { status: 500 });
  return NextResponse.json({ ok: true });
}


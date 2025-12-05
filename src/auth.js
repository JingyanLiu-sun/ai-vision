import { cookies } from "next/headers";
import { verifyJwt } from "@/app/lib/jwt";

export async function auth() {
  try {
    const store = await cookies();
    const token = store.get("session")?.value;
    if (!token) return null;
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";
    const payload = verifyJwt(token, secret);
    if (!payload) return null;
    return { user: { id: payload.sub, phone: payload.phone } };
  } catch {
    return null;
  }
}

export function signOut({ callbackUrl } = {}) {
  if (typeof window !== "undefined") {
    const cb = callbackUrl || "/";
    window.location.href = `/api/auth/logout?callbackUrl=${encodeURIComponent(cb)}`;
  }
}

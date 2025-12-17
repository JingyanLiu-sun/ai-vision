import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

let dbInstance;
let DatabaseCtor;
let nativeAvailable = false;

async function getDatabaseCtor() {
  if (DatabaseCtor) return DatabaseCtor;
  const mod = await import("better-sqlite3");
  DatabaseCtor = mod.default;
  nativeAvailable = true;
  return DatabaseCtor;
}

function getDbPath() {
  const raw = String(process.env.DATABASE_URL).trim();
  if (raw) {
    if (raw.startsWith("file:")) return raw.slice(5);
    if (raw.startsWith("sqlite:")) return raw.slice(7);
    return raw;
  }
  return "/data/app.db";
}

async function ensureDbFile(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(String(phone || "").trim());
}

export function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(String(password), s, 64).toString("hex");
  return { salt: s, hash: key };
}

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

let dbInstance;
let DatabaseCtor;
let nativeAvailable;

async function getDatabaseCtor() {
  if (DatabaseCtor) return DatabaseCtor;
  const mod = await import("better-sqlite3");
  DatabaseCtor = mod.default;
  nativeAvailable = true;
  return DatabaseCtor;
}

function getDbPath() {
  const configured = process.env.SQLITE_DB_PATH;
  if (configured && configured.trim()) return configured.trim();
  const dir = path.join(process.cwd(), "var", "sqlite");
  return path.join(dir, "app.db");
}

async function ensureDbFile(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export async function initDb() {
  if (dbInstance) return dbInstance;
  const Database = await getDatabaseCtor();
  const dbPath = getDbPath();
  await ensureDbFile(dbPath);
  dbInstance = new Database(dbPath, { verbose: null });
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.pragma("foreign_keys = ON");
  dbInstance.exec(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`
  );
  return dbInstance;
}

export function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(String(phone || "").trim());
}

export function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(String(password), s, 64).toString("hex");
  return { salt: s, hash: key };
}

export async function findUserByPhone(phone) {
  const db = await initDb();
  const stmt = db.prepare("SELECT id, phone, password_hash, salt, created_at FROM users WHERE phone = ?");
  return stmt.get(phone) || null;
}

export async function createUser(phone, password) {
  const db = await initDb();
  const exists = db.prepare("SELECT 1 FROM users WHERE phone = ?").get(phone);
  if (exists) return null;
  const { salt, hash } = hashPassword(password);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const insert = db.prepare(
    "INSERT INTO users (id, phone, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)"
  );
  insert.run(id, phone, hash, salt, createdAt);
  return { id, phone, created_at: createdAt };
}

export async function findUserById(id) {
  const db = await initDb();
  const stmt = db.prepare("SELECT id, phone, password_hash, salt, created_at FROM users WHERE id = ?");
  return stmt.get(id) || null;
}

export async function updateUserPasswordById(id, newPassword) {
  const db = await initDb();
  const { salt, hash } = hashPassword(newPassword);
  const stmt = db.prepare("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?");
  const info = stmt.run(hash, salt, id);
  return info.changes > 0;
}

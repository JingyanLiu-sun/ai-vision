import { PrismaClient } from "@/generated/prisma";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

let prismaInstance;

function getSqliteUrl() {
  const raw = String(process.env.DATABASE_URL || "").trim();
  // Remove 'file:' prefix for better-sqlite3
  if (raw.startsWith("file:")) {
      return raw.slice(5);
  }
  const p = String(process.env.SQLITE_DB_PATH || "").trim();
  if (p) return p;
  return path.join(process.cwd(), "data", "app.db");
}

export function getPrisma() {
  if (!prismaInstance) {
    const dbPath = getSqliteUrl();
    const db = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(db);
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

export async function ensureUsersTable() {
  const prisma = getPrisma();
  // We can let Prisma Migrate handle this now, or keep it as a fallback
  // but for consistency with the schema, we should avoid manual table creation
  // if migration is used.
  // However, for safety in this environment:
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT,
      email TEXT,
      image TEXT,
      bio TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function findUserByPhonePrisma(phone) {
  const prisma = getPrisma();
  return prisma.users.findUnique({ where: { phone } });
}

export async function createUserPrisma(phone, password_hash, salt) {
  const prisma = getPrisma();
  return prisma.users.create({ data: { phone, password_hash, salt } });
}

export async function findUserByIdPrisma(id) {
  const prisma = getPrisma();
  return prisma.users.findUnique({ where: { id } });
}

export async function updateUserPasswordByIdPrisma(id, password_hash, salt) {
  const prisma = getPrisma();
  const res = await prisma.users.update({ where: { id }, data: { password_hash, salt } });
  return !!res?.id;
}

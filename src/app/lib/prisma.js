import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

let prismaInstance;

function getSqliteUrl() {
  const raw = String(process.env.DATABASE_URL || "").trim();
  if (raw) return raw;
  const p = String(process.env.SQLITE_DB_PATH || "").trim();
  if (p) return `file:${p}`;
  return `file:${path.join(process.cwd(), "data", "app.db")}`;
}

export function getPrisma() {
  if (!prismaInstance) {
    const adapter = new PrismaBetterSqlite3({ url: getSqliteUrl() });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

export async function ensureUsersTable() {
  const prisma = getPrisma();
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
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

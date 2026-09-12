/**
 * Prisma Client singleton for Next.js.
 * Uses @prisma/adapter-mariadb (MySQL-compatible) as required by Prisma 7.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Prevent multiple connections in Next.js dev hot-reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const dbUrl = (process.env.DATABASE_URL || "").replace(/^mysql:\/\//, "mariadb://");
  const adapter = new PrismaMariaDb(dbUrl);
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  const existing = globalForPrisma.prisma;
  if (
    existing &&
    "hackCheckEntry" in existing &&
    "hackConfirmationEntry" in existing &&
    "hackDoneEntry" in existing &&
    "voucherConfirmationEntry" in existing
  ) {
    return existing;
  }
  const fresh = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = fresh;
  }
  return fresh;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

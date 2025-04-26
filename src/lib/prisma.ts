import { PrismaClient } from "@prisma/client";

// 1) Tell TS that globalThis now has a `prisma?: PrismaClient`
declare global {
  namespace globalThis {
    var prisma: PrismaClient | undefined;
  }
}

// 2) Either use an existing client or instantiate a new one
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : [],
  });

// 3) In dev, stash it so we reuse instead of spawning many clients
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

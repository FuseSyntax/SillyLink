import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in development
declare global {
  namespace globalThis {
    var prisma: PrismaClient | undefined;
  }
}

// Initialize Prisma Client with logging
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : [],
  });
};

// Use existing instance if available, else create new
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

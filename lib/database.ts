import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  DatabaseClient: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const DatabaseClient =
  globalThis.DatabaseClient ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production")
  globalThis.DatabaseClient = DatabaseClient;

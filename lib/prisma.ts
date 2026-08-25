import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

globalForPrisma.prisma = prisma;

export { prisma };

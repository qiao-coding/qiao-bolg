import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

let databaseUrl = process.env.DATABASE_URL || '';
if (databaseUrl && !databaseUrl.includes('connection_limit') && !databaseUrl.includes('pool_timeout')) {
  // 添加连接池参数到URL
  const separator = databaseUrl.includes('?') ? '&' : '?';
  databaseUrl += `${separator}connection_limit=5&pool_timeout=30&connect_timeout=30`;
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
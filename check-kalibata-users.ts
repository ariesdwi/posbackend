import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const kalibata = await prisma.business.findFirst({
    where: { name: { contains: 'Kalibata' } },
    include: {
      users: { select: { name: true, email: true, role: true } },
      products: { select: { id: true, name: true } },
      categories: { select: { id: true, name: true } },
    },
  });

  console.log('📊 Bebek Fara Kalibata Status:\n');
  console.log(`Business: ${kalibata?.name}`);
  console.log(`ID: ${kalibata?.id}`);
  console.log(`\nUsers (${kalibata?.users.length}):`);
  kalibata?.users.forEach((u) => {
    console.log(`  - ${u.name} (${u.email}) [${u.role}]`);
  });
  console.log(`\nCategories (${kalibata?.categories.length}):`);
  kalibata?.categories.forEach((c) => {
    console.log(`  - ${c.name}`);
  });
  console.log(`\nProducts: ${kalibata?.products.length}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);

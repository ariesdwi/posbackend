import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 5,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ⚠️ SAFETY: Only link transactions for Bebek Fara
  const businessId = 'cmkc7lejr00004yktqn5kj064'; // Bebek Fara ONLY
  
  // Find current open shift
  const shift = await prisma.shift.findFirst({
    where: {
      businessId,
      status: 'OPEN',
    },
    orderBy: {
      startTime: 'desc',
    },
  });
  
  if (!shift) {
    console.log('❌ No open shift found');
    return;
  }
  
  console.log(`Found open shift: ${shift.id}`);
  
  // Update all completed transactions without shift to link to current shift
  const result = await prisma.transaction.updateMany({
    where: {
      businessId,
      status: 'COMPLETED',
      shiftId: null,
    },
    data: {
      shiftId: shift.id,
    },
  });
  
  console.log(`✅ Linked ${result.count} transactions to shift ${shift.id}`);
  await pool.end();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

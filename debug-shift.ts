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
  const businessId = 'cmrxk4qwb00008js3exkumyk3'; // Bebek Fara
  
  console.log('🔍 DEBUG: Checking shifts for Bebek Fara');
  console.log('Business ID:', businessId);
  console.log('');
  
  // Check all shifts
  const allShifts = await prisma.shift.findMany({
    where: { businessId },
    select: {
      id: true,
      status: true,
      startTime: true,
      endTime: true,
      userId: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      startTime: 'desc'
    },
    take: 5
  });
  
  console.log(`Found ${allShifts.length} shifts:`);
  allShifts.forEach((s, i) => {
    console.log(`\n${i+1}. Shift ID: ${s.id}`);
    console.log(`   Status: ${s.status}`);
    console.log(`   User: ${s.user.name} (${s.user.email})`);
    console.log(`   Start: ${s.startTime}`);
    console.log(`   End: ${s.endTime || 'N/A'}`);
  });
  
  // Check specifically OPEN shifts
  console.log('\n\n🔍 Looking for OPEN shifts...');
  const openShifts = await prisma.shift.findMany({
    where: {
      businessId,
      status: 'OPEN'
    }
  });
  
  console.log(`Found ${openShifts.length} OPEN shifts`);
  
  await pool.end();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

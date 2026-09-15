const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking last 3 transactions in DB...\n');
  
  const transactions = await prisma.transaction.findMany({
    where: {
      businessId: 'cmrxk4qwb00008js3exkumyk3' // Bebek Fara
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      transactionNumber: true,
      shiftId: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      user: { select: { name: true } }
    }
  });
  
  if (transactions.length === 0) {
    console.log('❌ No transactions found for Bebek Fara');
  } else {
    transactions.forEach((t, i) => {
      console.log(`Transaction ${i+1}:`);
      console.log(`  ID: ${t.id}`);
      console.log(`  Number: ${t.transactionNumber}`);
      console.log(`  ShiftId: ${t.shiftId || 'NULL'}`);
      console.log(`  Amount: ${t.totalAmount}`);
      console.log(`  Status: ${t.status}`);
      console.log(`  User: ${t.user.name}`);
      console.log(`  Created: ${t.createdAt}`);
      console.log('');
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

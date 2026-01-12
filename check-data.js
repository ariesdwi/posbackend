const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const transactionCount = await prisma.transaction.count();
    
    console.log('Production Database Data:');
    console.log('- Users:', userCount);
    console.log('- Products:', productCount);
    console.log('- Transactions:', transactionCount);
    
    if (userCount > 0) {
      const sampleUser = await prisma.user.findFirst();
      console.log('\nSample User:', JSON.stringify(sampleUser, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();

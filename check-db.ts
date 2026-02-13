import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const businessId = 'cmkc7lejr00004yktqn5kj064';
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true }
    });
    console.log('Business record:', business);
  } catch (e) {
    console.error('Error querying database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

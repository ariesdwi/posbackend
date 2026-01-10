import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Scanning for corrupt image URLs...');

  const corruptProducts = await prisma.product.findMany({
    where: {
      imageUrl: {
        contains: 'undefined',
      },
    },
  });

  console.log(`Found ${corruptProducts.length} corrupt products.`);

  if (corruptProducts.length > 0) {
    console.log('🧹 Cleaning up corrupt URLs...');
    
    // Process in chunks or one by one if necessary, but updateMany is fine here
    const result = await prisma.product.updateMany({
      where: {
        imageUrl: {
          contains: 'undefined',
        },
      },
      data: {
        imageUrl: null,
      },
    });

    console.log(`✅ Successfully reset ${result.count} products to have null imageUrl.`);
  } else {
    console.log('✨ No corrupt URLs found. Database is clean.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

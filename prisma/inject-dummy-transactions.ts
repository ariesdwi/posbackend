import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const businessId = 'cmkc7lzk30000u8ktg47bkvzp';
  const userId = 'cmkc7lzo70003u8kt8ud4otz8';
  
  console.log('🚀 Starting transaction injection for Kedai Kita...');

  // Get products
  const products = await prisma.product.findMany({
    where: { businessId }
  });

  if (products.length === 0) {
    console.error('❌ No products found for Kedai Kita. Please seed products first.');
    return;
  }

  const paymentMethods = ['CASH', 'QRIS', 'TRANSFER'];
  const now = new Date();

  // Inject for last 7 days
  for (let day = 0; day < 7; day++) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - day);
    
    // 5-10 transactions per day
    const numTransactions = Math.floor(Math.random() * 6) + 5;
    
    console.log(`📅 Injecting ${numTransactions} transactions for ${targetDate.toDateString()}...`);

    for (let i = 0; i < numTransactions; i++) {
        // Random time during business hours (10 AM - 9 PM)
        const trxDate = new Date(targetDate);
        trxDate.setHours(10 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60));

        // 1-3 items per transaction
        const numItems = Math.floor(Math.random() * 3) + 1;
        const selectedProducts: any[] = [];
        for (let j = 0; j < numItems; j++) {
            selectedProducts.push(products[Math.floor(Math.random() * products.length)]);
        }

        let totalAmount = 0;
        const transactionItems = selectedProducts.map(p => {
            const quantity = Math.floor(Math.random() * 3) + 1;
            const subtotal = Number(p.price) * quantity;
            totalAmount += subtotal;
            return {
                productId: p.id,
                productName: p.name,
                quantity: quantity,
                price: p.price,
                costPrice: p.costPrice,
                subtotal: new Prisma.Decimal(subtotal)
            };
        });

        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const trxNumber = `TRX-DUMMY-${day}-${i}-${Date.now().toString().slice(-4)}`;

        await prisma.transaction.create({
            data: {
                transactionNumber: trxNumber,
                userId: userId,
                businessId: businessId,
                totalAmount: new Prisma.Decimal(totalAmount),
                paymentMethod: paymentMethod as any,
                paymentAmount: new Prisma.Decimal(totalAmount),
                status: 'COMPLETED',
                createdAt: trxDate,
                updatedAt: trxDate,
                items: {
                    create: transactionItems
                }
            }
        });
    }
  }

  console.log('🎉 Transaction injection completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error injecting transactions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

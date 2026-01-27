import 'dotenv/config';
import { PrismaClient, TransactionStatus, PaymentMethod, Prisma } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting transaction seeding...');

  // Get Business
  const business = await prisma.business.findFirst({
    where: { name: 'Kedai Kita' },
  });

  if (!business) {
    throw new Error('Business "Kedai Kita" not found. Please run the main seed first.');
  }

  // Get Cashier
  const cashier = await prisma.user.findFirst({
    where: { 
        businessId: business.id,
        // Try to find a role that makes sense, or just any user
        OR: [{ role: 'KASIR' }, { role: 'BUSINESS_OWNER' }]
    },
  });

  if (!cashier) {
    throw new Error('No user found for the business.');
  }

  // Get Products
  const products = await prisma.product.findMany({
    where: { businessId: business.id },
  });

  if (products.length === 0) {
    throw new Error('No products found. Please run the main seed first.');
  }

  const paymentMethods = [
    PaymentMethod.CASH,
    PaymentMethod.CASH,
    PaymentMethod.CASH, // Weigh heavily towards CASH
    PaymentMethod.QRIS,
    PaymentMethod.TRANSFER,
    PaymentMethod.CARD
  ];

  // Generate for last 30 days
  const today = new Date();
  const daysToGenerate = 30;
  let totalGenerated = 0;

  for (let i = daysToGenerate; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random transactions per day (10 to 30 to make it look busy)
    const dailyCount = Math.floor(Math.random() * 21) + 10;
    
    console.log(`Generating ${dailyCount} transactions for ${date.toISOString().split('T')[0]}...`);

    for (let j = 0; j < dailyCount; j++) {
      // Set random time within business hours (10:00 - 22:00)
      const transactionDate = new Date(date);
      transactionDate.setHours(10 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

      // 1 to 5 random items
      const itemCount = Math.floor(Math.random() * 5) + 1;
      const selectedItems: any[] = [];
      let totalAmount = 0;
      let totalCost = 0;

      for (let k = 0; k < itemCount; k++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        const price = Number(product.price);
        const cost = Number(product.costPrice);
        const subtotal = price * quantity;

        totalAmount += subtotal;
        totalCost += cost * quantity;

        selectedItems.push({
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          price: new Prisma.Decimal(price),
          subtotal: new Prisma.Decimal(subtotal),
          costPrice: new Prisma.Decimal(cost),
        });
      }

      // Generate Transaction Number
      const dateStr = transactionDate.toISOString().split('T')[0].replace(/-/g, '');
      const timeStr = transactionDate.toTimeString().split(' ')[0].replace(/:/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const transactionNumber = `TRX-${dateStr}-${timeStr}-${randomSuffix}`;

      // Payment logic
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentAmount = totalAmount; // Exact payment for simplicity

      await prisma.transaction.create({
        data: {
          transactionNumber,
          userId: cashier.id,
          businessId: business.id,
          totalAmount: new Prisma.Decimal(totalAmount),
          paymentMethod: paymentMethod,
          paymentAmount: new Prisma.Decimal(paymentAmount),
          changeAmount: new Prisma.Decimal(0),
          status: TransactionStatus.COMPLETED,
          createdAt: transactionDate,
          items: {
            create: selectedItems
          }
        }
      });
      totalGenerated++;
    }
  }

  console.log(`✅ Successfully generated ${totalGenerated} transactions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Starting transaction seeding...');
    const business = await prisma.business.findFirst({
        where: { name: 'Kedai Kita' },
    });
    if (!business) {
        throw new Error('Business "Kedai Kita" not found. Please run the main seed first.');
    }
    const cashier = await prisma.user.findFirst({
        where: {
            businessId: business.id,
            OR: [{ role: 'KASIR' }, { role: 'BUSINESS_OWNER' }]
        },
    });
    if (!cashier) {
        throw new Error('No user found for the business.');
    }
    const products = await prisma.product.findMany({
        where: { businessId: business.id },
    });
    if (products.length === 0) {
        throw new Error('No products found. Please run the main seed first.');
    }
    const paymentMethods = [
        client_1.PaymentMethod.CASH,
        client_1.PaymentMethod.CASH,
        client_1.PaymentMethod.CASH,
        client_1.PaymentMethod.QRIS,
        client_1.PaymentMethod.TRANSFER,
        client_1.PaymentMethod.CARD
    ];
    const today = new Date();
    const daysToGenerate = 30;
    let totalGenerated = 0;
    for (let i = daysToGenerate; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dailyCount = Math.floor(Math.random() * 21) + 10;
        console.log(`Generating ${dailyCount} transactions for ${date.toISOString().split('T')[0]}...`);
        for (let j = 0; j < dailyCount; j++) {
            const transactionDate = new Date(date);
            transactionDate.setHours(10 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
            const itemCount = Math.floor(Math.random() * 5) + 1;
            const selectedItems = [];
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
                    price: new client_1.Prisma.Decimal(price),
                    subtotal: new client_1.Prisma.Decimal(subtotal),
                    costPrice: new client_1.Prisma.Decimal(cost),
                });
            }
            const dateStr = transactionDate.toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = transactionDate.toTimeString().split(' ')[0].replace(/:/g, '');
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const transactionNumber = `TRX-${dateStr}-${timeStr}-${randomSuffix}`;
            const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const paymentAmount = totalAmount;
            await prisma.transaction.create({
                data: {
                    transactionNumber,
                    userId: cashier.id,
                    businessId: business.id,
                    totalAmount: new client_1.Prisma.Decimal(totalAmount),
                    paymentMethod: paymentMethod,
                    paymentAmount: new client_1.Prisma.Decimal(paymentAmount),
                    changeAmount: new client_1.Prisma.Decimal(0),
                    status: client_1.TransactionStatus.COMPLETED,
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
//# sourceMappingURL=seed-transactions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function seedTransactions() {
    console.log('🌱 Starting transaction seed...');
    const kasir = await prisma.user.findUnique({
        where: { email: 'kasir@pos.com' },
    });
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@pos.com' },
    });
    if (!kasir || !admin) {
        throw new Error('Users not found. Please run main seed first.');
    }
    const products = await prisma.product.findMany({
        take: 20,
        where: { status: 'AVAILABLE' },
    });
    if (products.length === 0) {
        throw new Error('No products found. Please run main seed first.');
    }
    console.log(`Found ${products.length} products to use in transactions`);
    const randomDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
        date.setHours(Math.floor(Math.random() * 12) + 8);
        date.setMinutes(Math.floor(Math.random() * 60));
        return date;
    };
    const getRandomItems = (count) => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    const paymentMethods = [
        client_1.PaymentMethod.CASH,
        client_1.PaymentMethod.CARD,
        client_1.PaymentMethod.E_WALLET,
        client_1.PaymentMethod.TRANSFER,
    ];
    const tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', null];
    console.log('Creating completed transactions...');
    for (let i = 0; i < 50; i++) {
        const itemCount = Math.floor(Math.random() * 4) + 1;
        const selectedProducts = getRandomItems(itemCount);
        const user = Math.random() > 0.5 ? kasir : admin;
        const createdAt = randomDate(30);
        let totalAmount = 0;
        const items = selectedProducts.map((product) => {
            const quantity = Math.floor(Math.random() * 3) + 1;
            const price = Number(product.price);
            const subtotal = price * quantity;
            totalAmount += subtotal;
            return {
                productId: product.id,
                productName: product.name,
                quantity,
                price,
                subtotal,
            };
        });
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const paymentAmount = totalAmount + Math.floor(Math.random() * 50000);
        const changeAmount = paymentAmount - totalAmount;
        const dateStr = createdAt.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = createdAt.getTime().toString().slice(-6);
        const transactionNumber = `TRX-${dateStr}-${timeStr}-${String(i + 1).padStart(4, '0')}`;
        await prisma.transaction.create({
            data: {
                transactionNumber,
                userId: user.id,
                tableNumber: tables[Math.floor(Math.random() * tables.length)],
                totalAmount,
                paymentMethod,
                paymentAmount,
                changeAmount,
                status: client_1.TransactionStatus.COMPLETED,
                createdAt,
                updatedAt: createdAt,
                items: {
                    create: items,
                },
            },
        });
        if ((i + 1) % 10 === 0) {
            console.log(`✅ Created ${i + 1} completed transactions`);
        }
    }
    console.log('Creating pending transactions...');
    for (let i = 0; i < 5; i++) {
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const selectedProducts = getRandomItems(itemCount);
        const user = kasir;
        const createdAt = new Date();
        let totalAmount = 0;
        const items = selectedProducts.map((product) => {
            const quantity = Math.floor(Math.random() * 2) + 1;
            const price = Number(product.price);
            const subtotal = price * quantity;
            totalAmount += subtotal;
            return {
                productId: product.id,
                productName: product.name,
                quantity,
                price,
                subtotal,
            };
        });
        const dateStr = createdAt.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = createdAt.getTime().toString().slice(-6);
        const transactionNumber = `TRX-${dateStr}-${timeStr}-PENDING-${String(i + 1).padStart(4, '0')}`;
        await prisma.transaction.create({
            data: {
                transactionNumber,
                userId: user.id,
                tableNumber: `Table ${i + 1}`,
                totalAmount,
                status: client_1.TransactionStatus.PENDING,
                createdAt,
                updatedAt: createdAt,
                items: {
                    create: items,
                },
            },
        });
    }
    console.log('✅ Created 5 pending transactions');
    const completedCount = await prisma.transaction.count({
        where: { status: client_1.TransactionStatus.COMPLETED },
    });
    const pendingCount = await prisma.transaction.count({
        where: { status: client_1.TransactionStatus.PENDING },
    });
    const totalRevenue = await prisma.transaction.aggregate({
        where: { status: client_1.TransactionStatus.COMPLETED },
        _sum: { totalAmount: true },
    });
    console.log('\n🎉 Transaction seed completed!');
    console.log('\n📊 Summary:');
    console.log(`- Completed Transactions: ${completedCount}`);
    console.log(`- Pending Transactions: ${pendingCount}`);
    console.log(`- Total Revenue: Rp ${Number(totalRevenue._sum.totalAmount || 0).toLocaleString()}`);
}
seedTransactions()
    .catch((e) => {
    console.error('❌ Error seeding transactions:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-transactions.js.map
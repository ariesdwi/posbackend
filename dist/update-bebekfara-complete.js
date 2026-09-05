"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false,
    },
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const NEW_MENU = [
    {
        category: "🦆 Bebek Jumbo",
        items: [
            { name: "Nasi Bebek Rempah Jumbo", price: 35000 },
            { name: "Nasi Bebek Bumbu Hitam Jumbo", price: 37000 },
            { name: "Bebek 1 Ekor", price: 175000 },
        ],
    },
    {
        category: "🦆 Bebek Kecil",
        items: [
            { name: "Nasi Bebek Rempah Kecil", price: 23000 },
            { name: "Nasi Bebek Bumbu Hitam Kecil", price: 25000 },
            { name: "Nasi Bebek Rica Rica Kecil", price: 27000 },
        ],
    },
    {
        category: "🍗 Ayam",
        items: [
            { name: "Nasi Ayam Rempah", price: 25000 },
            { name: "Nasi Ayam Bumbu Hitam", price: 27000 },
        ],
    },
    {
        category: "🫀 Ati Ampela",
        items: [
            { name: "Ati Ampela", price: 8000 },
            { name: "Nasi Ati Ampela", price: 17000 },
        ],
    },
    {
        category: "🍽️ Paket Tanpa Nasi",
        items: [
            { name: "Bebek Rempah Jumbo", price: 32000 },
            { name: "Bebek Bumbu Hitam Jumbo", price: 34000 },
            { name: "Bebek Rica Rica", price: 24000 },
            { name: "Ayam Rempah", price: 20000 },
            { name: "Ayam Bumbu Hitam", price: 22000 },
        ],
    },
    {
        category: "➕ Tambahan",
        items: [
            { name: "Nasi", price: 5000 },
            { name: "Sambal Bajak", price: 2000 },
            { name: "Lalapan", price: 1000 },
            { name: "Bumbu Hitam", price: 3000 },
            { name: "Tempe Goreng", price: 2000 },
            { name: "Tahu Goreng", price: 2000 },
            { name: "Leher Bebek", price: 5000 },
        ],
    },
];
async function updateBebekFaraMenu() {
    console.log('🦆 Updating Bebek Fara menu...\n');
    try {
        const business = await prisma.business.findFirst({
            where: { name: 'Bebek Fara' },
        });
        if (!business) {
            console.log('❌ Business Bebek Fara tidak ditemukan!');
            return;
        }
        console.log(`✅ Found business: ${business.name} (ID: ${business.id})\n`);
        console.log('🗑️  Deleting old products...');
        const deletedProducts = await prisma.product.deleteMany({
            where: { businessId: business.id },
        });
        console.log(`   Deleted ${deletedProducts.count} products\n`);
        console.log('🗑️  Deleting old categories...');
        const deletedCategories = await prisma.category.deleteMany({
            where: { businessId: business.id },
        });
        console.log(`   Deleted ${deletedCategories.count} categories\n`);
        console.log('📦 Creating new categories and products...\n');
        let totalProducts = 0;
        for (const menu of NEW_MENU) {
            const category = await prisma.category.create({
                data: {
                    name: menu.category,
                    businessId: business.id,
                },
            });
            console.log(`📂 ${menu.category}`);
            console.log('   ' + '-'.repeat(70));
            for (const item of menu.items) {
                const costPrice = Math.round(item.price * 0.7);
                await prisma.product.create({
                    data: {
                        name: item.name,
                        price: item.price,
                        costPrice: costPrice,
                        stock: 100,
                        status: client_1.ProductStatus.AVAILABLE,
                        categoryId: category.id,
                        businessId: business.id,
                    },
                });
                console.log(`   ✅ ${item.name.padEnd(40)} Rp${item.price.toLocaleString('id-ID')}`);
                totalProducts++;
            }
            console.log('');
        }
        console.log('='.repeat(70));
        console.log(`✅ Menu update complete!`);
        console.log(`   - Total categories: ${NEW_MENU.length}`);
        console.log(`   - Total products: ${totalProducts}\n`);
        console.log(`🔑 Login at: admin@bebekfara.com / admin123\n`);
    }
    catch (error) {
        console.error('❌ Error updating menu:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
updateBebekFaraMenu();
//# sourceMappingURL=update-bebekfara-complete.js.map
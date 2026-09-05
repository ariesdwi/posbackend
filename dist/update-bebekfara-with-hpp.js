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
const NEW_MENU_WITH_HPP = [
    {
        category: "🦆 Bebek Jumbo",
        items: [
            { name: "Nasi Bebek Rempah Jumbo", price: 35000, hpp: 25962 },
            { name: "Nasi Bebek Bumbu Hitam Jumbo", price: 37000, hpp: 26962 },
            { name: "Bebek 1 Ekor", price: 175000, hpp: 124185 },
        ],
    },
    {
        category: "🦆 Bebek Kecil",
        items: [
            { name: "Nasi Bebek Rempah Kecil", price: 23000, hpp: 18837 },
            { name: "Nasi Bebek Bumbu Hitam Kecil", price: 25000, hpp: 19837 },
            { name: "Nasi Bebek Rica Rica Kecil", price: 27000, hpp: 20837 },
        ],
    },
    {
        category: "🍗 Ayam",
        items: [
            { name: "Nasi Ayam Rempah", price: 25000, hpp: 17462 },
            { name: "Nasi Ayam Bumbu Hitam", price: 27000, hpp: 18462 },
        ],
    },
    {
        category: "🫀 Ati Ampela",
        items: [
            { name: "Ati Ampela", price: 8000, hpp: 3000 },
            { name: "Nasi Ati Ampela", price: 17000, hpp: 8370 },
        ],
    },
    {
        category: "🍽️ Paket Tanpa Nasi",
        items: [
            { name: "Bebek Rempah Jumbo", price: 32000, hpp: 24837 },
            { name: "Bebek Bumbu Hitam Jumbo", price: 34000, hpp: 25837 },
            { name: "Bebek Rica Rica", price: 24000, hpp: 19837 },
            { name: "Ayam Rempah", price: 20000, hpp: 16337 },
            { name: "Ayam Bumbu Hitam", price: 22000, hpp: 17337 },
        ],
    },
    {
        category: "➕ Tambahan",
        items: [
            { name: "Nasi", price: 5000, hpp: 1125 },
            { name: "Sambal Bajak", price: 2000, hpp: 1000 },
            { name: "Lalapan", price: 1000, hpp: 500 },
            { name: "Bumbu Hitam", price: 3000, hpp: 1000 },
            { name: "Tempe Goreng", price: 2000, hpp: 750 },
            { name: "Tahu Goreng", price: 2000, hpp: 750 },
            { name: "Leher Bebek", price: 5000, hpp: 1500 },
        ],
    },
];
async function updateBebekFaraMenuWithHPP() {
    console.log('🦆 Updating Bebek Fara menu with accurate HPP...\n');
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
        console.log('📦 Creating new categories and products with HPP...\n');
        let totalProducts = 0;
        let totalRevenuePotential = 0;
        let totalCost = 0;
        for (const menu of NEW_MENU_WITH_HPP) {
            const category = await prisma.category.create({
                data: {
                    name: menu.category,
                    businessId: business.id,
                },
            });
            console.log(`📂 ${menu.category}`);
            console.log('   ' + '-'.repeat(80));
            console.log('   Product                              | Price      | HPP        | Margin');
            console.log('   ' + '-'.repeat(80));
            for (const item of menu.items) {
                await prisma.product.create({
                    data: {
                        name: item.name,
                        price: item.price,
                        costPrice: item.hpp,
                        stock: 100,
                        status: client_1.ProductStatus.AVAILABLE,
                        categoryId: category.id,
                        businessId: business.id,
                    },
                });
                const margin = item.price - item.hpp;
                const marginPercent = ((margin / item.price) * 100).toFixed(1);
                const nameCol = item.name.padEnd(36);
                const priceCol = `Rp${item.price.toLocaleString('id-ID')}`.padStart(10);
                const hppCol = `Rp${item.hpp.toLocaleString('id-ID')}`.padStart(10);
                const marginCol = `${marginPercent}%`;
                console.log(`   ${nameCol} | ${priceCol} | ${hppCol} | ${marginCol}`);
                totalProducts++;
                totalRevenuePotential += item.price;
                totalCost += item.hpp;
            }
            console.log('');
        }
        const overallMargin = totalRevenuePotential - totalCost;
        const overallMarginPercent = ((overallMargin / totalRevenuePotential) * 100).toFixed(1);
        console.log('='.repeat(80));
        console.log(`✅ Menu update complete!`);
        console.log(`   - Total categories: ${NEW_MENU_WITH_HPP.length}`);
        console.log(`   - Total products: ${totalProducts}`);
        console.log(`   - Total potential revenue: Rp${totalRevenuePotential.toLocaleString('id-ID')}`);
        console.log(`   - Total cost (HPP): Rp${totalCost.toLocaleString('id-ID')}`);
        console.log(`   - Overall margin: ${overallMarginPercent}% (Rp${overallMargin.toLocaleString('id-ID')})\n`);
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
updateBebekFaraMenuWithHPP();
//# sourceMappingURL=update-bebekfara-with-hpp.js.map
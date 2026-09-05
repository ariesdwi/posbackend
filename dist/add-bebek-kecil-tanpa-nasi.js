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
async function addBebekKecilTanpaNasi() {
    console.log('🦆 Adding "Bebek Kecil Tanpa Nasi" to Bebek Fara...\n');
    try {
        const business = await prisma.business.findFirst({
            where: { name: 'Bebek Fara' },
        });
        if (!business) {
            console.log('❌ Business Bebek Fara tidak ditemukan!');
            return;
        }
        console.log(`✅ Found business: ${business.name}\n`);
        const category = await prisma.category.findFirst({
            where: {
                name: '🍽️ Paket Tanpa Nasi',
                businessId: business.id,
            },
        });
        if (!category) {
            console.log('❌ Category "🍽️ Paket Tanpa Nasi" tidak ditemukan!');
            return;
        }
        console.log(`✅ Found category: ${category.name}\n`);
        const existing = await prisma.product.findFirst({
            where: {
                name: 'Bebek Kecil Tanpa Nasi',
                businessId: business.id,
            },
        });
        if (existing) {
            console.log('⚠️  Product "Bebek Kecil Tanpa Nasi" already exists!\n');
            console.log(`   Current price: Rp${Number(existing.price).toLocaleString('id-ID')}`);
            console.log(`   Current HPP: Rp${Number(existing.costPrice).toLocaleString('id-ID')}\n`);
            return;
        }
        const price = 20000;
        const hpp = 16337;
        const newProduct = await prisma.product.create({
            data: {
                name: 'Bebek Kecil Tanpa Nasi',
                price: price,
                costPrice: hpp,
                stock: 100,
                status: client_1.ProductStatus.AVAILABLE,
                categoryId: category.id,
                businessId: business.id,
            },
        });
        const margin = price - hpp;
        const marginPercent = ((margin / price) * 100).toFixed(1);
        console.log('✅ Product added successfully!\n');
        console.log('   ' + '-'.repeat(70));
        console.log('   Product Details:');
        console.log('   ' + '-'.repeat(70));
        console.log(`   Name         : ${newProduct.name}`);
        console.log(`   Price        : Rp${price.toLocaleString('id-ID')}`);
        console.log(`   HPP          : Rp${hpp.toLocaleString('id-ID')}`);
        console.log(`   Margin       : ${marginPercent}% (Rp${margin.toLocaleString('id-ID')})`);
        console.log(`   Stock        : ${newProduct.stock} units`);
        console.log(`   Category     : ${category.name}`);
        console.log('   ' + '-'.repeat(70) + '\n');
        const allProducts = await prisma.product.findMany({
            where: { categoryId: category.id },
            orderBy: { name: 'asc' },
        });
        console.log(`📋 All products in "${category.name}":\n`);
        allProducts.forEach((prod, idx) => {
            const prodMargin = Number(prod.price) - Number(prod.costPrice);
            const prodMarginPercent = ((prodMargin / Number(prod.price)) * 100).toFixed(1);
            console.log(`   ${idx + 1}. ${prod.name.padEnd(30)} Rp${Number(prod.price).toLocaleString('id-ID').padStart(8)} (margin: ${prodMarginPercent}%)`);
        });
        console.log(`\n   Total: ${allProducts.length} products in this category\n`);
    }
    catch (error) {
        console.error('❌ Error adding product:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
addBebekKecilTanpaNasi();
//# sourceMappingURL=add-bebek-kecil-tanpa-nasi.js.map
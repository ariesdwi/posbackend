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
async function main() {
    console.log('🔄 Copying products from Bebek Fara to Bebek Fara Kalibata...\n');
    const sourceBusiness = await prisma.business.findFirst({
        where: { name: { contains: 'Bebek Fara', mode: 'insensitive' } },
        include: {
            products: {
                include: {
                    category: true,
                },
            },
        },
    });
    if (!sourceBusiness) {
        console.error('❌ Source business "Bebek Fara" not found!');
        return;
    }
    console.log(`✅ Found source business: ${sourceBusiness.name}`);
    console.log(`   - Business ID: ${sourceBusiness.id}`);
    console.log(`   - Products: ${sourceBusiness.products.length}`);
    console.log('');
    const targetBusiness = await prisma.business.findFirst({
        where: { name: { contains: 'Kalibata', mode: 'insensitive' } },
    });
    if (!targetBusiness) {
        console.error('❌ Target business "Bebek Fara Kalibata" not found!');
        return;
    }
    console.log(`✅ Found target business: ${targetBusiness.name}`);
    console.log(`   - Business ID: ${targetBusiness.id}`);
    console.log('');
    const existingCategories = await prisma.category.findMany({
        where: { businessId: targetBusiness.id },
    });
    console.log(`📂 Existing categories in target: ${existingCategories.length}`);
    console.log('');
    const categoryMap = new Map();
    const sourceCategories = await prisma.category.findMany({
        where: { businessId: sourceBusiness.id },
    });
    console.log('📂 Creating category mapping...');
    for (const sourceCat of sourceCategories) {
        let targetCat = existingCategories.find((c) => c.name.toLowerCase() === sourceCat.name.toLowerCase());
        if (!targetCat) {
            targetCat = await prisma.category.create({
                data: {
                    name: sourceCat.name,
                    description: sourceCat.description,
                    businessId: targetBusiness.id,
                },
            });
            console.log(`   ✅ Created category: ${targetCat.name}`);
        }
        else {
            console.log(`   ↪️  Using existing category: ${targetCat.name}`);
        }
        categoryMap.set(sourceCat.id, targetCat.id);
    }
    console.log('');
    const existingProducts = await prisma.product.findMany({
        where: { businessId: targetBusiness.id },
        select: { name: true },
    });
    const existingProductNames = new Set(existingProducts.map((p) => p.name.toLowerCase()));
    console.log('📦 Copying products...');
    let copiedCount = 0;
    let skippedCount = 0;
    for (const product of sourceBusiness.products) {
        if (existingProductNames.has(product.name.toLowerCase())) {
            console.log(`   ⏭️  Skipped (exists): ${product.name}`);
            skippedCount++;
            continue;
        }
        const targetCategoryId = categoryMap.get(product.categoryId);
        if (!targetCategoryId) {
            console.log(`   ⚠️  Skipped (no category): ${product.name}`);
            skippedCount++;
            continue;
        }
        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                costPrice: product.costPrice,
                stock: product.stock,
                imageUrl: product.imageUrl,
                status: product.status,
                categoryId: targetCategoryId,
                businessId: targetBusiness.id,
            },
        });
        console.log(`   ✅ Copied: ${product.name} (Rp ${product.price})`);
        copiedCount++;
    }
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ COPY COMPLETE!');
    console.log(`   - Total products in source: ${sourceBusiness.products.length}`);
    console.log(`   - Copied: ${copiedCount}`);
    console.log(`   - Skipped (duplicates): ${skippedCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
main()
    .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=copy-products-to-kalibata.js.map
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
    }
    else {
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
//# sourceMappingURL=fix_urls.js.map
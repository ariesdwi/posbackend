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
    const products = await prisma.product.findMany({
        where: {
            imageUrl: null,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
    });
    console.log('Products without images:');
    products.forEach(p => {
        console.log(`${p.name} (ID: ${p.id}) - Created At: ${p.createdAt.toISOString()}`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=find_orphaned_products.js.map
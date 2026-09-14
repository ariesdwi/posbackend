"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    max: 5,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const businessId = 'cmkc7lejr00004yktqn5kj064';
    const shift = await prisma.shift.findFirst({
        where: {
            businessId,
            status: 'OPEN',
        },
        orderBy: {
            startTime: 'desc',
        },
    });
    if (!shift) {
        console.log('❌ No open shift found');
        return;
    }
    console.log(`Found open shift: ${shift.id}`);
    const result = await prisma.transaction.updateMany({
        where: {
            businessId,
            status: 'COMPLETED',
            shiftId: null,
        },
        data: {
            shiftId: shift.id,
        },
    });
    console.log(`✅ Linked ${result.count} transactions to shift ${shift.id}`);
    await pool.end();
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=link-transactions-to-shift.js.map
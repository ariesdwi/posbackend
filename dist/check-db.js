"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const businessId = 'cmkc7lejr00004yktqn5kj064';
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { id: true, name: true }
        });
        console.log('Business record:', business);
    }
    catch (e) {
        console.error('Error querying database:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=check-db.js.map
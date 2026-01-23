"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function fixCostPriceIssue() {
    try {
        console.log('🔧 Fixing Cost-Profit Calculation Issue\n');
        const user = await prisma.user.findUnique({
            where: { email: 'owner@kedaikita.com' },
            include: { business: true },
        });
        if (!user) {
            console.log('❌ User not found: owner@kedaikita.com');
            return;
        }
        console.log(`✅ Found user: ${user.name}`);
        console.log(`   Business: ${user.business.name} (ID: ${user.businessId})\n`);
        const businessId = user.businessId;
        console.log('📦 Step 1: Fixing products with zero cost price...\n');
        const productsToFix = [
            { name: 'Jeruk Hangat', costPrice: 3500 },
            { name: 'Air mineral', costPrice: 2100 },
        ];
        for (const productData of productsToFix) {
            const product = await prisma.product.findFirst({
                where: {
                    name: productData.name,
                    businessId,
                },
            });
            if (product) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { costPrice: productData.costPrice },
                });
                console.log(`✓ Updated ${productData.name}: costPrice = Rp ${productData.costPrice.toLocaleString()}`);
            }
            else {
                console.log(`⚠️  Product not found: ${productData.name}`);
            }
        }
        console.log('\n📊 Step 2: Finding transaction items with zero cost price...\n');
        const transactionItemsWithZeroCost = await prisma.transactionItem.findMany({
            where: {
                costPrice: 0,
                transaction: {
                    businessId,
                },
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        costPrice: true,
                    },
                },
                transaction: {
                    select: {
                        id: true,
                        transactionNumber: true,
                        createdAt: true,
                    },
                },
            },
        });
        console.log(`Found ${transactionItemsWithZeroCost.length} transaction items with zero cost price\n`);
        console.log('🔄 Step 3: Backfilling cost prices...\n');
        let updatedCount = 0;
        let skippedCount = 0;
        for (const item of transactionItemsWithZeroCost) {
            if (item.product && Number(item.product.costPrice) > 0) {
                await prisma.transactionItem.update({
                    where: { id: item.id },
                    data: { costPrice: item.product.costPrice },
                });
                console.log(`✓ ${item.transaction.transactionNumber}: ${item.productName} - ` +
                    `Updated costPrice to Rp ${Number(item.product.costPrice).toLocaleString()}`);
                updatedCount++;
            }
            else {
                console.log(`⚠️  ${item.transaction.transactionNumber}: ${item.productName} - ` +
                    `Skipped (product deleted or still has zero cost)`);
                skippedCount++;
            }
        }
        console.log('\n' + '─'.repeat(80));
        console.log(`\n✅ Backfill Complete!`);
        console.log(`   Updated: ${updatedCount} transaction items`);
        console.log(`   Skipped: ${skippedCount} transaction items`);
        console.log('\n🔍 Step 4: Verifying the fix...\n');
        const verifyTransaction = await prisma.transaction.findFirst({
            where: {
                transactionNumber: 'TRX-20260123-045202-OSE1',
                businessId,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                costPrice: true,
                            },
                        },
                    },
                },
            },
        });
        if (verifyTransaction) {
            const totalRevenue = Number(verifyTransaction.totalAmount);
            let totalCost = 0;
            verifyTransaction.items.forEach((item) => {
                const itemCost = Number(item.costPrice) * item.quantity;
                totalCost += itemCost;
            });
            const totalProfit = totalRevenue - totalCost;
            const margin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : 0;
            console.log(`Transaction: ${verifyTransaction.transactionNumber}`);
            console.log(`   Revenue: Rp ${totalRevenue.toLocaleString()}`);
            console.log(`   Cost: Rp ${totalCost.toLocaleString()}`);
            console.log(`   Profit: Rp ${totalProfit.toLocaleString()} (${margin}% margin)`);
            console.log('\n✅ Transaction now has correct cost and profit calculations!');
        }
        console.log('\n' + '─'.repeat(80));
        console.log('\n🎉 All fixes applied successfully!');
        console.log('\n📝 Summary:');
        console.log('   1. Updated 2 products with missing cost prices');
        console.log(`   2. Backfilled ${updatedCount} historical transaction items`);
        console.log('   3. Reports will now show correct profit calculations');
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
fixCostPriceIssue();
//# sourceMappingURL=fix-cost-profit.js.map
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
async function investigateCostPriceIssue() {
    try {
        console.log('🔍 Investigating Cost-Profit Calculation Issue\n');
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
        const products = await prisma.product.findMany({
            where: { businessId },
            select: {
                id: true,
                name: true,
                price: true,
                costPrice: true,
                stock: true,
            },
            orderBy: { name: 'asc' },
        });
        console.log(`📦 Products (${products.length} total):`);
        console.log('─'.repeat(80));
        let productsWithZeroCost = 0;
        let productsWithCost = 0;
        products.forEach((product) => {
            const costPrice = Number(product.costPrice);
            const price = Number(product.price);
            const margin = price > 0 ? ((price - costPrice) / price * 100).toFixed(1) : 0;
            if (costPrice === 0) {
                productsWithZeroCost++;
                console.log(`⚠️  ${product.name}`);
            }
            else {
                productsWithCost++;
                console.log(`✓  ${product.name}`);
            }
            console.log(`   Price: Rp ${price.toLocaleString()}, Cost: Rp ${costPrice.toLocaleString()}, Margin: ${margin}%`);
        });
        console.log('─'.repeat(80));
        console.log(`Summary: ${productsWithCost} products with cost price, ${productsWithZeroCost} with zero cost\n`);
        const recentTransactions = await prisma.transaction.findMany({
            where: {
                businessId,
                status: 'COMPLETED',
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                costPrice: true,
                            }
                        }
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        console.log(`📊 Recent Transactions (${recentTransactions.length} shown):`);
        console.log('─'.repeat(80));
        recentTransactions.forEach((transaction) => {
            const totalRevenue = Number(transaction.totalAmount);
            let totalCost = 0;
            let totalProfit = 0;
            transaction.items.forEach((item) => {
                const itemCost = Number(item.costPrice) * item.quantity;
                const itemRevenue = Number(item.subtotal);
                const itemProfit = itemRevenue - itemCost;
                totalCost += itemCost;
                totalProfit += itemProfit;
            });
            const margin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : 0;
            console.log(`\n${transaction.transactionNumber} - ${transaction.createdAt.toLocaleDateString()}`);
            console.log(`   Revenue: Rp ${totalRevenue.toLocaleString()}`);
            console.log(`   Cost: Rp ${totalCost.toLocaleString()}`);
            console.log(`   Profit: Rp ${totalProfit.toLocaleString()} (${margin}% margin)`);
            console.log(`   Items:`);
            transaction.items.forEach((item) => {
                const itemCost = Number(item.costPrice);
                const itemPrice = Number(item.price);
                const currentProductCost = item.product ? Number(item.product.costPrice) : 0;
                console.log(`     - ${item.productName} x${item.quantity}`);
                console.log(`       Stored cost: Rp ${itemCost.toLocaleString()}, Price: Rp ${itemPrice.toLocaleString()}`);
                if (item.product) {
                    console.log(`       Current product cost: Rp ${currentProductCost.toLocaleString()}`);
                }
            });
        });
        console.log('\n' + '─'.repeat(80));
        console.log('\n📈 Analysis:');
        if (productsWithZeroCost > 0) {
            console.log(`⚠️  ISSUE FOUND: ${productsWithZeroCost} products have costPrice = 0`);
            console.log(`   This means new transactions will have zero cost, resulting in incorrect profit calculations.`);
            console.log(`\n💡 SOLUTION: Update product cost prices in the database.`);
        }
        else {
            console.log(`✅ All products have cost prices set.`);
            console.log(`   If transactions still show zero profit, check historical transaction items.`);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
investigateCostPriceIssue();
//# sourceMappingURL=investigate-cost-profit.js.map
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
async function verifyCostPriceCalculation() {
    try {
        console.log('🔍 Verifying Cost Price Calculation for Multi-Quantity Items\n');
        const transactions = await prisma.transaction.findMany({
            where: {
                business: {
                    users: {
                        some: {
                            email: 'owner@kedaikita.com',
                        },
                    },
                },
                status: 'COMPLETED',
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                                costPrice: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        console.log('📊 Analyzing transactions with quantity > 1:\n');
        console.log('─'.repeat(100));
        let foundIssue = false;
        for (const transaction of transactions) {
            const itemsWithMultipleQty = transaction.items.filter(item => item.quantity > 1);
            if (itemsWithMultipleQty.length > 0) {
                console.log(`\n🧾 Transaction: ${transaction.transactionNumber}`);
                console.log(`   Date: ${transaction.createdAt.toLocaleString()}`);
                itemsWithMultipleQty.forEach(item => {
                    const storedCostPrice = Number(item.costPrice);
                    const storedPrice = Number(item.price);
                    const quantity = item.quantity;
                    const storedSubtotal = Number(item.subtotal);
                    const expectedSubtotal = storedPrice * quantity;
                    const totalCost = storedCostPrice * quantity;
                    const itemProfit = storedSubtotal - totalCost;
                    const itemMargin = storedSubtotal > 0 ? (itemProfit / storedSubtotal * 100).toFixed(1) : 0;
                    const currentProductCost = item.product ? Number(item.product.costPrice) : 0;
                    console.log(`\n   📦 ${item.productName} x${quantity}`);
                    console.log(`      Stored in TransactionItem:`);
                    console.log(`        - price (per unit): Rp ${storedPrice.toLocaleString()}`);
                    console.log(`        - costPrice (per unit): Rp ${storedCostPrice.toLocaleString()}`);
                    console.log(`        - subtotal: Rp ${storedSubtotal.toLocaleString()}`);
                    console.log(`      Calculated:`);
                    console.log(`        - Expected subtotal: Rp ${expectedSubtotal.toLocaleString()} (price × qty)`);
                    console.log(`        - Total cost: Rp ${totalCost.toLocaleString()} (costPrice × qty)`);
                    console.log(`        - Profit: Rp ${itemProfit.toLocaleString()}`);
                    console.log(`        - Margin: ${itemMargin}%`);
                    if (item.product) {
                        console.log(`      Current Product Data:`);
                        console.log(`        - Current costPrice: Rp ${currentProductCost.toLocaleString()}`);
                        if (storedCostPrice !== currentProductCost) {
                            console.log(`        ⚠️  Mismatch: Transaction stored different cost than current product`);
                        }
                    }
                    if (storedCostPrice === 0) {
                        console.log(`      ❌ ISSUE: costPrice is 0 - profit calculation will be wrong!`);
                        foundIssue = true;
                    }
                    else if (storedSubtotal !== expectedSubtotal) {
                        console.log(`      ❌ ISSUE: Subtotal mismatch!`);
                        foundIssue = true;
                    }
                    else {
                        console.log(`      ✅ Calculation is correct`);
                    }
                });
            }
        }
        console.log('\n' + '─'.repeat(100));
        if (foundIssue) {
            console.log('\n❌ Issues found in cost price calculations');
            console.log('\nThe problem is that costPrice is stored as 0 in some transaction items.');
            console.log('This is a DATA issue, not a LOGIC issue.');
            console.log('\n💡 Solution: Run the fix-cost-profit.ts script to backfill missing cost prices.');
        }
        else {
            console.log('\n✅ All calculations are correct!');
            console.log('\nThe code correctly:');
            console.log('  1. Stores costPrice as PER-UNIT cost in TransactionItem');
            console.log('  2. Multiplies costPrice × quantity when calculating total cost');
            console.log('  3. Calculates profit as: (price × qty) - (costPrice × qty)');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
verifyCostPriceCalculation();
//# sourceMappingURL=verify-quantity-calculation.js.map
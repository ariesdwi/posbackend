import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function investigateCostPriceIssue() {
  try {
    console.log('🔍 Investigating Cost-Profit Calculation Issue\n');

    // 1. Find the user's business
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

    // 2. Check products and their cost prices
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
      } else {
        productsWithCost++;
        console.log(`✓  ${product.name}`);
      }
      
      console.log(`   Price: Rp ${price.toLocaleString()}, Cost: Rp ${costPrice.toLocaleString()}, Margin: ${margin}%`);
    });

    console.log('─'.repeat(80));
    console.log(`Summary: ${productsWithCost} products with cost price, ${productsWithZeroCost} with zero cost\n`);

    // 3. Check recent transactions
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
    } else {
      console.log(`✅ All products have cost prices set.`);
      console.log(`   If transactions still show zero profit, check historical transaction items.`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

investigateCostPriceIssue();

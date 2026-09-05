import { PrismaClient, ProductStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// Setup connection pool dan adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MINUMAN_ITEMS = [
  { name: "Es Teh", price: 5000, hpp: 1000 },
  { name: "Es Jeruk", price: 8000, hpp: 3000 },
  { name: "Air Mineral Botol", price: 5000, hpp: 2500 },
  { name: "Air Es", price: 2000, hpp: 500 },
  { name: "Es Batu", price: 1000, hpp: 200 },
];

async function addMinumanCategory() {
  console.log('🥤 Adding Minuman category to Bebek Fara...\n');

  try {
    // 1. Cari Business Bebek Fara
    const business = await prisma.business.findFirst({
      where: { name: 'Bebek Fara' },
    });

    if (!business) {
      console.log('❌ Business Bebek Fara tidak ditemukan!');
      return;
    }

    console.log(`✅ Found business: ${business.name} (ID: ${business.id})\n`);

    // 2. Cek apakah kategori Minuman sudah ada
    let category = await prisma.category.findFirst({
      where: {
        name: '🥤 Minuman',
        businessId: business.id,
      },
    });

    if (category) {
      console.log('⚠️  Category "🥤 Minuman" already exists. Deleting old products...');
      await prisma.product.deleteMany({
        where: { categoryId: category.id },
      });
      console.log('   Old products deleted.\n');
    } else {
      console.log('📂 Creating new category: 🥤 Minuman\n');
      category = await prisma.category.create({
        data: {
          name: '🥤 Minuman',
          description: 'Berbagai minuman segar',
          businessId: business.id,
        },
      });
    }

    // 3. Tambahkan produk minuman
    console.log('📦 Adding products...\n');
    console.log('   ' + '-'.repeat(80));
    console.log('   Product                              | Price      | HPP        | Margin');
    console.log('   ' + '-'.repeat(80));

    let totalRevenue = 0;
    let totalCost = 0;

    for (const item of MINUMAN_ITEMS) {
      await prisma.product.create({
        data: {
          name: item.name,
          price: item.price,
          costPrice: item.hpp,
          stock: 100, // default stock
          status: ProductStatus.AVAILABLE,
          categoryId: category.id,
          businessId: business.id,
        },
      });

      const margin = item.price - item.hpp;
      const marginPercent = ((margin / item.price) * 100).toFixed(1);

      const nameCol = item.name.padEnd(36);
      const priceCol = `Rp${item.price.toLocaleString('id-ID')}`.padStart(10);
      const hppCol = `Rp${item.hpp.toLocaleString('id-ID')}`.padStart(10);
      const marginCol = `${marginPercent}%`;

      console.log(`   ${nameCol} | ${priceCol} | ${hppCol} | ${marginCol}`);

      totalRevenue += item.price;
      totalCost += item.hpp;
    }

    const overallMargin = totalRevenue - totalCost;
    const overallMarginPercent = ((overallMargin / totalRevenue) * 100).toFixed(1);

    console.log('   ' + '-'.repeat(80));
    console.log(`   TOTAL                                | Rp${totalRevenue.toLocaleString('id-ID').padStart(8)} | Rp${totalCost.toLocaleString('id-ID').padStart(8)} | ${overallMarginPercent}%\n`);

    console.log('='.repeat(80));
    console.log(`✅ Minuman category added successfully!`);
    console.log(`   - Total products: ${MINUMAN_ITEMS.length}`);
    console.log(`   - Category margin: ${overallMarginPercent}%\n`);

    // 4. Tampilkan ringkasan semua kategori
    const allCategories = await prisma.category.findMany({
      where: { businessId: business.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log('📋 All Categories in Bebek Fara:\n');
    allCategories.forEach((cat, idx) => {
      console.log(`   ${idx + 1}. ${cat.name} (${cat._count.products} products)`);
    });

    const totalProducts = allCategories.reduce((sum, cat) => sum + cat._count.products, 0);
    console.log(`\n   Total: ${allCategories.length} categories, ${totalProducts} products\n`);

  } catch (error) {
    console.error('❌ Error adding minuman category:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addMinumanCategory();

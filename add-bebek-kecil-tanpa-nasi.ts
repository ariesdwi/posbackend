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

async function addBebekKecilTanpaNasi() {
  console.log('🦆 Adding "Bebek Kecil Tanpa Nasi" to Bebek Fara...\n');

  try {
    // 1. Cari Business Bebek Fara
    const business = await prisma.business.findFirst({
      where: { name: 'Bebek Fara' },
    });

    if (!business) {
      console.log('❌ Business Bebek Fara tidak ditemukan!');
      return;
    }

    console.log(`✅ Found business: ${business.name}\n`);

    // 2. Cari kategori "Paket Tanpa Nasi"
    const category = await prisma.category.findFirst({
      where: {
        name: '🍽️ Paket Tanpa Nasi',
        businessId: business.id,
      },
    });

    if (!category) {
      console.log('❌ Category "🍽️ Paket Tanpa Nasi" tidak ditemukan!');
      return;
    }

    console.log(`✅ Found category: ${category.name}\n`);

    // 3. Cek apakah produk sudah ada
    const existing = await prisma.product.findFirst({
      where: {
        name: 'Bebek Kecil Tanpa Nasi',
        businessId: business.id,
      },
    });

    if (existing) {
      console.log('⚠️  Product "Bebek Kecil Tanpa Nasi" already exists!\n');
      console.log(`   Current price: Rp${Number(existing.price).toLocaleString('id-ID')}`);
      console.log(`   Current HPP: Rp${Number(existing.costPrice).toLocaleString('id-ID')}\n`);
      return;
    }

    // 4. Hitung HPP (asumsi margin ~20% seperti produk bebek tanpa nasi lainnya)
    const price = 20000;
    const hpp = 16337; // margin ~18.3%, konsisten dengan produk bebek lainnya

    // 5. Tambahkan produk
    const newProduct = await prisma.product.create({
      data: {
        name: 'Bebek Kecil Tanpa Nasi',
        price: price,
        costPrice: hpp,
        stock: 100,
        status: ProductStatus.AVAILABLE,
        categoryId: category.id,
        businessId: business.id,
      },
    });

    const margin = price - hpp;
    const marginPercent = ((margin / price) * 100).toFixed(1);

    console.log('✅ Product added successfully!\n');
    console.log('   ' + '-'.repeat(70));
    console.log('   Product Details:');
    console.log('   ' + '-'.repeat(70));
    console.log(`   Name         : ${newProduct.name}`);
    console.log(`   Price        : Rp${price.toLocaleString('id-ID')}`);
    console.log(`   HPP          : Rp${hpp.toLocaleString('id-ID')}`);
    console.log(`   Margin       : ${marginPercent}% (Rp${margin.toLocaleString('id-ID')})`);
    console.log(`   Stock        : ${newProduct.stock} units`);
    console.log(`   Category     : ${category.name}`);
    console.log('   ' + '-'.repeat(70) + '\n');

    // 6. Tampilkan semua produk di kategori "Paket Tanpa Nasi"
    const allProducts = await prisma.product.findMany({
      where: { categoryId: category.id },
      orderBy: { name: 'asc' },
    });

    console.log(`📋 All products in "${category.name}":\n`);
    allProducts.forEach((prod, idx) => {
      const prodMargin = Number(prod.price) - Number(prod.costPrice);
      const prodMarginPercent = ((prodMargin / Number(prod.price)) * 100).toFixed(1);
      console.log(`   ${idx + 1}. ${prod.name.padEnd(30)} Rp${Number(prod.price).toLocaleString('id-ID').padStart(8)} (margin: ${prodMarginPercent}%)`);
    });

    console.log(`\n   Total: ${allProducts.length} products in this category\n`);

  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addBebekKecilTanpaNasi();

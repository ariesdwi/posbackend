require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getBebekFaraMenu() {
  try {
    // Cari business Bebek Fara
    const business = await prisma.business.findFirst({
      where: { name: 'Bebek Fara' },
    });
    
    if (!business) {
      console.log('❌ Business Bebek Fara tidak ditemukan');
      return;
    }
    
    // Ambil semua kategori dan produk
    const categories = await prisma.category.findMany({
      where: { businessId: business.id },
      include: {
        products: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    console.log('\n🦆 DAFTAR MENU BEBEK FARA\n');
    console.log('='.repeat(80));
    
    categories.forEach(cat => {
      console.log(`\n${cat.name}`);
      console.log('-'.repeat(80));
      console.log('No | Nama Produk                          | Harga      | Cost Price | Stock');
      console.log('-'.repeat(80));
      
      cat.products.forEach((prod, idx) => {
        const no = String(idx + 1).padStart(2);
        const name = prod.name.padEnd(36);
        const price = ('Rp' + Number(prod.price).toLocaleString('id-ID')).padStart(10);
        const cost = ('Rp' + Number(prod.costPrice).toLocaleString('id-ID')).padStart(10);
        const stock = String(prod.stock).padStart(5);
        console.log(`${no} | ${name} | ${price} | ${cost} | ${stock}`);
      });
    });
    
    const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);
    console.log('\n' + '='.repeat(80));
    console.log(`Total: ${totalProducts} produk dalam ${categories.length} kategori\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

getBebekFaraMenu();

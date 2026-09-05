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

async function getBebekFaraMenuJSON() {
  try {
    // Cari business Bebek Fara
    const business = await prisma.business.findFirst({
      where: { name: 'Bebek Fara' },
    });
    
    if (!business) {
      console.log(JSON.stringify({ error: 'Business Bebek Fara tidak ditemukan' }, null, 2));
      return;
    }
    
    // Ambil semua kategori dan produk
    const categories = await prisma.category.findMany({
      where: { businessId: business.id },
      include: {
        products: {
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            price: true,
            costPrice: true,
            stock: true,
            status: true,
            imageUrl: true,
            categoryId: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    const result = {
      business: {
        id: business.id,
        name: business.name,
        address: business.address,
        phone: business.phone,
      },
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        productCount: cat.products.length,
        products: cat.products.map(prod => ({
          id: prod.id,
          name: prod.name,
          price: Number(prod.price),
          costPrice: Number(prod.costPrice),
          stock: prod.stock,
          status: prod.status,
          imageUrl: prod.imageUrl,
          categoryId: prod.categoryId,
        }))
      })),
      summary: {
        totalCategories: categories.length,
        totalProducts: categories.reduce((sum, cat) => sum + cat.products.length, 0),
      }
    };
    
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

getBebekFaraMenuJSON();

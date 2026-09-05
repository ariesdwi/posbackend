import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

// Setup connection pool dan adapter (sama seperti PrismaService)
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

async function seedBebekFara() {
  console.log('🦆 Seeding Bebek Fara menu...\n');

  try {
    // 1. Cek atau buat Business untuk Bebek Fara
    let business = await prisma.business.findFirst({
      where: { name: 'Bebek Fara' },
    });

    if (!business) {
      console.log('📦 Creating Bebek Fara business...');
      business = await prisma.business.create({
        data: {
          name: 'Bebek Fara',
          address: 'Jl. Raya Bebek Fara',
          phone: '081234567890',
        },
      });
      console.log(`✅ Business created: ${business.name} (ID: ${business.id})\n`);
    } else {
      console.log(`✅ Business already exists: ${business.name} (ID: ${business.id})\n`);
    }

    // 2. Cek atau buat User admin@bebekfara.com
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@bebekfara.com' },
    });

    if (!admin) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await prisma.user.create({
        data: {
          email: 'admin@bebekfara.com',
          password: hashedPassword,
          name: 'Admin Bebek Fara',
          role: UserRole.BUSINESS_OWNER,
          businessId: business.id,
          isEmailVerified: true,
        },
      });
      console.log(`✅ Admin created: ${admin.email}\n`);
    } else {
      console.log(`✅ Admin already exists: ${admin.email}\n`);
      // Update businessId jika berbeda
      if (admin.businessId !== business.id) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { businessId: business.id },
        });
        console.log(`🔄 Updated admin businessId\n`);
      }
    }

    // 3. Buat Kategori
    console.log('📂 Creating categories...');
    const categories = [
      { name: '🍱 Paket Nasi', description: 'Paket nasi lengkap' },
      { name: '🍗 Ala Carte', description: 'Menu tanpa nasi' },
      { name: '🎁 Paket Spesial', description: 'Paket hemat dan bundling' },
      { name: '➕ Extra Favorit', description: 'Tambahan dan pelengkap' },
    ];

    const categoryMap: Record<string, any> = {};
    for (const cat of categories) {
      const existing = await prisma.category.findFirst({
        where: { name: cat.name, businessId: business.id },
      });
      if (existing) {
        categoryMap[cat.name] = existing;
        console.log(`  ✓ ${cat.name} (exists)`);
      } else {
        const created = await prisma.category.create({
          data: { ...cat, businessId: business.id },
        });
        categoryMap[cat.name] = created;
        console.log(`  ✓ ${cat.name} (created)`);
      }
    }
    console.log();

    // 4. Inject Produk
    console.log('🍽️  Creating products...\n');

    const products = [
      // Paket Nasi
      {
        sku: 'BF-PN-001',
        name: 'Nasi Bebek Rempah Madura Jumbo',
        price: 35000,
        costPrice: 24500, // asumsi margin ~30%
        stock: 100,
        category: '🍱 Paket Nasi',
      },
      {
        sku: 'BF-PN-002',
        name: 'Nasi Bebek Rempah Madura Kecil',
        price: 27000,
        costPrice: 18900,
        stock: 100,
        category: '🍱 Paket Nasi',
      },
      {
        sku: 'BF-PN-003',
        name: 'Nasi Ayam Rempah Madura',
        price: 25000,
        costPrice: 17500,
        stock: 100,
        category: '🍱 Paket Nasi',
      },

      // Ala Carte
      {
        sku: 'BF-AC-001',
        name: 'Bebek Rempah (Ala Carte)',
        price: 30000,
        costPrice: 21000,
        stock: 50,
        category: '🍗 Ala Carte',
      },
      {
        sku: 'BF-AC-002',
        name: 'Ayam Rempah (Ala Carte)',
        price: 17000,
        costPrice: 11900,
        stock: 50,
        category: '🍗 Ala Carte',
      },

      // Paket Spesial
      {
        sku: 'BF-PH-001',
        name: '1 Ekor Bebek Rempah',
        price: 175000,
        costPrice: 122500,
        stock: 20,
        category: '🎁 Paket Spesial',
      },
      {
        sku: 'BF-PB-001',
        name: 'Bundling Bebek + Ayam Rempah',
        price: 53000,
        costPrice: 37100,
        stock: 30,
        category: '🎁 Paket Spesial',
      },

      // Extra Favorit
      {
        sku: 'BF-EX-001',
        name: 'Leher Kepala Bebek Rempah',
        price: 5000,
        costPrice: 3500,
        stock: 50,
        category: '➕ Extra Favorit',
      },
      {
        sku: 'BF-EX-002',
        name: 'Ati Ampela Goreng',
        price: 8000,
        costPrice: 5600,
        stock: 50,
        category: '➕ Extra Favorit',
      },
      {
        sku: 'BF-EX-003',
        name: 'Tahu Goreng',
        price: 2000,
        costPrice: 1400,
        stock: 100,
        category: '➕ Extra Favorit',
      },
      {
        sku: 'BF-EX-004',
        name: 'Tempe Goreng',
        price: 2000,
        costPrice: 1400,
        stock: 100,
        category: '➕ Extra Favorit',
      },
      {
        sku: 'BF-EX-005',
        name: 'Extra Bumbu Hitam',
        price: 3000,
        costPrice: 2100,
        stock: 100,
        category: '➕ Extra Favorit',
      },
      {
        sku: 'BF-EX-006',
        name: 'Nasi Putih',
        price: 5000,
        costPrice: 3500,
        stock: 200,
        category: '➕ Extra Favorit',
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const prod of products) {
      const categoryId = categoryMap[prod.category]?.id;
      if (!categoryId) {
        console.log(`  ⚠️  Category not found for: ${prod.name}`);
        continue;
      }

      // Cek apakah produk sudah ada (by name + businessId)
      const existing = await prisma.product.findFirst({
        where: {
          name: prod.name,
          businessId: business.id,
        },
      });

      if (existing) {
        console.log(`  ⏭️  ${prod.name} (already exists)`);
        skipped++;
      } else {
        await prisma.product.create({
          data: {
            name: prod.name,
            price: prod.price,
            costPrice: prod.costPrice,
            stock: prod.stock,
            status: ProductStatus.AVAILABLE,
            categoryId,
            businessId: business.id,
          },
        });
        console.log(`  ✅ ${prod.name} - Rp${prod.price.toLocaleString('id-ID')}`);
        created++;
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   - Created: ${created} products`);
    console.log(`   - Skipped: ${skipped} products (already exist)\n`);
    console.log(`🔑 Login credentials:`);
    console.log(`   Email: admin@bebekfara.com`);
    console.log(`   Password: admin123\n`);
  } catch (error) {
    console.error('❌ Error seeding Bebek Fara:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedBebekFara();

import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
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

const KASIR_ACCOUNTS = [
  {
    name: 'Ipeh',
    email: 'ipeh@bebekfara.com',
    password: 'ipeh123',
  },
  {
    name: 'Nessa',
    email: 'nessa@bebekfara.com',
    password: 'nessa123',
  },
];

async function createKasirAccounts() {
  console.log('👥 Creating Kasir accounts for Bebek Fara...\n');

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

    // 2. Buat akun kasir
    console.log('📝 Creating kasir accounts...\n');
    console.log('   ' + '-'.repeat(70));

    const createdAccounts: Array<{ name: string; email: string; password: string }> = [];

    for (const kasir of KASIR_ACCOUNTS) {
      // Cek apakah email sudah ada
      const existing = await prisma.user.findUnique({
        where: { email: kasir.email },
      });

      if (existing) {
        console.log(`   ⚠️  ${kasir.name.padEnd(10)} - Email already exists: ${kasir.email}`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(kasir.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: kasir.email,
          password: hashedPassword,
          name: kasir.name,
          role: UserRole.KASIR,
          businessId: business.id,
          isEmailVerified: true,
        },
      });

      console.log(`   ✅ ${kasir.name.padEnd(10)} - Created successfully`);
      createdAccounts.push({
        name: kasir.name,
        email: kasir.email,
        password: kasir.password,
      });
    }

    console.log('   ' + '-'.repeat(70) + '\n');

    if (createdAccounts.length === 0) {
      console.log('⚠️  No new accounts created (all emails already exist)\n');
      return;
    }

    // 3. Tampilkan summary
    console.log('✅ Kasir accounts created successfully!\n');
    console.log('📋 Login Credentials:\n');
    console.log('   ' + '='.repeat(70));
    console.log('   Name       | Email                      | Password');
    console.log('   ' + '='.repeat(70));

    createdAccounts.forEach((acc) => {
      const nameCol = acc.name.padEnd(10);
      const emailCol = acc.email.padEnd(26);
      console.log(`   ${nameCol} | ${emailCol} | ${acc.password}`);
    });

    console.log('   ' + '='.repeat(70) + '\n');

    // 4. Tampilkan semua user di Bebek Fara
    const allUsers = await prisma.user.findMany({
      where: { businessId: business.id },
      orderBy: { role: 'asc' },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    console.log('👥 All users in Bebek Fara:\n');
    allUsers.forEach((user, idx) => {
      const roleIcon = user.role === 'BUSINESS_OWNER' ? '👑' : user.role === 'KASIR' ? '🧑‍💼' : '⚙️';
      console.log(`   ${roleIcon} ${user.name.padEnd(20)} (${user.role.padEnd(15)}) - ${user.email}`);
    });

    console.log(`\n   Total: ${allUsers.length} users\n`);

    // 5. Info untuk admin
    console.log('💡 Informasi untuk Admin:');
    console.log('   - Kasir hanya bisa create transaksi & checkout');
    console.log('   - Kasir TIDAK bisa update harga/produk');
    console.log('   - Kasir TIDAK bisa delete transaksi');
    console.log('   - Kasir TIDAK bisa manage user lain\n');

  } catch (error) {
    console.error('❌ Error creating kasir accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createKasirAccounts();

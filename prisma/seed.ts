import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      email: 'admin@pos.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create kasir user
  const kasirPassword = await bcrypt.hash('kasir123', 10);
  const kasir = await prisma.user.upsert({
    where: { email: 'kasir@pos.com' },
    update: {},
    create: {
      email: 'kasir@pos.com',
      password: kasirPassword,
      name: 'Kasir User',
      role: UserRole.KASIR,
    },
  });
  console.log('✅ Created kasir user:', kasir.email);

  // Create categories
  const foodCategory = await prisma.category.upsert({
    where: { name: 'Makanan' },
    update: {},
    create: {
      name: 'Makanan',
      description: 'Menu makanan',
    },
  });

  const drinkCategory = await prisma.category.upsert({
    where: { name: 'Minuman' },
    update: {},
    create: {
      name: 'Minuman',
      description: 'Menu minuman',
    },
  });

  const snackCategory = await prisma.category.upsert({
    where: { name: 'Snack' },
    update: {},
    create: {
      name: 'Snack',
      description: 'Menu snack dan cemilan',
    },
  });

  console.log('✅ Created categories');

  // Create products
  const products = [
    // Food
    {
      name: 'Nasi Goreng',
      description: 'Nasi goreng spesial dengan telur',
      price: 25000,
      stock: 50,
      categoryId: foodCategory.id,
    },
    {
      name: 'Mie Goreng',
      description: 'Mie goreng pedas',
      price: 20000,
      stock: 40,
      categoryId: foodCategory.id,
    },
    {
      name: 'Ayam Bakar',
      description: 'Ayam bakar dengan sambal',
      price: 30000,
      stock: 30,
      categoryId: foodCategory.id,
    },
    {
      name: 'Soto Ayam',
      description: 'Soto ayam kuah kuning',
      price: 22000,
      stock: 35,
      categoryId: foodCategory.id,
    },
    // Drinks
    {
      name: 'Es Teh Manis',
      description: 'Es teh manis segar',
      price: 5000,
      stock: 100,
      categoryId: drinkCategory.id,
    },
    {
      name: 'Es Jeruk',
      description: 'Es jeruk peras segar',
      price: 8000,
      stock: 80,
      categoryId: drinkCategory.id,
    },
    {
      name: 'Kopi Hitam',
      description: 'Kopi hitam tanpa gula',
      price: 10000,
      stock: 60,
      categoryId: drinkCategory.id,
    },
    {
      name: 'Jus Alpukat',
      description: 'Jus alpukat segar',
      price: 15000,
      stock: 40,
      categoryId: drinkCategory.id,
    },
    // Snacks
    {
      name: 'Pisang Goreng',
      description: 'Pisang goreng crispy',
      price: 12000,
      stock: 50,
      categoryId: snackCategory.id,
    },
    {
      name: 'Tahu Isi',
      description: 'Tahu isi sayuran',
      price: 10000,
      stock: 45,
      categoryId: snackCategory.id,
    },
    {
      name: 'Keripik Singkong',
      description: 'Keripik singkong pedas',
      price: 8000,
      stock: 70,
      categoryId: snackCategory.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Created products');

  console.log('🎉 Database seed completed!');
  console.log('\n📝 Default credentials:');
  console.log('Admin - Email: admin@pos.com, Password: admin123');
  console.log('Kasir - Email: kasir@pos.com, Password: kasir123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

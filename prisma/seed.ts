import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Delete all existing data
  console.log('🗑️  Deleting existing data...');
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.business.deleteMany();

  console.log('✅ Existing data deleted');

  // Create default business
  const business = await prisma.business.create({
    data: {
      name: 'Kedai Kita',
      address: 'Jl. Contoh No. 123',
      phone: '081234567890',
    },
  });
  console.log('✅ Created business:', business.name);

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
      businessId: business.id,
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
      businessId: business.id,
    },
  });
  console.log('✅ Created kasir user:', kasir.email);

  // Create categories
  const iceDrinkCat = await prisma.category.create({
    data: { name: 'Ice Drink', description: 'Minuman dingin', businessId: business.id },
  });

  const hotDrinkCat = await prisma.category.create({
    data: { name: 'Hot Drink', description: 'Minuman hangat', businessId: business.id },
  });

  const teaCat = await prisma.category.create({
    data: { name: 'Tea', description: 'Teh', businessId: business.id },
  });

  const milkShakeCat = await prisma.category.create({
    data: { name: 'Milk Shake', description: 'Milk shake & minuman susu', businessId: business.id },
  });

  const squashCat = await prisma.category.create({
    data: { name: 'Squash', description: 'Squash', businessId: business.id },
  });

  const nasiGorengCat = await prisma.category.create({
    data: { name: 'Nasi Goreng', description: 'Nasi goreng', businessId: business.id },
  });

  const laukTambahanCat = await prisma.category.create({
    data: { name: 'Lauk Tambahan', description: 'Lauk tambahan', businessId: business.id },
  });

  const makananRinganCat = await prisma.category.create({
    data: { name: 'Makanan Ringan', description: 'Makanan ringan & snack', businessId: business.id },
  });

  const chineseFoodCat = await prisma.category.create({
    data: { name: 'Chinese Food', description: 'Masakan chinese', businessId: business.id },
  });

  const kwetiauCat = await prisma.category.create({
    data: { name: 'Kwetiau', description: 'Kwetiau', businessId: business.id },
  });

  const capcayCat = await prisma.category.create({
    data: { name: 'Capcay', description: 'Capcay', businessId: business.id },
  });

  const mieCat = await prisma.category.create({
    data: { name: 'Mie', description: 'Mie', businessId: business.id },
  });

  const bihunCat = await prisma.category.create({
    data: { name: 'Bihun', description: 'Bihun', businessId: business.id },
  });

  const menuMakananCat = await prisma.category.create({
    data: { name: 'Menu Makanan', description: 'Menu makanan utama', businessId: business.id },
  });

  const lalapanCat = await prisma.category.create({
    data: { name: 'Lalapan', description: 'Lalapan', businessId: business.id },
  });

  const sayuranCat = await prisma.category.create({
    data: { name: 'Sayuran', description: 'Sayuran', businessId: business.id },
  });

  console.log('✅ Created categories');

  // Create products
  const products = [
    // ICE DRINK
    {
      name: 'Ice Coffee Klepon',
      price: 10000,
      stock: 100,
      categoryId: iceDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?iced-coffee',
    },
    {
      name: 'Ice Coffee Gula Aren',
      price: 10000,
      stock: 100,
      categoryId: iceDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?cold-brew-coffee',
    },
    {
      name: 'Ice Coffee Latte',
      price: 10000,
      stock: 100,
      categoryId: iceDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?iced-latte',
    },
    {
      name: 'Ice Jahe',
      price: 7000,
      stock: 100,
      categoryId: iceDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?ginger-drink',
    },

    // HOT DRINK
    {
      name: 'Kopi Kita Tubruk',
      price: 5000,
      stock: 100,
      categoryId: hotDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?black-coffee',
    },
    {
      name: 'Kopi Nangka Tubruk',
      price: 6000,
      stock: 100,
      categoryId: hotDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?coffee-cup',
    },
    {
      name: 'Jahe Hangat',
      price: 5000,
      stock: 100,
      categoryId: hotDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?ginger-tea',
    },
    {
      name: 'Jeruk Hangat',
      price: 5000,
      stock: 100,
      categoryId: hotDrinkCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?hot-lemon',
    },

    // TEA
    {
      name: 'Teh Hangat',
      price: 3000,
      stock: 100,
      categoryId: teaCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?hot-tea',
    },
    {
      name: 'Es Teh',
      price: 4000,
      stock: 100,
      categoryId: teaCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?iced-tea',
    },
    {
      name: 'Es Sirup',
      price: 5000,
      stock: 100,
      categoryId: teaCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?syrup-drink',
    },
    {
      name: 'Es Teh Tarik',
      price: 5000,
      stock: 100,
      categoryId: teaCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?milk-tea',
    },

    // MILK SHAKE
    {
      name: 'Es Cokelat',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?chocolate-milkshake',
    },
    {
      name: 'Es Hazelnut',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?hazelnut-drink',
    },
    {
      name: 'Es Taro',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?taro-drink',
    },
    {
      name: 'Es Cappuccino',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?cappuccino',
    },
    {
      name: 'Es Thai Tea',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?thai-tea',
    },
    {
      name: 'Es Matcha',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?matcha-latte',
    },
    {
      name: 'Es Permen Karet',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?bubblegum-drink',
    },
    {
      name: 'Es Moccacino',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?mocha-drink',
    },
    {
      name: 'Es Oreo',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?oreo-milkshake',
    },
    {
      name: 'Es Red Velvet',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?red-velvet-drink',
    },
    {
      name: 'Es Strawberry Tea',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?strawberry-tea',
    },
    {
      name: 'Es Leci Tea',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?lychee-tea',
    },
    {
      name: 'Es Lemon Tea',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?lemon-tea',
    },

    // Tambahan rasa
    {
      name: 'Tambahan Avocado',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?avocado-smoothie',
    },
    {
      name: 'Tambahan Mangga',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?mango-smoothie',
    },
    {
      name: 'Tambahan Strawberry',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?strawberry-smoothie',
    },
    {
      name: 'Tambahan Milo',
      price: 7000,
      stock: 100,
      categoryId: milkShakeCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?chocolate-drink',
    },

    // SQUASH
    {
      name: 'Squash Mango',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?mango-juice',
    },
    {
      name: 'Squash Strawberry',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?strawberry-juice',
    },
    {
      name: 'Squash Leci',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?lychee-juice',
    },
    {
      name: 'Squash Markisa',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?passion-fruit-juice',
    },
    {
      name: 'Squash Jeruk Nipis',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?lime-juice',
    },
    {
      name: 'Squash Blue Lagoon',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?blue-drink',
    },
    {
      name: 'SOGEM',
      price: 6000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?orange-juice',
    },
    {
      name: 'Squash Mega Mendung',
      price: 8000,
      stock: 100,
      categoryId: squashCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fruit-punch',
    },

    // NASI GORENG
    {
      name: 'Nasi Goreng Biasa',
      price: 12000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-rice',
    },
    {
      name: 'Nasi Goreng Teri',
      price: 13000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?indonesian-fried-rice',
    },
    {
      name: 'Nasi Goreng Cabe Ijo',
      price: 14000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?spicy-fried-rice',
    },
    {
      name: 'Nasi Goreng Kedai Kita',
      price: 14000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?nasi-goreng',
    },
    {
      name: 'Nasi Goreng Jawa',
      price: 15000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?asian-fried-rice',
    },
    {
      name: 'Nasi Goreng Seafood',
      price: 13000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-fried-rice',
    },
    {
      name: 'Nasi Goreng Mawud',
      price: 13000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?special-fried-rice',
    },
    {
      name: 'Nasi Goreng Petai',
      price: 13000,
      stock: 50,
      categoryId: nasiGorengCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?vegetable-fried-rice',
    },

    // LAUK TAMBAHAN
    {
      name: 'Tempe Goreng isi 5',
      price: 5000,
      stock: 100,
      categoryId: laukTambahanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-tempeh',
    },
    {
      name: 'Tahu Goreng isi 5',
      price: 5000,
      stock: 100,
      categoryId: laukTambahanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-tofu',
    },
    {
      name: 'Telur Dadar',
      price: 5000,
      stock: 100,
      categoryId: laukTambahanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?omelette',
    },
    {
      name: 'Telur Mata Sapi',
      price: 3000,
      stock: 100,
      categoryId: laukTambahanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-egg',
    },

    // MAKANAN RINGAN
    {
      name: 'Indomie Goreng',
      price: 10000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?instant-noodles',
    },
    {
      name: 'Mie Sedaap Goreng',
      price: 10000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-noodles',
    },
    {
      name: 'Sarimi Kuah',
      price: 10000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?noodle-soup',
    },
    {
      name: 'Roti Maryam',
      price: 12000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?flatbread',
    },
    {
      name: 'Sosis Goreng',
      price: 5000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-sausage',
    },
    {
      name: 'Piscok',
      price: 6000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?banana-fritter',
    },
    {
      name: 'Kentang Goreng',
      price: 5000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?french-fries',
    },
    {
      name: 'Tahu Krispi',
      price: 5000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?crispy-tofu',
    },
    {
      name: 'Naget',
      price: 5000,
      stock: 100,
      categoryId: makananRinganCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?chicken-nuggets',
    },

    // CHINESE FOOD
    {
      name: 'Coloke',
      price: 18000,
      stock: 30,
      categoryId: chineseFoodCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?chinese-food',
    },
    {
      name: 'Fuyunghai',
      price: 18000,
      stock: 30,
      categoryId: chineseFoodCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?egg-foo-young',
    },
    {
      name: 'Sapo Tahu',
      price: 18000,
      stock: 30,
      categoryId: chineseFoodCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?tofu-claypot',
    },

    // KWETIAU
    {
      name: 'Kwetiau Goreng Biasa',
      price: 15000,
      stock: 50,
      categoryId: kwetiauCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-rice-noodles',
    },
    {
      name: 'Kwetiau Goreng Seafood',
      price: 17000,
      stock: 50,
      categoryId: kwetiauCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-noodles',
    },
    {
      name: 'Kwetiau Kuah Biasa',
      price: 15000,
      stock: 50,
      categoryId: kwetiauCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?rice-noodle-soup',
    },
    {
      name: 'Kwetiau Kuah Seafood',
      price: 17000,
      stock: 50,
      categoryId: kwetiauCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-noodle-soup',
    },

    // CAPCAY
    {
      name: 'Capcay Goreng Biasa',
      price: 13000,
      stock: 50,
      categoryId: capcayCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?stir-fry-vegetables',
    },
    {
      name: 'Capcay Goreng Seafood',
      price: 15000,
      stock: 50,
      categoryId: capcayCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-vegetables',
    },
    {
      name: 'Capcay Kuah Biasa',
      price: 13000,
      stock: 50,
      categoryId: capcayCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?vegetable-soup',
    },
    {
      name: 'Capcay Kuah Seafood',
      price: 15000,
      stock: 50,
      categoryId: capcayCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-vegetable-soup',
    },

    // MIE
    {
      name: 'Mie Goreng Biasa',
      price: 13000,
      stock: 50,
      categoryId: mieCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?stir-fried-noodles',
    },
    {
      name: 'Mie Goreng Seafood',
      price: 15000,
      stock: 50,
      categoryId: mieCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-stir-fry-noodles',
    },
    {
      name: 'Mie Kuah Biasa',
      price: 13000,
      stock: 50,
      categoryId: mieCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?noodle-bowl',
    },
    {
      name: 'Mie Kuah Seafood',
      price: 15000,
      stock: 50,
      categoryId: mieCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-noodle-bowl',
    },

    // BIHUN
    {
      name: 'Bihun Goreng Biasa',
      price: 13000,
      stock: 50,
      categoryId: bihunCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?vermicelli-noodles',
    },
    {
      name: 'Bihun Goreng Seafood',
      price: 15000,
      stock: 50,
      categoryId: bihunCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?seafood-vermicelli',
    },

    // MENU MAKANAN
    {
      name: 'Ayam Betutu',
      price: 28000,
      stock: 30,
      categoryId: menuMakananCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?balinese-chicken',
    },
    {
      name: 'Ayam Geprek',
      price: 15000,
      stock: 30,
      categoryId: menuMakananCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?smashed-fried-chicken',
    },
    {
      name: 'Ayam Cabai Garam',
      price: 18000,
      stock: 30,
      categoryId: menuMakananCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?salt-pepper-chicken',
    },
    {
      name: 'Sapi Lada Hitam',
      price: 30000,
      stock: 20,
      categoryId: menuMakananCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?black-pepper-beef',
    },
    {
      name: 'Ayam Bakar Kota',
      price: 15000,
      stock: 30,
      categoryId: menuMakananCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?grilled-chicken',
    },
    {
      name: 'Ayam Bakar Desa',
      price: 27000,
      stock: 30,
      categoryId: menuMakananCat.id,
      imageUrl:
        'https://source.unsplash.com/400x400/?indonesian-grilled-chicken',
    },

    // LALAPAN
    {
      name: '4T (Tahu, Tempe, Telur, Terong)',
      price: 13000,
      stock: 50,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?indonesian-vegetables',
    },
    {
      name: 'Ayam Goreng Kota',
      price: 13000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?indonesian-fried-chicken',
    },
    {
      name: 'Ayam Goreng Desa',
      price: 27000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?crispy-fried-chicken',
    },
    {
      name: 'Bebek Goreng',
      price: 27000,
      stock: 20,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-duck',
    },
    {
      name: 'Lele Goreng',
      price: 17000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?fried-catfish',
    },
    {
      name: 'Lele Bakar',
      price: 19000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?grilled-catfish',
    },
    {
      name: 'Lele Manis',
      price: 19000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?sweet-catfish',
    },
    {
      name: 'Lele Krispi',
      price: 19000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?crispy-catfish',
    },
    {
      name: 'Ayam Lada Hitam',
      price: 18000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?black-pepper-chicken',
    },
    {
      name: 'Ayam Rica-rica',
      price: 22000,
      stock: 30,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?spicy-chicken',
    },
    {
      name: 'Bebek Rica-rica',
      price: 27000,
      stock: 20,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?spicy-duck',
    },
    {
      name: 'Bebek Bakar',
      price: 27000,
      stock: 20,
      categoryId: lalapanCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?grilled-duck',
    },

    // SAYURAN
    {
      name: 'Petai',
      price: 5000,
      stock: 50,
      categoryId: sayuranCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?stink-beans',
    },
    {
      name: 'Cah Kangkung',
      price: 10000,
      stock: 50,
      categoryId: sayuranCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?water-spinach',
    },
    {
      name: 'Cah Brokoli',
      price: 10000,
      stock: 50,
      categoryId: sayuranCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?stir-fry-broccoli',
    },
    {
      name: 'Cah Tauge',
      price: 10000,
      stock: 50,
      categoryId: sayuranCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?bean-sprouts',
    },
    {
      name: 'Pecak Peyom Bok',
      price: 20000,
      stock: 30,
      categoryId: sayuranCat.id,
      imageUrl: 'https://source.unsplash.com/400x400/?indonesian-salad',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        businessId: business.id,
      },
    });
  }

  console.log('✅ Created products');

  console.log('🎉 Database seed completed!');
  console.log(`\n📊 Summary:`);
  console.log(`- Categories: 16`);
  console.log(`- Products: ${products.length}`);
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
    await pool.end();
  });

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
const bcrypt = __importStar(require("bcrypt"));
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false,
    },
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function seedBebekFara() {
    console.log('🦆 Seeding Bebek Fara menu...\n');
    try {
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
        }
        else {
            console.log(`✅ Business already exists: ${business.name} (ID: ${business.id})\n`);
        }
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
                    role: client_1.UserRole.BUSINESS_OWNER,
                    businessId: business.id,
                    isEmailVerified: true,
                },
            });
            console.log(`✅ Admin created: ${admin.email}\n`);
        }
        else {
            console.log(`✅ Admin already exists: ${admin.email}\n`);
            if (admin.businessId !== business.id) {
                await prisma.user.update({
                    where: { id: admin.id },
                    data: { businessId: business.id },
                });
                console.log(`🔄 Updated admin businessId\n`);
            }
        }
        console.log('📂 Creating categories...');
        const categories = [
            { name: '🍱 Paket Nasi', description: 'Paket nasi lengkap' },
            { name: '🍗 Ala Carte', description: 'Menu tanpa nasi' },
            { name: '🎁 Paket Spesial', description: 'Paket hemat dan bundling' },
            { name: '➕ Extra Favorit', description: 'Tambahan dan pelengkap' },
        ];
        const categoryMap = {};
        for (const cat of categories) {
            const existing = await prisma.category.findFirst({
                where: { name: cat.name, businessId: business.id },
            });
            if (existing) {
                categoryMap[cat.name] = existing;
                console.log(`  ✓ ${cat.name} (exists)`);
            }
            else {
                const created = await prisma.category.create({
                    data: { ...cat, businessId: business.id },
                });
                categoryMap[cat.name] = created;
                console.log(`  ✓ ${cat.name} (created)`);
            }
        }
        console.log();
        console.log('🍽️  Creating products...\n');
        const products = [
            {
                sku: 'BF-PN-001',
                name: 'Nasi Bebek Rempah Madura Jumbo',
                price: 35000,
                costPrice: 24500,
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
            const existing = await prisma.product.findFirst({
                where: {
                    name: prod.name,
                    businessId: business.id,
                },
            });
            if (existing) {
                console.log(`  ⏭️  ${prod.name} (already exists)`);
                skipped++;
            }
            else {
                await prisma.product.create({
                    data: {
                        name: prod.name,
                        price: prod.price,
                        costPrice: prod.costPrice,
                        stock: prod.stock,
                        status: client_1.ProductStatus.AVAILABLE,
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
    }
    catch (error) {
        console.error('❌ Error seeding Bebek Fara:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
seedBebekFara();
//# sourceMappingURL=seed-bebekfara.js.map
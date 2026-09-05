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
        const business = await prisma.business.findFirst({
            where: { name: 'Bebek Fara' },
        });
        if (!business) {
            console.log('❌ Business Bebek Fara tidak ditemukan!');
            return;
        }
        console.log(`✅ Found business: ${business.name} (ID: ${business.id})\n`);
        console.log('📝 Creating kasir accounts...\n');
        console.log('   ' + '-'.repeat(70));
        const createdAccounts = [];
        for (const kasir of KASIR_ACCOUNTS) {
            const existing = await prisma.user.findUnique({
                where: { email: kasir.email },
            });
            if (existing) {
                console.log(`   ⚠️  ${kasir.name.padEnd(10)} - Email already exists: ${kasir.email}`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(kasir.password, 10);
            const user = await prisma.user.create({
                data: {
                    email: kasir.email,
                    password: hashedPassword,
                    name: kasir.name,
                    role: client_1.UserRole.KASIR,
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
        console.log('💡 Informasi untuk Admin:');
        console.log('   - Kasir hanya bisa create transaksi & checkout');
        console.log('   - Kasir TIDAK bisa update harga/produk');
        console.log('   - Kasir TIDAK bisa delete transaksi');
        console.log('   - Kasir TIDAK bisa manage user lain\n');
    }
    catch (error) {
        console.error('❌ Error creating kasir accounts:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
createKasirAccounts();
//# sourceMappingURL=create-kasir-bebekfara.js.map
// ==========================================
// TESTING CONFIGURATION - BEBEK FARA ONLY
// ==========================================

// PRODUCTION SAFETY: Only test with Bebek Fara accounts
// DO NOT modify this unless you want to test other businesses

module.exports = {
  // Bebek Fara Business ID (LOCKED)
  BUSINESS_ID: 'cmkc7lejr00004yktqn5kj064',
  
  // Test Accounts
  KASIR_ACCOUNT: {
    email: 'kasir@kedaikita.com',
    password: 'kasir123',
    name: 'Firdho',
    role: 'KASIR'
  },
  
  OWNER_ACCOUNT: {
    email: 'owner@kedaikita.com',
    password: 'owner123',
    name: 'Business Owner',
    role: 'BUSINESS_OWNER'
  },
  
  // API Base URL
  API_URL: process.env.API_URL || 'http://localhost:3000',
  
  // Test Product (Bebek Fara menu)
  TEST_PRODUCT_ID: 'cml7wauqy000004jrimd12cmw', // 4T (TN)
  
  // Safety Check
  verifySafeAccount: (user) => {
    if (user.businessId !== module.exports.BUSINESS_ID) {
      throw new Error('⛔ SAFETY: This account is NOT Bebek Fara! Testing aborted.');
    }
    console.log('✅ Safety Check: Account is Bebek Fara');
    return true;
  }
};

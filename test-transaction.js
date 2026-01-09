#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testTransactions() {
  console.log('\n🧪 Starting Transaction Testing Suite...\n');

  try {
    // Step 1: Login as Kasir
    console.log('📝 Step 1: Logging in as Kasir...');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: 'kasir@pos.com',
      password: 'kasir123',
    });

    if (loginRes.status !== 200 && loginRes.status !== 201) {
      console.error('❌ Login failed:', loginRes.body);
      process.exit(1);
    }

    const token = loginRes.body.data?.accessToken;
    if (!token) {
      console.error('❌ No token received:', loginRes.body);
      process.exit(1);
    }
    console.log('✅ Login successful!');
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // Step 2: Get Products
    console.log('\n📝 Step 2: Fetching available products...');
    const productsRes = await makeRequest('GET', '/menu/products', null, token);

    if (productsRes.status !== 200) {
      console.error('❌ Failed to fetch products:', productsRes.body);
      process.exit(1);
    }

    const products = productsRes.body.data || [];
    if (products.length === 0) {
      console.error('❌ No products found');
      process.exit(1);
    }

    console.log(`✅ Found ${products.length} products`);
    const product1 = products[0];
    const product2 = products[1] || products[0];
    console.log(`   Using: "${product1.name}" (ID: ${product1.id}, Price: ${product1.price})`);
    if (product2.id !== product1.id) {
      console.log(`   Using: "${product2.name}" (ID: ${product2.id}, Price: ${product2.price})`);
    }

    // Step 3: Create Transaction
    console.log('\n📝 Step 3: Creating a transaction...');
    const transactionBody = {
      items: [
        {
          productId: product1.id,
          quantity: 2,
        },
        {
          productId: product2.id,
          quantity: 1,
        },
      ],
      tableNumber: 'Table 5',
      notes: 'Test transaction for cashier',
    };

    const createRes = await makeRequest(
      'POST',
      '/transactions',
      transactionBody,
      token
    );

    if (createRes.status !== 200 && createRes.status !== 201) {
      console.error('❌ Failed to create transaction:', createRes.body);
      process.exit(1);
    }

    const transaction = createRes.body.data;
    const transactionId = transaction.id;
    const totalAmount = transaction.totalAmount || 0;

    console.log('✅ Transaction created successfully!');
    console.log(`   ID: ${transactionId}`);
    console.log(`   Status: ${transaction.status}`);
    console.log(`   Table: ${transaction.tableNumber}`);
    console.log(`   Items: ${transaction.items?.length || 0}`);
    console.log(`   Total Amount: ${totalAmount}`);

    // Step 4: Checkout Transaction
    console.log('\n📝 Step 4: Checking out the transaction...');
    const checkoutBody = {
      paymentMethod: 'CASH',
      paymentAmount: Math.ceil(totalAmount * 1.1), // Add 10% extra
      notes: 'Payment completed',
    };

    const checkoutRes = await makeRequest(
      'POST',
      `/transactions/${transactionId}/checkout`,
      checkoutBody,
      token
    );

    if (checkoutRes.status !== 200 && checkoutRes.status !== 201) {
      console.error('❌ Failed to checkout:', checkoutRes.body);
      process.exit(1);
    }

    const completedTransaction = checkoutRes.body.data;
    console.log('✅ Checkout successful!');
    console.log(`   ID: ${completedTransaction.id}`);
    console.log(`   Status: ${completedTransaction.status}`);
    console.log(`   Payment Method: ${completedTransaction.paymentMethod}`);
    console.log(`   Payment Amount: ${completedTransaction.paymentAmount}`);
    console.log(`   Change: ${completedTransaction.change || 0}`);

    // Step 5: Get Transaction Details
    console.log('\n📝 Step 5: Retrieving final transaction details...');
    const detailsRes = await makeRequest(
      'GET',
      `/transactions/${transactionId}`,
      null,
      token
    );

    if (detailsRes.status !== 200) {
      console.error('⚠️  Could not fetch transaction details:', detailsRes.body);
    } else {
      const finalTx = detailsRes.body.data;
      console.log('✅ Transaction details retrieved!');
      console.log(`   ID: ${finalTx.id}`);
      console.log(`   Status: ${finalTx.status}`);
      console.log(`   Created: ${finalTx.createdAt}`);
      console.log(`   Items: ${finalTx.items?.length || 0}`);
    }

    console.log('\n✅ All tests passed! Transaction flow is working correctly.\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

testTransactions();

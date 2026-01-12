
const BASE_URL = 'http://localhost:3000';

async function fetchJson(url: string, options: any) {
    const res = await fetch(url, options);
    const text = await res.text();
    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        throw new Error(`Failed to parse JSON from ${url} (${res.status}): ${text}`);
    }
    
    // If response is wrapped in { data: ... }, access json.data
    // but statusCode/success might be in root.
    // If !res.ok, we expect { message: ... } which is in root.
    if (!res.ok) {
        throw new Error(`Request failed ${url} (${res.status}): ${JSON.stringify(json, null, 2)}`);
    }
    return json;
}

async function verify() {
  console.log('🚀 Starting Data Isolation Verification...');

  // 1. Login as Default Admin (Kedai Kita)
  console.log('\n🔐 Logging in as Default Admin (Business A)...');
  const loginA = await fetchJson(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pos.com', password: 'admin123' }),
  });
  
  console.log('✅ Logged in as Admin A');
  const tokenA = loginA.data.accessToken;
  console.log('🔑 Token A:', tokenA ? tokenA.substring(0, 10) + '...' : 'UNDEFINED');

  // 2. Fetch Products for Business A
  console.log('\n📦 Fetching products for Business A...');
  const productsARes = await fetchJson(`${BASE_URL}/menu`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const productsAList = productsARes.data;
  
  if (!Array.isArray(productsAList)) {
      throw new Error(`Expected array for products A, got: ${JSON.stringify(productsAList)}`);
  }
  const countA = productsAList.length;
  console.log(`✅ Business A has ${countA} products.`);

  // 3. Register Competitor Business (Business B)
  console.log('\n🏢 Registering Competitor Business (Business B)...');
  let registerB;
  try {
      registerB = await fetchJson(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`
        },
        body: JSON.stringify({
          email: 'competitor@pos.com',
          password: 'competitor123',
          name: 'Competitor Admin',
          role: 'ADMIN',
          businessName: 'Competitor Inc'
        }),
      });
      console.log('✅ Registered Business B');
  } catch (e: any) {
      if (e.message.includes('Email already registered')) {
          console.log('⚠️  User already exists, proceeding to login...');
      } else {
          throw e; // Rethrow other errors
      }
  }

  // 4. Login as Competitor Admin (Business B)
  console.log('\n🔐 Logging in as Competitor Admin (Business B)...');
  const loginB = await fetchJson(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'competitor@pos.com', password: 'competitor123' }),
  });

  const tokenB = loginB.data.accessToken;
  console.log('✅ Logged in as Admin B');

  // 5. Verify Isolation: Business B should see 0 products (or distinct list)
  console.log('\n🕵️‍♀️ Verifying Isolation (Business B GET /menu)...');
  const productsBRes = await fetchJson(`${BASE_URL}/menu`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const productsBList = productsBRes.data;
  
  if (!Array.isArray(productsBList)) {
      throw new Error(`Expected array for products B, got: ${JSON.stringify(productsBList)}`);
  }
  console.log(`✅ Business B sees ${productsBList.length} products.`);

  if (productsBList.length !== 0) {
    const intersection = productsAList.filter((p: any) => productsBList.some((b: any) => b.id === p.id));
    if (intersection.length > 0) {
        console.error('❌ DATA LEAK DETECTED! Business B can see Business A products:', intersection);
        process.exit(1);
    }
    console.log('✅ No ID overlap between A and B products.');
  } else {
    console.log('✅ Checked: Business B has empty product list (expected).');
  }

  // 6. Create Product for Business B
  console.log('\n➕ Creating Product for Business B...');
  const catBRes = await fetchJson(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({ name: 'Exclusive Cat B', description: 'Hidden from A' })
  });
  const catB = catBRes.data;

  const createProdBRes = await fetchJson(`${BASE_URL}/menu`, { 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({
      name: 'Secret Product B',
      price: 99999,
      stock: 10,
      categoryId: catB.id,
      imageUrl: 'http://example.com/b.jpg'
    }),
  });
  const prodB = createProdBRes.data;
  console.log('✅ Created Secret Product B');

  // 7. Verify A cannot see B's product
  console.log('\n🕵️‍♀️ Verifying Isolation (Business A GET /menu)...');
  const productsA_FinalRes = await fetchJson(`${BASE_URL}/menu`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const productsAListFinal = productsA_FinalRes.data;
  
  const leaked = productsAListFinal.find((p: any) => p.id === prodB.id);
  if (leaked) {
    console.error('❌ DATA LEAK DETECTED! Business A saw Secret Product B!');
    process.exit(1);
  } else {
    console.log('✅ Checked: Business A CANNOT see Product B.');
  }

  console.log('\n✨ VERIFICATION SUCCESSFUL! Multi-tenancy is working correctly.');
}

verify().catch(err => {
    console.error('❌ Verification Failed:', err);
    process.exit(1);
});

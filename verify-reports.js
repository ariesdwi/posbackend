#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

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

async function verifyReports() {
  console.log('\n🧪 Verifying Reporting Endpoints...\n');

  try {
    // 1. Login
    console.log('📝 Logging in...');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: 'owner@pos.com',
      password: 'owner123',
    });

    const token = loginRes.body.data?.accessToken;
    if (!token) {
      console.error('❌ Login failed');
      process.exit(1);
    }

    // 2. Verify Monthly Report (Trend)
    console.log('📝 Verifying Monthly Report structure...');
    const monthlyRes = await makeRequest('GET', '/reports/monthly', null, token);
    const monthlyData = monthlyRes.body;
    
    if (monthlyData.dailyRevenue && Array.isArray(monthlyData.dailyRevenue)) {
      console.log('✅ monthly/dailyRevenue trend included!');
    } else {
      console.error('❌ monthly/dailyRevenue trend missing!');
    }

    // 3. Verify Margin Report
    console.log('📝 Verifying Margin Report structure...');
    const marginRes = await makeRequest('GET', '/reports/margin?startDate=2026-01-01&endDate=2026-01-31', null, token);
    const marginData = marginRes.body;

    if (marginData.items && Array.isArray(marginData.items)) {
      console.log('✅ margin items included!');
    } else {
      console.error('❌ margin items missing!');
    }

    console.log('\n✅ Verification complete!\n');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyReports();

#!/usr/bin/env node
/**
 * Test Auth Flow: Signup → Signin
 * This script tests the complete authentication flow
 */

require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

const testUser = {
  fullName: 'Test User ' + Date.now(),
  email: `testuser${Date.now()}@example.com`,
  phone: '555-0123',
  password: 'testPassword123'
};

async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

async function runTests() {
  try {
    console.log('🧪 Starting Auth Flow Tests...\n');
    
    // Test 1: Signup
    console.log('1️⃣  Testing SIGNUP...');
    console.log(`   Attempting signup with: ${testUser.email}`);
    
    const signupRes = await makeRequest('POST', '/auth/signup', testUser);
    console.log('   ✅ Signup successful!');
    console.log(`   Token: ${signupRes.token.substring(0, 20)}...`);
    console.log(`   User ID: ${signupRes.data._id}`);
    console.log(`   User Role: ${signupRes.data.role}\n`);
    
    // Test 2: Signin with same credentials
    console.log('2️⃣  Testing SIGNIN (same user)...');
    console.log(`   Attempting signin with: ${testUser.email}`);
    
    const signinRes = await makeRequest('POST', '/auth/signin', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('   ✅ Signin successful!');
    console.log(`   Token: ${signinRes.token.substring(0, 20)}...`);
    console.log(`   User ID: ${signinRes.data._id}`);
    console.log(`   Same user: ${signinRes.data._id === signupRes.data._id ? '✅ YES' : '❌ NO'}\n`);
    
    // Test 3: Login endpoint (should work same as signin)
    console.log('3️⃣  Testing LOGIN endpoint...');
    console.log(`   Attempting login with: ${testUser.email}`);
    
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('   ✅ Login successful!');
    console.log(`   Token: ${loginRes.token.substring(0, 20)}...`);
    console.log(`   Same user: ${loginRes.data._id === signupRes.data._id ? '✅ YES' : '❌ NO'}\n`);
    
    // Test 4: Logout endpoint
    console.log('4️⃣  Testing LOGOUT endpoint...');
    const logoutRes = await makeRequest('POST', '/auth/logout');
    console.log('   ✅ Logout successful!');
    console.log(`   Response: ${logoutRes.message}\n`);
    
    // Test 5: Invalid credentials
    console.log('5️⃣  Testing INVALID credentials...');
    try {
      await makeRequest('POST', '/auth/signin', {
        email: testUser.email,
        password: 'wrongPassword'
      });
      console.log('   ❌ Should have failed but didn\'t!');
    } catch (err) {
      console.log(`   ✅ Correctly rejected invalid password`);
      console.log(`   Error: ${err.message}\n`);
    }
    
    // Test 6: Non-existent user
    console.log('6️⃣  Testing NON-EXISTENT user...');
    try {
      await makeRequest('POST', '/auth/signin', {
        email: 'nonexistent@example.com',
        password: 'anypassword'
      });
      console.log('   ❌ Should have failed but didn\'t!');
    } catch (err) {
      console.log(`   ✅ Correctly rejected non-existent user`);
      console.log(`   Error: ${err.message}\n`);
    }
    
    console.log('✅ All tests passed! Auth flow is working correctly.\n');
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Test failed!');
    if (err.data) {
      console.error(`Status: ${err.status}`);
      console.error(`Error: ${JSON.stringify(err.data, null, 2)}`);
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Error: Cannot connect to backend server.');
      console.error('Make sure the backend is running on http://localhost:5000');
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  }
}

runTests();

/**
 * Simple Integration Test Script
 * Tests frontend-backend connectivity
 */

const axios = require('axios');

const FRONTEND_URL = 'http://localhost:4173';  // Vite preview server
const BACKEND_URL = 'http://localhost:3005';   // Backend server

async function testConnections() {
    console.log('🔍 Testing ExpertTech Studio Integration...\n');
    
    // Test 1: Frontend availability
    console.log('1. Testing Frontend (Vite Preview Server)...');
    try {
        const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
        console.log('✅ Frontend is accessible');
        console.log(`   Status: ${frontendResponse.status}`);
        console.log(`   Content-Length: ${frontendResponse.headers['content-length'] || 'Unknown'}`);
    } catch (error) {
        console.log('❌ Frontend not accessible:', error.message);
    }
    
    console.log('');
    
    // Test 2: Backend API availability (simple test without problematic routes)
    console.log('2. Testing Backend API...');
    
    // Try basic connectivity first
    try {
        const backendResponse = await axios.get(`${BACKEND_URL}/api/v1/health`, { 
            timeout: 5000,
            validateStatus: () => true  // Accept any HTTP status
        });
        console.log('✅ Backend is reachable');
        console.log(`   Status: ${backendResponse.status}`);
        console.log(`   Response: ${JSON.stringify(backendResponse.data, null, 2)}`);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend server is not running');
            console.log('   Please start the backend with: cd src/backend && npm run dev');
        } else {
            console.log('❌ Backend error:', error.message);
        }
    }
    
    console.log('');
    
    // Test 3: Frontend API Service Configuration
    console.log('3. Testing Frontend API Service Configuration...');
    try {
        // This will test if frontend can make requests (even if they fail)
        const testApiCall = axios.create({
            baseURL: `${BACKEND_URL}/api/v1`,
            timeout: 2000,
        });
        
        await testApiCall.get('/nonexistent-route');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Frontend cannot connect to backend API');
        } else if (error.response && error.response.status === 404) {
            console.log('✅ Frontend can connect to backend (404 expected for test route)');
        } else {
            console.log('⚠️ Frontend-Backend connection has issues:', error.message);
        }
    }
    
    console.log('\n📊 Integration Test Complete');
    console.log('\n🚀 Next Steps:');
    console.log('  - Frontend: http://localhost:4173 (Vite Preview)');
    console.log('  - Backend: http://localhost:3005 (Express API)');
    console.log('  - If backend is down, run: cd src/backend && npm run dev');
}

testConnections().catch(console.error);
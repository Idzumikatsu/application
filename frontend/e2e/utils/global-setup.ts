import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global setup script that runs before all tests
 * This script prepares the test environment and ensures clean state
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for CRM E2E tests...');
  
  // Create test results directory
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
    console.log('✅ Created test-results directory');
  }

  // Create screenshots directory
  const screenshotsDir = path.join(testResultsDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log('✅ Created screenshots directory');
  }

  // Create videos directory
  const videosDir = path.join(testResultsDir, 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log('✅ Created videos directory');
  }

  // Create traces directory
  const tracesDir = path.join(testResultsDir, 'traces');
  if (!fs.existsSync(tracesDir)) {
    fs.mkdirSync(tracesDir, { recursive: true });
    console.log('✅ Created traces directory');
  }

  // Create reports directory
  const reportsDir = path.join(testResultsDir, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    console.log('✅ Created reports directory');
  }

  // Load environment variables from .env.test
  const envFile = path.join(process.cwd(), 'e2e', '.env.test');
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log('✅ Loaded environment variables from .env.test');
  }

  // Verify backend API is available
  const apiUrl = process.env.API_URL || 'http://localhost:8080/api';
  console.log(`🔍 Checking backend API at: ${apiUrl}`);
  
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 10000
    });
    
    if (response.ok) {
      console.log('✅ Backend API is available and healthy');
    } else {
      console.warn('⚠️ Backend API responded with non-200 status:', response.status);
    }
  } catch (error) {
    console.warn('⚠️ Backend API health check failed:', error.message);
    console.log('⚠️ Tests may fail if backend is not running');
  }

  // Verify frontend is available
  const frontendUrl = process.env.BASE_URL || 'http://localhost:3000';
  console.log(`🔍 Checking frontend at: ${frontendUrl}`);
  
  try {
    const response = await fetch(frontendUrl, {
      method: 'GET',
      timeout: 10000
    });
    
    if (response.ok) {
      console.log('✅ Frontend is available');
    } else {
      console.warn('⚠️ Frontend responded with non-200 status:', response.status);
    }
  } catch (error) {
    console.warn('⚠️ Frontend health check failed:', error.message);
    console.log('⚠️ Tests may fail if frontend is not running');
  }

  // Create test data summary
  const testDataSummary = {
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: process.env.BASE_URL,
      apiUrl: process.env.API_URL,
      headless: process.env.HEADLESS,
      slowMo: process.env.SLOW_MO
    },
    testUsers: {
      admin: process.env.TEST_ADMIN_EMAIL,
      manager: process.env.TEST_MANAGER_EMAIL,
      teacher: process.env.TEST_TEACHER_EMAIL
    },
    testConfiguration: {
      timeout: process.env.TIMEOUT,
      retries: process.env.RETRIES,
      workers: process.env.WORKERS
    }
  };

  fs.writeFileSync(
    path.join(testResultsDir, 'test-environment.json'),
    JSON.stringify(testDataSummary, null, 2)
  );

  console.log('✅ Test environment configuration saved');
  console.log('📋 Test Environment Summary:');
  console.log(`   - Base URL: ${testDataSummary.environment.baseUrl}`);
  console.log(`   - API URL: ${testDataSummary.environment.apiUrl}`);
  console.log(`   - Headless: ${testDataSummary.environment.headless}`);
  console.log(`   - Admin User: ${testDataSummary.testUsers.admin}`);
  console.log(`   - Manager User: ${testDataSummary.testUsers.manager}`);
  console.log(`   - Teacher User: ${testDataSummary.testUsers.teacher}`);

  console.log('🎉 Global setup completed successfully!');
  console.log('========================================');
}

export default globalSetup;
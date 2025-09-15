import { FullConfig, FullResult } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global teardown script that runs after all tests
 * This script cleans up test artifacts and generates final reports
 */

async function globalTeardown(config: FullConfig, result: FullResult) {
  console.log('🧹 Starting global teardown for CRM E2E tests...');
  
  const testResultsDir = path.join(process.cwd(), 'test-results');
  
  // Generate final test summary
  const testSummary = {
    timestamp: new Date().toISOString(),
    status: result.status,
    startTime: config.metadata.startTime,
    duration: Date.now() - config.metadata.startTime.getTime(),
    totalTests: result.tests.length,
    passedTests: result.tests.filter(t => t.status === 'passed').length,
    failedTests: result.tests.filter(t => t.status === 'failed').length,
    skippedTests: result.tests.filter(t => t.status === 'skipped').length,
    environment: {
      baseUrl: config.projects[0]?.use.baseURL,
      workers: config.workers,
      timeout: config.timeout
    }
  };

  // Save final summary
  fs.writeFileSync(
    path.join(testResultsDir, 'final-summary.json'),
    JSON.stringify(testSummary, null, 2)
  );

  console.log('✅ Final test summary saved');
  
  // Calculate and display test statistics
  const passRate = ((testSummary.passedTests / testSummary.totalTests) * 100).toFixed(1);
  const failureRate = ((testSummary.failedTests / testSummary.totalTests) * 100).toFixed(1);
  
  console.log('📊 FINAL TEST RESULTS:');
  console.log('======================');
  console.log(`Total tests: ${testSummary.totalTests}`);
  console.log(`Passed: ${testSummary.passedTests} (${passRate}%)`);
  console.log(`Failed: ${testSummary.failedTests} (${failureRate}%)`);
  console.log(`Skipped: ${testSummary.skippedTests}`);
  console.log(`Duration: ${formatDuration(testSummary.duration)}`);
  console.log(`Status: ${testSummary.status.toUpperCase()}`);

  // Clean up old test artifacts (optional - keep for debugging)
  if (process.env.CLEANUP_TEST_ARTIFACTS === 'true') {
    console.log('🧹 Cleaning up test artifacts...');
    
    const artifactsToKeep = [
      'final-summary.json',
      'test-environment.json',
      'reports/',
      'html-report/'
    ];
    
    const cleanUpDir = (dirPath: string) => {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        items.forEach(item => {
          const fullPath = path.join(dirPath, item);
          const relativePath = path.relative(testResultsDir, fullPath);
          
          if (!artifactsToKeep.some(keep => relativePath.startsWith(keep))) {
            if (fs.statSync(fullPath).isDirectory()) {
              fs.rmSync(fullPath, { recursive: true });
            } else {
              fs.unlinkSync(fullPath);
            }
          }
        });
      }
    };
    
    cleanUpDir(testResultsDir);
    console.log('✅ Test artifacts cleaned up');
  }

  // Generate performance report
  const performanceReport = {
    averageTestDuration: calculateAverageDuration(result.tests),
    slowestTests: getSlowestTests(result.tests, 5),
    fastestTests: getFastestTests(result.tests, 5),
    flakyTests: result.tests.filter(t => t.retry && t.retry > 0).length
  };

  fs.writeFileSync(
    path.join(testResultsDir, 'performance-report.json'),
    JSON.stringify(performanceReport, null, 2)
  );

  console.log('✅ Performance report saved');

  // Generate CI/CD friendly output
  if (process.env.CI) {
    console.log('::set-output name=total_tests::' + testSummary.totalTests);
    console.log('::set-output name=passed_tests::' + testSummary.passedTests);
    console.log('::set-output name=failed_tests::' + testSummary.failedTests);
    console.log('::set-output name=pass_rate::' + passRate);
    console.log('::set-output name=status::' + testSummary.status);
  }

  console.log('🎉 Global teardown completed successfully!');
  console.log('===========================================');
  
  // Exit with appropriate code for CI
  if (process.env.CI && testSummary.failedTests > 0) {
    process.exit(1);
  }
}

function calculateAverageDuration(tests: any[]): number {
  const totalDuration = tests.reduce((sum, test) => sum + (test.duration || 0), 0);
  return tests.length > 0 ? totalDuration / tests.length : 0;
}

function getSlowestTests(tests: any[], count: number): any[] {
  return tests
    .filter(t => t.duration)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, count)
    .map(t => ({ title: t.title, duration: t.duration }));
}

function getFastestTests(tests: any[], count: number): any[] {
  return tests
    .filter(t => t.duration && t.duration > 0)
    .sort((a, b) => a.duration - b.duration)
    .slice(0, count)
    .map(t => ({ title: t.title, duration: t.duration }));
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
}

export default globalTeardown;
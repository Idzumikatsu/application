import { Reporter, TestCase, TestResult, TestStep, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom reporter for generating detailed test reports with coverage metrics
 */

interface TestCoverage {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
}

interface RoleCoverage {
  [role: string]: {
    total: number;
    passed: number;
    functionalAreas: { [area: string]: number };
  };
}

interface FunctionalCoverage {
  [area: string]: {
    total: number;
    passed: number;
    tests: string[];
  };
}

class CustomReporter implements Reporter {
  private coverage: TestCoverage = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0
  };

  private roleCoverage: RoleCoverage = {};
  private functionalCoverage: FunctionalCoverage = {};
  private testDetails: Array<{
    title: string;
    outcome: string;
    duration: number;
    role?: string;
    functionalArea?: string;
    errors?: string[];
  }> = [];

  private startTime: number = Date.now();

  onBegin() {
    console.log('🚀 Starting Playwright test run with custom reporter...');
    this.initializeCoverageStructures();
  }

  onTestBegin(test: TestCase) {
    this.coverage.total++;
    
    // Extract role and functional area from test title
    const { role, functionalArea } = this.parseTestMetadata(test.title);
    
    if (role) {
      if (!this.roleCoverage[role]) {
        this.roleCoverage[role] = { total: 0, passed: 0, functionalAreas: {} };
      }
      this.roleCoverage[role].total++;
    }

    if (functionalArea) {
      if (!this.functionalCoverage[functionalArea]) {
        this.functionalCoverage[functionalArea] = { total: 0, passed: 0, tests: [] };
      }
      this.functionalCoverage[functionalArea].total++;
      this.functionalCoverage[functionalArea].tests.push(test.title);
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const { role, functionalArea } = this.parseTestMetadata(test.title);
    const status = result.status;
    const duration = result.duration;

    // Update coverage counts
    if (status === 'passed') {
      this.coverage.passed++;
      if (role) this.roleCoverage[role].passed++;
      if (functionalArea) this.functionalCoverage[functionalArea].passed++;
    } else if (status === 'failed') {
      this.coverage.failed++;
    } else if (status === 'skipped') {
      this.coverage.skipped++;
    }

    if (result.retry && result.retry > 0) {
      this.coverage.flaky++;
    }

    // Store test details
    this.testDetails.push({
      title: test.title,
      outcome: status,
      duration,
      role,
      functionalArea,
      errors: result.errors?.map(e => e.message!).filter(Boolean) || []
    });
  }

  onEnd(result: FullResult) {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    console.log('✅ Test run completed!');
    console.log(`⏱️  Total duration: ${this.formatDuration(totalDuration)}`);
    
    this.generateReports();
    this.printSummary();
  }

  private initializeCoverageStructures() {
    // Predefine functional areas based on our test plan
    const functionalAreas = [
      'authentication',
      'student_management',
      'teacher_management',
      'lesson_scheduling',
      'package_management',
      'calendar_integration',
      'notifications',
      'reporting',
      'role_based_access'
    ];

    functionalAreas.forEach(area => {
      this.functionalCoverage[area] = { total: 0, passed: 0, tests: [] };
    });

    // Predefine roles
    const roles = ['ADMIN', 'MANAGER', 'TEACHER'];
    roles.forEach(role => {
      this.roleCoverage[role] = { total: 0, passed: 0, functionalAreas: {} };
    });
  }

  private parseTestMetadata(title: string): { role?: string; functionalArea?: string } {
    const metadata: { role?: string; functionalArea?: string } = {};
    
    // Extract role from test title (e.g., "[MANAGER] Test name")
    const roleMatch = title.match(/\[(ADMIN|MANAGER|TEACHER)\]/i);
    if (roleMatch) {
      metadata.role = roleMatch[1].toUpperCase();
    }
    
    // Extract functional area from test file path or title
    const areaMatch = title.match(/(auth|student|teacher|lesson|package|calendar|notification|report|role)/i);
    if (areaMatch) {
      const area = areaMatch[1].toLowerCase();
      if (area === 'auth') metadata.functionalArea = 'authentication';
      else if (area === 'student') metadata.functionalArea = 'student_management';
      else if (area === 'teacher') metadata.functionalArea = 'teacher_management';
      else if (area === 'lesson') metadata.functionalArea = 'lesson_scheduling';
      else if (area === 'package') metadata.functionalArea = 'package_management';
      else if (area === 'calendar') metadata.functionalArea = 'calendar_integration';
      else if (area === 'notification') metadata.functionalArea = 'notifications';
      else if (area === 'report') metadata.functionalArea = 'reporting';
      else if (area === 'role') metadata.functionalArea = 'role_based_access';
    }
    
    return metadata;
  }

  private generateReports() {
    this.generateMarkdownReport();
    this.generateJsonReport();
    this.generateHtmlReport();
  }

  private generateMarkdownReport() {
    const reportDir = path.join(process.cwd(), 'test-results', 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const markdownContent = this.buildMarkdownContent();
    fs.writeFileSync(path.join(reportDir, 'test-coverage.md'), markdownContent);
  }

  private generateJsonReport() {
    const reportDir = path.join(process.cwd(), 'test-results', 'reports');
    const jsonContent = JSON.stringify({
      coverage: this.coverage,
      roleCoverage: this.roleCoverage,
      functionalCoverage: this.functionalCoverage,
      testDetails: this.testDetails,
      timestamp: new Date().toISOString()
    }, null, 2);

    fs.writeFileSync(path.join(reportDir, 'detailed-report.json'), jsonContent);
  }

  private generateHtmlReport() {
    // Basic HTML report - can be enhanced with charts and graphs
    const reportDir = path.join(process.cwd(), 'test-results', 'reports');
    const htmlContent = this.buildHtmlContent();
    fs.writeFileSync(path.join(reportDir, 'coverage-dashboard.html'), htmlContent);
  }

  private buildMarkdownContent(): string {
    const passRate = ((this.coverage.passed / this.coverage.total) * 100).toFixed(1);
    const functionalCoverageRate = this.calculateFunctionalCoverageRate();
    
    return `# Test Coverage Report

## 📊 Summary
- **Total Tests**: ${this.coverage.total}
- **Passed**: ${this.coverage.passed} (${passRate}%)
- **Failed**: ${this.coverage.failed}
- **Skipped**: ${this.coverage.skipped}
- **Flaky**: ${this.coverage.flaky}
- **Functional Coverage**: ${functionalCoverageRate}%

## 👥 Role-based Coverage
${this.buildRoleCoverageTable()}

## 🎯 Functional Area Coverage
${this.buildFunctionalCoverageTable()}

## ⚡ Performance Metrics
- **Average Test Duration**: ${this.formatDuration(this.calculateAverageDuration())}
- **Total Run Time**: ${this.formatDuration(Date.now() - this.startTime)}

## 📋 Test Details
${this.buildTestDetailsTable()}

---

*Report generated at: ${new Date().toISOString()}*
`;
  }

  private buildHtmlContent(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>CRM Test Coverage Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .metric { background: #f5f5f5; padding: 20px; margin: 10px; border-radius: 5px; }
        .coverage-table { width: 100%; border-collapse: collapse; }
        .coverage-table th, .coverage-table td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        .passed { color: green; }
        .failed { color: red; }
        .coverage-bar { background: #e0e0e0; height: 20px; border-radius: 10px; }
        .coverage-fill { background: #4caf50; height: 100%; border-radius: 10px; }
    </style>
</head>
<body>
    <h1>CRM System Test Coverage Dashboard</h1>
    <div class="metric">
        <h2>Overall Coverage: ${((this.coverage.passed / this.coverage.total) * 100).toFixed(1)}%</h2>
    </div>
    <!-- More HTML content would go here -->
</body>
</html>`;
  }

  private buildRoleCoverageTable(): string {
    let table = '| Role | Total Tests | Passed | Coverage |\n';
    table += '|------|------------|--------|----------|\n';
    
    Object.entries(this.roleCoverage).forEach(([role, stats]) => {
      const coverage = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0.0';
      table += `| ${role} | ${stats.total} | ${stats.passed} | ${coverage}% |\n`;
    });
    
    return table;
  }

  private buildFunctionalCoverageTable(): string {
    let table = '| Functional Area | Total Tests | Passed | Coverage |\n';
    table += '|---------------|------------|--------|----------|\n';
    
    Object.entries(this.functionalCoverage).forEach(([area, stats]) => {
      if (stats.total > 0) {
        const coverage = ((stats.passed / stats.total) * 100).toFixed(1);
        table += `| ${area.replace('_', ' ').toUpperCase()} | ${stats.total} | ${stats.passed} | ${coverage}% |\n`;
      }
    });
    
    return table;
  }

  private buildTestDetailsTable(): string {
    let table = '| Test | Outcome | Duration | Role | Functional Area |\n';
    table += '|------|---------|----------|------|----------------|\n';
    
    this.testDetails.forEach(test => {
      const outcomeEmoji = test.outcome === 'passed' ? '✅' : test.outcome === 'failed' ? '❌' : '⏭️';
      table += `| ${test.title} | ${outcomeEmoji} | ${this.formatDuration(test.duration)} | ${test.role || '-'} | ${test.functionalArea || '-'} |\n`;
    });
    
    return table;
  }

  private calculateFunctionalCoverageRate(): number {
    const coveredAreas = Object.values(this.functionalCoverage).filter(area => area.total > 0).length;
    const totalAreas = Object.keys(this.functionalCoverage).length;
    return Math.round((coveredAreas / totalAreas) * 100);
  }

  private calculateAverageDuration(): number {
    const totalDuration = this.testDetails.reduce((sum, test) => sum + test.duration, 0);
    return this.testDetails.length > 0 ? totalDuration / this.testDetails.length : 0;
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
  }

  private printSummary() {
    console.log('\n📈 TEST COVERAGE SUMMARY');
    console.log('=======================');
    console.log(`Total tests: ${this.coverage.total}`);
    console.log(`Passed: ${this.coverage.passed} (${((this.coverage.passed / this.coverage.total) * 100).toFixed(1)}%)`);
    console.log(`Failed: ${this.coverage.failed}`);
    console.log(`Skipped: ${this.coverage.skipped}`);
    console.log(`Flaky: ${this.coverage.flaky}`);
    
    console.log('\n👥 ROLE COVERAGE:');
    Object.entries(this.roleCoverage).forEach(([role, stats]) => {
      if (stats.total > 0) {
        const coverage = (stats.passed / stats.total) * 100;
        console.log(`  ${role}: ${stats.passed}/${stats.total} (${coverage.toFixed(1)}%)`);
      }
    });
  }
}

export default CustomReporter;
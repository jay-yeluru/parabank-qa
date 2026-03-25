const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { execSync } = require('child_process');
const { Resend } = require('resend');

async function sendEmail() {
  // Check for CI and required secrets first
  const IS_CI = !!process.env.GITHUB_ACTIONS;
  const API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_TO = process.env.EMAIL_TO;
  const REPO = process.env.GITHUB_REPOSITORY;
  const TEST_ENV = process.env.TEST_ENV || 'LIVE';

  if (!API_KEY || !EMAIL_TO) {
    const errorMsg = 'Missing RESEND_API_KEY or EMAIL_TO. Skipping email.';
    if (IS_CI) {
      throw new Error(errorMsg);
    } else {
      console.log(errorMsg);
      return;
    }
  }

  // 1. Generate Allure Single File Report
  const allureResultsPaths = [
    path.resolve('allure-results'),
    path.resolve('playwright-results/allure-results'),
    path.resolve('manual-playwright-results/allure-results'),
  ];
  const allureResultsDir = allureResultsPaths.find(p => fs.existsSync(p));

  const standaloneReportDir = path.resolve('allure-report-standalone');
  const reportFile = path.join(standaloneReportDir, 'index.html');

  if (allureResultsDir) {
    console.log(`Generating Allure single HTML report from: ${allureResultsDir}`);
    try {
      if (!fs.existsSync(standaloneReportDir)) {
        fs.mkdirSync(standaloneReportDir, { recursive: true });
      }
      // Using "allure awesome" report which provides better bundling and looks for single-file HTML reports in Allure 3.x
      execSync(`npx allure awesome ${allureResultsDir} --single-file --output ${standaloneReportDir}`, { stdio: 'inherit' });
      console.log('Allure single file report generated successfully.');
    } catch (error) {
      console.warn('Allure report generation failed. Proceeding without attachment.', error.message);
    }
  }

  // 2. Prepare Attachment
  let attachments = [];
  if (fs.existsSync(reportFile)) {
    attachments.push({
      filename: `allure-report-${TEST_ENV.toLowerCase()}.html`,
      content: fs.readFileSync(reportFile),
    });
    console.log('Allure report added as attachment.');
  }

  // 3. Look for Playwright report.json
  const reportPaths = [
    path.resolve('test-results/report.json'),
    path.resolve('report.json'),
    path.resolve('playwright-results/test-results/report.json'),
    path.resolve('manual-playwright-results/test-results/report.json'),
  ];
  
  let resultsPath = reportPaths.find(p => fs.existsSync(p));

  if (!resultsPath) {
    throw new Error('Could not find report.json in any expected paths.');
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const stats = { total: 0, passed: 0, failed: 0, flaky: 0, failures: [] };

  function walk(suite) {
    for (const childSuite of suite.suites || []) {
      walk(childSuite);
    }
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        stats.total++;
        const lastResult = test.results.at(-1);
        const status = lastResult?.status;

        if (status === 'passed' || status === 'expected') {
          stats.passed++;
        } else if (status === 'flaky') {
          stats.flaky++;
          stats.passed++; // Flaky is technically a pass in final stats
        } else {
          stats.failed++;
          stats.failures.push({
            title: spec.title,
            file: spec.file,
          });
        }
      }
    }
  }

  for (const suite of results.suites || []) {
    walk(suite);
  }

  const status = stats.failed > 0 ? 'FAILED' : 'PASSED';
  const color = stats.failed > 0 ? '#ef4444' : '#22c55e'; // Red or Green

  const [owner, repo] = (REPO || 'jay-yeluru/parabank-qa').split('/');
  const pagesUrl = `https://${owner.toLowerCase()}.github.io/${repo.toLowerCase()}/`;

  const failureListHtml = stats.failures.length
    ? `<ul>${stats.failures.slice(0, 10).map((f) => `<li>${f.title} <small>(${f.file})</small></li>`).join('')}${stats.failures.length > 10 ? '<li>...and more.</li>' : ''}</ul>`
    : '<p>None</p>';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${color}; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Playwright Test Report</h1>
        <p style="margin: 5px 0 0;">Result: <strong>${status}</strong> | Env: <strong>${TEST_ENV.toUpperCase()}</strong></p>
      </div>
      <div style="padding: 20px; color: #333;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;"><strong>Total Tests:</strong></td>
            <td style="text-align: right; padding: 10px 0;">${stats.total}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;"><strong>Passed:</strong></td>
            <td style="text-align: right; padding: 10px 0; color: #22c55e;">${stats.passed}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;"><strong>Failed:</strong></td>
            <td style="text-align: right; padding: 10px 0; color: #ef4444;">${stats.failed}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0;"><strong>Flaky:</strong></td>
            <td style="text-align: right; padding: 10px 0; color: #f59e0b;">${stats.flaky}</td>
          </tr>
        </table>

        <h3 style="margin-top: 10px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Failed Tests:</h3>
        ${failureListHtml}

        <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 6px; text-align: center;">
          <a href="${pagesUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Interactive History</a>
          <p style="margin-top: 15px; color: #666; font-size: 12px;">The full Allure single-file report is attached to this email.</p>
        </div>
      </div>
    </div>
  `;

  // 4. Send via Resend
  console.log(`Sending email via Resend to ${EMAIL_TO}...`);
  const resend = new Resend(API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'ParaBank QA <onboarding@resend.dev>',
    to: EMAIL_TO,
    subject: `[ParaBank QA] ${status} — ${stats.passed}/${stats.total} passed`,
    html: html,
    attachments: attachments,
  });

  if (error) {
    console.error('Resend API Error:', error);
    process.exit(1);
  }

  console.log('Email sent successfully via Resend. ID:', data.id);
}

sendEmail().catch((err) => {
  console.error('FINAL ERROR:', err.message);
  process.exit(1);
});

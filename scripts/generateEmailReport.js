const fs = require('fs');
const path = require('path');

async function sendEmail() {
  // Check for CI and required secrets first
  const IS_CI = !!process.env.GITHUB_ACTIONS;
  const API_KEY = process.env.SENDGRID_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM;
  const EMAIL_TO = process.env.EMAIL_TO;
  const REPO = process.env.GITHUB_REPOSITORY;

  if (!API_KEY || !EMAIL_FROM || !EMAIL_TO) {
    const errorMsg = 'Missing SENDGRID_API_KEY, EMAIL_FROM, or EMAIL_TO. Skipping email.';
    if (IS_CI) {
      throw new Error(errorMsg); // Fail the job in CI if secrets are missing
    } else {
      console.log(errorMsg);
      return;
    }
  }

  // Look for report in multiple common locations
  const reportPaths = [
    path.resolve('test-results/report.json'),
    path.resolve('report.json'),
    path.resolve('playwright-results/test-results/report.json'),
  ];
  
  let resultsPath = reportPaths.find(p => fs.existsSync(p));

  if (!resultsPath) {
    console.error('Available files:', fs.readdirSync(process.cwd(), { recursive: true }));
    throw new Error('Could not find report.json in any of the expected paths.');
  }

  console.log(`Using report from: ${resultsPath}`);
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

  const stats = { total: 0, passed: 0, failed: 0, flaky: 0, failures: [] };

  for (const suite of results.suites || []) {
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

  // Dynamically constructed GitHub Pages URL
  const [owner, repo] = (REPO || 'unknown/unknown').split('/');
  const pagesUrl = `https://${owner}.github.io/${repo}/`;

  const failureList = stats.failures.length
    ? stats.failures.slice(0, 10).map((f) => `• ${f.title} (${f.file})`).join('\n') + (stats.failures.length > 10 ? '\n...and more.' : '')
    : 'None';

  const body = `
Playwright Test Run Summary
============================
Total:  ${stats.total}
Passed: ${stats.passed}
Failed: ${stats.failed}
Flaky:  ${stats.flaky}

Failed tests:
${failureList}

Full Interactive Allure Report & History:
${pagesUrl}
  `.trim();

  // SendGrid
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: EMAIL_TO }] }],
      from: { email: EMAIL_FROM },
      subject: `[${process.env.TEST_ENV || 'LIVE'}] Playwright Report — ${stats.failed > 0 ? 'FAILED' : 'PASSED'} (${stats.passed}/${stats.total})`,
      content: [{ type: 'text/plain', value: body }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Email send failed:', err);
    process.exit(1);
  }

  console.log('Email sent successfully');
}

sendEmail().catch((err) => {
  console.error('FINAL ERROR:', err.message);
  process.exit(1);
});

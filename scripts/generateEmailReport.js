const fs = require('fs');
const path = require('path');

async function sendEmail() {
  const resultsPath = path.resolve('test-results/report.json');
  
  if (!fs.existsSync(resultsPath)) {
    console.error('Report file not found. Skipping email.');
    process.exit(0);
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

  const stats = { total: 0, passed: 0, failed: 0, flaky: 0, failures: [] };

  for (const suite of results.suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        stats.total++;
        const status = test.results[0]?.status;
        const lastStatus = test.results.at(-1)?.status;

        if (status === 'failed' && lastStatus === 'passed') {
          stats.flaky++;
        } else if (lastStatus === 'passed' || lastStatus === 'expected') {
          stats.passed++;
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
  const repoName = process.env.GITHUB_REPOSITORY; // e.g., "jay-yeluru/parabank-qa"
  const [owner, repo] = repoName.split('/');
  const pagesUrl = `https://${owner}.github.io/${repo}/`;

  const failureList = stats.failures.length
    ? stats.failures.map(f => `• ${f.title} (${f.file})`).join('\n')
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

Full Interactive HTML Report & Screenshots:
${pagesUrl}
  `.trim();

  // SendGrid
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Skipping email. No SENDGRID_API_KEY provided.');
    return;
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: process.env.EMAIL_TO }] }],
      from: { email: process.env.EMAIL_FROM },
      subject: `Playwright Report — ${stats.failed > 0 ? 'FAILED' : 'PASSED'} (${stats.passed}/${stats.total})`,
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

sendEmail().catch(err => {
  console.error(err);
  process.exit(1);
});

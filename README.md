# ParaBank E2E Test Automation Framework

This project is a high-performance, modular, and maintainable end-to-end (E2E) test automation framework for the [ParaBank](https://parabank.parasoft.com/) application using **Playwright** with **JavaScript**.

## 🚀 Overview

The framework covers both UI and API test scenarios, ensuring the complete functional integrity of banking features including:

- User Registration & Authentication (with unique/random usernames)
- Account Management (Opening New Savings Accounts)
- Transaction Management (Fund Transfers & Bill Payments)
- Transaction History (API Search/Filtering by amount)

## 📁 Project Structure

```text
├── .github/workflows/    # CI/CD: Automated (push) and Manual (workflow_dispatch) pipelines
│   ├── playwright.yml     # Main trunk pipeline (Allure + Slack/Email)
│   └── manual-tests.yml   # Ad-hoc runs with environment/suite selectors
├── configs/              # Infrastructure Configuration
│   ├── environment.js     # Dispatcher for active test tier
│   ├── env.stage.js       # Staging environment URLs and settings
│   ├── env.beta.js        # Beta environment URLs and settings
│   └── env.prod.js        # Production environment credentials
├── data/                 # Tier-Specific Test Data
│   ├── default.json       # Common amounts, endpoints, and fallbacks
│   ├── stage.json         # Staging-specific overrides
│   └── beta.json          # Beta-specific overrides
├── fixtures/             # Playwright Dependency Injection
│   ├── core-fixtures.js   # Basic state and poManager instantiation
│   ├── context-fixtures.js # Complex states (registeredUser, savingsAccount)
│   ├── api-fixtures.js     # Authenticated API clients and test data
│   └── pom-fixture.js      # Main export aggregating all UI/API fixtures
├── pages/                # Page Object Models (POM) 
│   ├── LoginPage.js       # Auth and entry-point logic
│   ├── HomePage.js        # Global navigation and session state
│   ├── BillPayPage.js     # Transaction processing UI
│   └── ApiResponsePage.js  # Generic API response validation wrapper
├── scripts/              # Infrastructure Scripts
│   └── generateEmailReport.js # Allure Awesome -> Standalone HTML -> Resend Email
├── tests/                # Feature-based Test Suites
│   ├── api/               # REST API specs (Find Transactions, etc.)
│   ├── setup/             # Global Setup (Database Cleanup once per worker set)
│   └── ui/                # UI E2E specs (Auth, Transfer, Bill Pay)
├── utils/                # Shared Utilities & Logic
│   ├── TestDataManager.js # Tiered data loader (Constants -> Default -> Env)
│   ├── ApiClient.js       # REST services wrapper (Axios-like interface)
│   ├── constants.js       # Immutable app-level values and patterns
│   └── helpers.js         # Random data generators (Parallel-index unique users)
├── playwright.config.js  # Playwright Global Engine Config
└── package.json          # Scripts, dependencies, and formatting rules
```

## 🛠️ Key Features

- **Faker-Powered Data**: Integrated `@faker-js/faker` for generating realistic names, addresses, and phone numbers in every test run.
- **Robust Parallel Safety**: Custom logic ensures each parallel worker generates unique usernames using a combination of worker index and high-precision timestamps, preventing registration collisions.
- **Fixture-First Architecture**: Consolidates all dependencies (Core, UI Context, and API) into a single, unified fixture system in `pom-fixture.js`.
- **Intelligent Reporting**: 
  - **Allure Awesome**: Provides standard-compliant, standalone HTML reports.
  - **Size-Aware Emailing**: The email reporting script automatically handles large reports (e.g., those with many screenshots/videos) by skipping attachments that exceed 20MB, ensuring critical test status emails are always delivered with links to interactive dashboards.
- **Rich Visualization**: Uses `test.step` within fixtures for detailed setup traceability in Allure reports.

## 🏗️ Implementation Architecture

### 1. Multi-Tier Environment System
The framework uses a dual-folder strategy for environment steering:
*   **[`/configs`](file:///Users/jay/learn/automation/parabank-qa/configs/)**: Stores infrastructure-level settings like `baseUrl` and secure `credentials`.
*   **[`/data`](file:///Users/jay/learn/automation/parabank-qa/data/)**: Stores business-logic parameters like `transferAmount` and `billAmount` in JSON.
*   **`TEST_ENV`**: An environment variable controls the active tier (defaults to `stage`).

### 2. "Fixture-First" Logic
Complex setups (registration, login, account creation) are handled by custom fixtures like `registeredUser` and `savingsAccount`. This allows tests to be 100% independent and inherently parallel-ready.

### 3. Allure Reporting
Page Object methods are wrapped in `test.step` blocks. In the Allure dashboard, this translates to clear, business-focused steps instead of raw Playwright commands.

## 🏁 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- `npm install`

### Run Tests by Tier

- **Staging (Default)**: `npm run test:stage`
- **Beta**: `npm run test:beta`
- **Production**: `TEST_ENV=prod npx playwright test`

### Other Run Options

- **All Tests**: `npm test`
- **UI Only**: `npm run test:ui`
- **API Only**: `npm run test:api`
- **Serial Mode**: `npm run test:serial`
- **Headed/Debug**: `npm run test:headed` | `npm run test:debug`

### View Reports

- **Playwright HTML**: `npm run test:report`
- **Allure Open**: `npx allure open allure-report` (requires allure-commandline)

### Code Formatting
- `npm run format`: Formats all files according to `.prettierrc`.

## 📧 CI/CD & Email Setup

### GitHub Actions
The pipeline is configured for:
- **Automatic Execution**: Runs on every `push` to `main`.
- **Manual Execution**: Use the **Actions** tab to run the `Manual Playwright Tests`. You can select the **Test Suite** (`all`, `ui`, `api`) and **Environment Tier** (`stage`, `beta`, `prod`) from the UI.

### Secrets Configuration
Configure these in GitHub Settings -> Secrets and variables -> Actions:
- `BASE_URL`: The default ParaBank URL.
- `RESEND_API_KEY`: API key for email delivery via Resend.
- `EMAIL_TO`: Recipient email (must be your Resend account email for free tier).

## ⚖️ License

This project is for educational/demonstration purposes of E2E automation best practices.

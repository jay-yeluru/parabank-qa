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
├── .github/workflows/    # CI/CD: Automated and Manual pipelines
├── configs/              # Infrastructure Config (URLs, Credentials per tier)
├── data/                 # Tier-Specific Test Data (Amounts, Messages in JSON)
├── fixtures/             # Custom Playwright fixtures (POM, Context, API, and Core)
├── pages/                # Page Object Model (POM) classes with test.step integration
├── scripts/              # Helper scripts (Email reporting)
├── tests/                # Feature-based test suites (@ui, @api, @smoke, @transactions)
├── utils/                # Shared utilities (Data generation, API clients, Constants, Helpers)
├── playwright.config.js  # Playwright global configuration (Parallel, Allure, Traces)
└── package.json          # Project dependencies, scripts, and Prettier config
```

## 🛠️ Key Features

- **Tiered Environment Support**: Dispatcher system supports `stage`, `beta`, and `prod` with separate configs and data.
- **Page Object Model (POM)**: Encapsulates page logic and selectors, improving modularity and reusability.
- **Custom Fixtures**: Provides dependency injection for POMs and reusable test states (e.g., `registeredUser`).
- **Parallel Execution**: Configured with `fullyParallel: true`, enabling multi-worker independent test runs.
- **Rich Reporting & Allure**:
  - **Allure Reports**: Historical trends, nested categories, and clean execution steps using `test.step`.
  - **GitHub Pages**: Automated deployment of Allure reports with persistent cross-run history.
  - **Email Reports**: Stats and pass/fail notifications via **Resend**, featuring an **Allure Standalone HTML** attachment for full offline interactivity within the email.
- **Code Quality**: Prettier integration for consistent formatting across the team.

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

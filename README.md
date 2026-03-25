# ParaBank E2E Test Automation Framework

This project is a robust, modular, and maintainable end-to-end (E2E) test automation framework for the [ParaBank](https://parabank.parasoft.com/) application using **Playwright** with **JavaScript**.

## 🚀 Overview

The framework covers both UI and API test scenarios, ensuring the complete functional integrity of banking features including:

- User Registration & Authentication (with unique/random usernames)
- Account Management (Opening New Savings Accounts)
- Transaction Management (Fund Transfers & Bill Payments)
- Transaction History (API Search/Filtering by amount)

## 📁 Project Structure

```text
├── .github/workflows/    # CI/CD pipelines (GitHub Actions)
├── fixtures/             # Custom Playwright fixtures (POM, Context, API, and Core)
├── pages/                # Page Object Model (POM) classes managed by POManager
├── scripts/              # Helper scripts (Email reporting)
├── tests/                # Feature-based test suites
│   ├── api/              # API specific scenarios
│   └── ui/               # UI specific scenarios
├── utils/                # Shared utilities (Data generation, API clients, Constants, Helpers)
├── playwright.config.js  # Playwright global configuration (fullyParallel: true)
└── package.json          # Project dependencies and script shortcuts
```

## 🛠️ Key Features

- **Page Object Model (POM)**: Encapsulates page logic and selectors, improving modularity and reusability.
- **Custom Fixtures**: Provides dependency injection for POMs and reusable test states (e.g., `registeredUser`, `savingsAccount`).
- **Parallel Execution**: Configured with `fullyParallel: true` in `playwright.config.js`, enabling fast, independent test runs across multiple workers.
- **Dynamic Test Data**: Generates random and unique usernames, SSNs, and transaction details for every run.
- **CI/CD Integration**: Fully integrated with GitHub Actions.
- **Rich Reporting**:
  - Full HTML reporting with screenshots and logs on failure.
  - Automated Email Reports via SendGrid (Stats, Pass/Fail counts, Links to artifacts).
  - GitHub Pages deployment for persistent report history.

## 🏗️ Implementation Roadmap

The framework is built around a "Fixture-First" approach for maximum scalability:

1. **Page Object Models (POM)**:
   - UI logic and locators are encapsulated in `pages/` classes.
   - All POMs are accessed through a centralized `POManager` for clean test logic.

2. **Decoupled API Client**:
   - A custom `ApiClient` in `utils/` handles REST interactions.
   - API tests use specialized fixtures (`apiUserClient`) that function independently of UI state.

3. **Isolated State via Fixtures**:
   - Complex setups (registration, login, account creation) are handled by custom fixtures like `registeredUser` and `savingsAccount`.
   - This keeps individual test cases concise and inherently parallel-ready.

4. **Dynamic Data Management**:
   - **`TestDataManager`**: Generates unique, randomized data (names, SSNs, amounts) for every test run to prevent data collisions.
   - **`fullyParallel: true`**: Since tests manage their own state via fixtures, they run simultaneously across multiple CPU workers.

5. **CI/CD & Reporting**:
   - Integrated GitHub Actions with HTML reports, Playwright traces, and automated email notifications via SendGrid.

## 🏁 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- `npm install`

### Run Tests

- **All Tests (Parallel)**: `npm test`
- **UI Only**: `npm run test:ui`
- **API Only**: `npm run test:api`
- **Serial Mode**: `npm run test:serial`
- **Headed Mode**: `npm run test:headed`
- **Debug Mode**: `npm run test:debug`

### View Report

After execution:

- `npm run test:report`

## 📧 CI/CD & Email Setup

The GitHub Actions pipeline is configured for:

- **Automatic Execution**: Runs on every `push` or `pull_request` to the `main` branch.
- **Manual Execution**: Use the **Actions** tab in GitHub to run the `Manual Playwright Tests` workflow. This allows you to select a specific test suite (`all`, `ui`, or `api`) and target environment.

### Secrets Configuration

The pipeline requires the following **Secrets** to be configured in your repository:

- `BASE_URL`: The ParaBank URL (e.g., `https://parabank.parasoft.com`).
- `SENDGRID_API_KEY`: API key for email delivery.
- `EMAIL_FROM`: Sender email address.
- `EMAIL_TO`: Recipient email address.

## ⚖️ License

This project is for educational/demonstration purposes of E2E automation best practices.

# FinFlow

A banking operations **portfolio demo** built with Angular and TypeScript. Explore accounts, transactions, running ledger balances and downloadable reports through a responsive teal workspace.

All people, organisations and financial data are fictional. There is no real authentication, payment processing or banking connection.

## Run locally

```bash
npm ci
npm start
```

Open `http://localhost:4200`. Choose **Continue as demo user**, or use the pre-filled credentials: `demo@finflow.com` / `FinFlowDemo!`.

Use Node.js 22 for the checked-in CI workflow. Changes remain in memory while navigating and reset on reload or sign-out. Only the optional remembered demo email is written to browser storage. Passwords, signed-in sessions and financial data are never persisted.

Read the [complete application flow](docs/APPLICATION_FLOW.md) for every login method, route, component and financial state update.

## Explore

| Area           | Working interactions                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| Login          | Validated demo credentials, password visibility, direct demo entry                                     |
| Dashboard      | Derived balances, weekly September activity chart, account distribution, recent entries, quick actions |
| Accounts       | Search, type filter, creation with validation, account-specific ledger links                           |
| Transactions   | Search, account/type filters, pagination, validated debit and credit entry                             |
| General ledger | Account selection, date filtering, carried-forward balances, CSV export, browser print/PDF             |
| Reports        | Account balances, transaction register, income/expense summary, period selection, previews, CSV export |
| Settings       | Session preferences, workspace name, sample users and status, demo data reset                          |

English copy, EUR formatting (`en-IE`), unambiguous dates and fictional company names make the demo easy to review internationally. This is a presentation choice, not a claim of European regulatory compliance.

## Engineering decisions

- **Feature boundaries:** each routed page lives under `features/`; the navigation shell, reusable UI and domain logic have separate homes.
- **Strict TypeScript and Angular templates:** typed reactive forms, readonly domain models, lazy routes and `OnPush` components.
- **One source of financial state:** `BankingStore` owns accounts and transactions. Signal-derived totals keep views consistent without duplicating balances in components.
- **Integer money:** amounts are stored as cents. Decimal input is parsed into minor units directly; floating-point values are used only for display/export.
- **Explicit accounting rules:** debit increases asset/expense balances; credit increases liability/income balances. Period ledgers include earlier transactions in the opening balance.
- **Proportionate state management:** injectable signal stores fit this small, synchronous demo. A production API can replace the in-memory boundary without placing persistence logic in templates.
- **Accessible interactions:** labelled inputs, visible focus states, skip navigation, semantic tables, empty states, native modal focus handling, reduced-motion support and textual chart data. Formal accessibility certification is not claimed.
- **Safer exports:** CSV fields are quoted and user-provided spreadsheet formula prefixes are neutralised.

```text
src/app/
  core/       Domain models, sample data, state, demo session, CSV export
  features/   Login, dashboard, accounts, transactions, ledger, reports, settings
  layout/     Responsive application shell
  shared/     Brand, money formatting, modal, financial chart
e2e/          Desktop and mobile workflow tests
```

## Quality checks

```bash
npm run format:check
npm run typecheck
npm run test:ci
npm run build
npx playwright install chromium
npm run test:e2e
```

Unit tests use ChromeHeadless. Set `CHROME_BIN` if Chrome is not on a standard path. Browser tests use Playwright Chromium by default; set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome. The browser suite starts a local development server on port 4300 and reuses it outside CI.

Tests cover currency precision, normal account balances, date ordering, invalid inputs, duplicate account names, CSV escaping, filtered-ledger opening balances, account/transaction reconciliation, report cancellation/export, session preferences, mobile overflow and keyboard dismissal. Browser screenshots and traces are generated under ignored `test-results/`.

The GitHub Actions workflow runs formatting, type checks, unit tests, production compilation and both browser viewport suites. The workflow is provided for future pushes; it has not been executed on GitHub from this workspace.

## Boundaries and publication notes

This is a **single-entry operations simulation**, not a double-entry accounting engine. Reports are not audited statements or a balanced trial balance. Roles are illustrative; they do not enforce access control. Email preferences do not send messages. Report previews reflect the current in-memory data, not immutable accounting snapshots. Print/PDF uses the browser print dialog.

The existing Angular 19 dependency tree has **31 npm audit findings** (2 low, 13 moderate, 15 high, 1 critical), checked on 29 September 2026. Compatible `npm audit fix` did not resolve them; the proposed fixes include a major Angular upgrade. The critical finding is in the development dependency `tar`. A reviewed framework/toolchain upgrade and another audit are required before treating this as production-ready. No forced major dependency changes were applied.

Production banking would additionally require server-side authentication and authorisation, persistent storage, double-entry journals, audit trails, transactional consistency and operational security review. Those are outside this frontend demo.

For a portfolio walkthrough and accurate project copy, see [docs/portfolio.md](docs/portfolio.md).

# Presenting FinFlow

## Project description

FinFlow is an Angular banking operations portfolio project with a responsive interface for managing sample accounts, recording transactions and exploring financial reports. It demonstrates feature-based architecture, typed reactive forms, signal-based state management, integer-cent calculations and automated browser testing.

## Suggested LinkedIn post

FinFlow — a banking operations dashboard built with Angular and TypeScript.

The focus is on the engineering behind the interface: consistent financial state across pages, predictable debit/credit calculations, accessible forms, useful validation and tests for complete user journeys.

The demo includes account creation, transaction recording, date-filtered ledgers, report previews and CSV downloads. It uses fictional EUR data and runs entirely as a frontend demonstration.

Technical decisions and limitations are documented in the repository. Feedback on the architecture, accessibility and user experience is welcome.

Add the public repository and deployed demo links only once available. Do not describe the demo as a live banking product or claim experience you do not have.

## Three-minute walkthrough

1. Enter through the login demo and show the dashboard totals and chart data.
2. Create a new asset account with a €100.00 opening balance.
3. Record a €0.29 debit. Open its ledger and show the €100.29 closing balance.
4. Filter the operating account ledger by date and explain why earlier activity contributes to the opening balance.
5. Generate a report and download its CSV. Show the mobile navigation and keyboard-dismissable dialog.
6. Open the domain tests and explain integer cents, normal balances and the single-entry limitation.

## Repository discussion points

- Why signal stores are sufficient for the current scope.
- Why business calculations belong outside page templates.
- Why frontend route guards are navigation controls, not security boundaries.
- What would change with a real backend and double-entry journal.
- What the tests prove, and what requires further accessibility, security and production review.

The strongest presentation is an honest account of decisions and tradeoffs. Years of experience are not a code-quality metric; the repository should make your judgment visible.

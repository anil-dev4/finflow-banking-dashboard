import { expect, Page, test } from '@playwright/test';

async function enterDemo(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Continue as demo user' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
}

async function navigate(page: Page, name: string): Promise<void> {
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
}

test('demo entry is responsive and has no runtime exceptions', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('login.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('new account and transaction reconcile with the ledger', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Accounts');
  await page.getByRole('button', { name: 'New account' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Account name').fill('Travel fund');
  await dialog.getByLabel('Opening balance').fill('100.00');
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Travel fund' })).toContainText('€100.00');
  await navigate(page, 'Transactions');
  await page.getByRole('button', { name: 'New transaction' }).click();
  await dialog
    .getByRole('combobox', { name: 'Account', exact: true })
    .selectOption({ label: 'Travel fund' });
  await dialog.getByLabel('Amount').fill('0.29');
  await dialog.getByLabel('Description').fill('Rounding-safe entry');
  await dialog.getByRole('button', { name: 'Record transaction', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Rounding-safe entry' })).toContainText(
    '€0.29',
  );
  await navigate(page, 'General ledger');
  await page
    .getByRole('combobox', { name: 'Account', exact: true })
    .selectOption({ label: '5003 · Travel fund' });
  await expect(page.locator('.stat').filter({ hasText: 'Closing balance' })).toContainText(
    '€100.29',
  );
  await expect(page.getByRole('row').filter({ hasText: 'Rounding-safe entry' })).toContainText(
    '€100.29',
  );
});

test('reports export and cancellation preserves the generated report', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Reports');
  await page
    .locator('.report-card')
    .filter({ hasText: 'Account balances' })
    .getByRole('button')
    .click();
  await page.getByRole('dialog').getByRole('button', { name: 'Generate report' }).click();
  await expect(page.locator('.report-preview')).toContainText('Operating account');
  await page
    .locator('.report-card')
    .filter({ hasText: 'Income & expenses' })
    .getByRole('button')
    .click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('.report-preview')).toContainText('Account balances');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('finflow-balances.csv');
  expect(await download.failure()).toBeNull();
});

test('workspace preferences and team members survive navigation', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');
  await page.getByLabel('Workspace name').fill('Northstar Finance');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await page.getByRole('button', { name: 'User management' }).click();
  await page.getByRole('button', { name: 'Add user', exact: false }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Full name').fill('Taylor Demo');
  await dialog.getByLabel('Email address').fill('taylor@example.com');
  await dialog.getByRole('button', { name: 'Add demo user', exact: true }).click();
  await navigate(page, 'Dashboard');
  await navigate(page, 'Settings');
  await expect(page.getByLabel('Workspace name')).toHaveValue('Northstar Finance');
  await page.getByRole('button', { name: 'User management' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'taylor@example.com' })).toBeVisible();
});

test('empty search state and keyboard modal dismissal work', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Transactions');
  await page.getByLabel('Search transactions').fill('no-such-reference');
  await expect(
    page.getByText('No transactions match these filters. Try a different search.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'New transaction' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'New transaction' })).toBeFocused();
});

test('login and complete dashboard fit desktop viewports without page scrolling', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Mobile keeps natural scrolling for readability.');
  for (const viewport of [
    { width: 994, height: 650 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Continue as Demo User' })).toBeEnabled();
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`login-${viewport.width}.png`) });
    await page.getByRole('button', { name: 'Continue as Demo User' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(page.locator('.profile')).toContainText('Demo User');
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1),
    ).toBe(true);
    for (const selector of ['.stats', '.overview-grid', '.activity-grid', '.page-footer']) {
      const bounds = await page.locator(selector).boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height + 1);
    }
    await expect(page.locator('.recent-panel tbody tr')).toHaveCount(5);
    await expect(page.getByRole('link', { name: 'View general ledger' })).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath(`dashboard-${viewport.width}.png`) });
  }
});

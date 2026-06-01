import { Page, expect } from '@playwright/test';

/**
 * Navigate to a route and wait for the page to be network-idle.
 */
export const goto = async (page: Page, path: string): Promise<void> => {
  await page.goto(`http://localhost:3000${path}`);
  await page.waitForLoadState('networkidle');
};

/**
 * Assert that no error-level console messages were emitted since the last
 * navigation. 404s from the backend for non-existent resources are surfaced as
 * browser console errors; callers that expect those should not use this helper.
 */
export const expectNoConsoleErrors = async (page: Page): Promise<void> => {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Give React a tick to finish any synchronous post-render work.
  await page.waitForTimeout(200);

  expect(errors, `Unexpected console errors: ${errors.join(', ')}`).toHaveLength(0);
};

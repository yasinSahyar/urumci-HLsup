import { test, expect } from '@playwright/test';


test('empty cart', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#cart-btn').click();
  await page.getByRole('button', { name: 'Tyhjennä Ostoskori' }).click();
});
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#user-btn').click();
  await page.getByRole('button', { name: ' register' }).click();
  await page.locator('#sign-up-btn').click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('saad');
  await page.locator('form').filter({ hasText: 'Sign up Sign up Or Sign up' }).getByPlaceholder('Email').click();
  await page.locator('form').filter({ hasText: 'Sign up Sign up Or Sign up' }).getByPlaceholder('Email').fill('saad@metropolia.fi');
  await page.locator('form').filter({ hasText: 'Sign up Sign up Or Sign up' }).getByPlaceholder('Password').click();
  await page.locator('form').filter({ hasText: 'Sign up Sign up Or Sign up' }).getByPlaceholder('Password').fill('1234');
  await page.getByPlaceholder('Phone').click();
  await page.getByPlaceholder('Phone').fill('0458006887');
  await page.locator('input').filter({ hasText: 'Sign up' }).click();
  await page.getByText('× Sign in Login Or Sign in').click();
});
test('login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#user-btn').click();
  await page.getByRole('button', { name: ' register' }).click();
  await page.locator('form').filter({ hasText: 'Sign in Login Or Sign in with' }).getByPlaceholder('Email').click();
  await page.locator('form').filter({ hasText: 'Sign in Login Or Sign in with' }).getByPlaceholder('Email').click();
  await page.locator('form').filter({ hasText: 'Sign in Login Or Sign in with' }).getByPlaceholder('Password').click();
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('form').filter({ hasText: 'Sign in Login Or Sign in with' }).getByPlaceholder('Email').click();
  await page.getByText('× Sign in Login Or Sign in').click();
});



test('feedback', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByPlaceholder('Your Name').click();
  await page.getByPlaceholder('Your Name').fill('');
  await page.getByPlaceholder('Your Email').click();
  await page.getByPlaceholder('Your Email').fill('');
  await page.getByPlaceholder('Your Feedback').click();
  await page.getByPlaceholder('Your Feedback').fill('');
  await page.getByRole('button', { name: 'Submit Feedback' }).click();
});
test('payment', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#cart-btn').click();
  await page.getByRole('button', { name: 'Tyhjennä Ostoskori' }).click();
  await page.getByRole('button', { name: 'Maksaminen' }).click();
  await page.getByPlaceholder('John Doe').fill('n');
  await page.getByPlaceholder('Main St').fill('m');
  await page.getByPlaceholder('New York').fill('e');
  await page.getByPlaceholder('NY').fill('e');
  await page.getByPlaceholder('-456-7890').fill('0');
  await page.getByPlaceholder('example@email.com').fill('n');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('5678 9012 3456').fill('4');
  await page.getByPlaceholder('MM/YY').fill('12/27');
  await page.getByPlaceholder('123', { exact: true }).fill('123');
  await page.getByRole('button', { name: 'Pay Now' }).click();
});

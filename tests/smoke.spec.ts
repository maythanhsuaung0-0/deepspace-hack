import { test, expect } from '@playwright/test'
import { captureConsoleErrors } from './helpers/errors'

async function waitForApp(page: import('@playwright/test').Page) {
  await page.waitForSelector('[data-testid="app-root"]', { timeout: 15000 })
}

test.describe('HackAtlas smoke tests', () => {
  test('public atlas loads without application errors', async ({ page }) => {
    const errors = captureConsoleErrors(page)
    await page.goto('/')
    await waitForApp(page)
    await expect(page.getByTestId('hackatlas-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'One field. Fewer tabs.' })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('atlas carries one title, description, and canonical', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('hackatlas-page')).toBeVisible({ timeout: 15000 })
    await expect(page).toHaveTitle(/HackAtlas/)
    expect(await page.locator('head meta[name="description"]').count()).toBe(1)
    expect(await page.locator('head link[rel="canonical"]').count()).toBe(1)
  })

  test('public route opens the records connection without requiring sign-in', async ({ page }) => {
    const sockets: string[] = []
    page.on('websocket', (socket) => {
      if (new URL(socket.url()).pathname.startsWith('/ws/')) sockets.push(socket.url())
    })
    await page.goto('/')
    await expect(page.getByTestId('hackatlas-page')).toBeVisible({ timeout: 15000 })
    await expect.poll(() => sockets.length, { timeout: 15000 }).toBeGreaterThan(0)
    await expect(page.getByText(/field notes|Opening the register/).first()).toBeVisible()
  })

  test('about page explains the synthetic data policy', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByTestId('static-about')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'A truthful atlas starts with its sources.' })).toBeVisible()
  })

  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz')
    await waitForApp(page)
    await expect(page.locator('text=404')).toBeVisible()
  })
})

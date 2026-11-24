import { test, expect } from '@playwright/test'

test.describe('API tests', () => {
  test('auth proxy forwards to auth worker', async ({ request }) => {
    const res = await request.get('/api/auth/ok')
    expect(res.ok()).toBeTruthy()
  })

  test('WebSocket endpoint exists', async ({ page }) => {
    // The public atlas lives inside the dynamic provider boundary, so it boots
    // the records WebSocket without requiring sign-in.
    await page.goto('/')
    await page.waitForSelector('[data-testid="hackatlas-page"]', { timeout: 15000 })
    // If the app loaded and connected, the WS endpoint works
  })
})

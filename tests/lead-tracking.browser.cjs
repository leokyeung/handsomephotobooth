// Intercept the form endpoint. No test inquiry is sent to Formspree.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:8765';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const path of ['/', '/bay-area-wedding-photo-booth.html']) {
      for (const result of ['success', 'failure', 'analytics-failure']) {
        const page = await browser.newPage();
        await page.route('https://**/*', route => {
          if (route.request().url().startsWith('https://formspree.io/')) {
            return route.fulfill({ status: result === 'failure' ? 422 : 200, contentType: 'application/json', body: result === 'failure' ? JSON.stringify({ errors: [{ message: 'Test rejection' }] }) : JSON.stringify({ ok: true }) });
          }
          return route.abort();
        });
        await page.goto(base + path, { waitUntil: 'domcontentloaded' });
        await page.locator('[data-ajax-form]').waitFor();
        await page.evaluate(mode => {
          window.testEvents = [];
          window.gtag = (...args) => {
            if (mode === 'analytics-failure') throw new Error('Analytics unavailable');
            window.testEvents.push(args);
          };
        }, result);
        const form = page.locator('[data-ajax-form]');
        await form.locator('[name="Name"]').fill('SEO verification');
        await form.locator('[name="Email"]').fill('test@example.invalid');
        await form.locator('[name="Source"]').selectOption('Google');
        await form.locator('[name="Number of Guest"]').selectOption('101 - 150');
        for (const input of await form.locator('textarea[required], input[required]:not([name="Name"]):not([name="Email"])').all()) {
          const type = await input.getAttribute('type');
          await input.fill(type === 'date' ? '2027-05-15' : 'Intercepted test. No real inquiry.');
        }
        await form.locator('[type="submit"]').click();
        const status = page.locator('[data-form-status]');
        if (result === 'failure') {
          await page.waitForFunction(() => document.querySelector('[data-form-status]').classList.contains('form-status-error'));
          assert.equal(await form.isVisible(), true);
          assert.equal(await page.evaluate(() => window.testEvents.length), 0);
        } else {
          await page.waitForFunction(() => document.querySelector('[data-form-status]').classList.contains('form-status-success'));
          await form.waitFor({ state: 'hidden' });
          const events = await page.evaluate(() => window.testEvents);
          if (result === 'success') {
            assert.equal(events.length, 1);
            assert.equal(events[0][1], 'generate_lead');
            assert.deepEqual(Object.keys(events[0][2]).sort(), ['form_id', 'form_location']);
            assert.equal(events[0][2].form_location, path);
            assert.ok(!JSON.stringify(events).includes('test@example'));
          } else assert.equal(events.length, 0);
        }
        console.log(`PASS: ${path} ${result}`);
        await page.close();
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });

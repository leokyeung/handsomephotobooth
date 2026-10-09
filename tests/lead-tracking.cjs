// DOM tests with mocked HTTP responses. No network requests are made.
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets/js/formspree-ajax.js'), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

(async () => {
  for (const file of ['index.html', 'bay-area-wedding-photo-booth.html']) {
    for (const result of ['success', 'failure', 'network-failure', 'analytics-failure']) {
      const pagePath = file === 'index.html' ? '/' : '/' + file;
      const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), { url: 'https://handsomephotobooth.com' + pagePath, runScripts: 'outside-only', pretendToBeVisual: true });
      const w = dom.window;
      const events = [];
      let calls = 0;
      w.fetch = async (url, options) => {
        calls++;
        assert.equal(url, 'https://formspree.io/f/mgeqkkny');
        assert.equal(options.method.toUpperCase(), 'POST');
        assert.equal(options.body.get('Email'), 'test@example.invalid');
        if (result === 'network-failure') throw new Error('Offline');
        return { ok: result !== 'failure', status: result === 'failure' ? 422 : 200, json: async () => result === 'failure' ? { errors: [{ message: 'Rejected' }] } : { ok: true } };
      };
      w.gtag = (...args) => {
        if (result === 'analytics-failure') throw new Error('Analytics unavailable');
        events.push(args);
      };
      w.requestAnimationFrame = fn => fn();
      w.setTimeout = fn => fn();
      w.eval(script);
      const form = w.document.querySelector('[data-ajax-form]');
      form.querySelector('[name="Email"]').value = 'test@example.invalid';
      form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
      assert.equal(form.querySelector('[type="submit"]').disabled, true);
      await tick(); await tick();
      const status = w.document.querySelector('[data-form-status]');
      assert.equal(calls, 1);
      assert.equal(form.querySelector('[type="submit"]').disabled, false);
      if (result === 'failure' || result === 'network-failure') {
        assert.equal(form.hidden, false);
        assert.equal(status.classList.contains('form-status-error'), true);
        assert.equal(events.length, 0);
      } else {
        assert.equal(form.hidden, true);
        assert.equal(status.classList.contains('form-status-success'), true);
        if (result === 'success') {
          assert.deepEqual(JSON.parse(JSON.stringify(events)), [['event', 'generate_lead', { form_id: form.id || 'quote-inquiry', form_location: pagePath }]]);
          assert.ok(!JSON.stringify(events).includes('test@example'));
        } else assert.equal(events.length, 0);
      }
      console.log(`PASS: ${file} ${result}`);
      dom.window.close();
    }
  }
})().catch(error => { console.error(error); process.exit(1); });

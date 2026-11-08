const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { upcoming, label, render } = require('../assets/js/availability.js');

const today = '2026-11-08';

assert.deepEqual(upcoming(['2026-11-07', '2026-11-08', '2026-12-09', '2026-12-31', '2027-01-01', 'bad', '2026-02-31'], today), ['2026-11-08', '2026-12-09', '2026-12-31']);
assert.deepEqual(upcoming(['2026-12-31', '2027-01-31', '2027-02-01'], '2026-12-15'), ['2026-12-31', '2027-01-31']);
assert.deepEqual(upcoming(['2026-11-14', '2026-11-14', '2026-11-06'], today), ['2026-11-14']);

assert.equal(label(['2026-11-14', '2026-11-15', '2026-11-20']), 'Nov 14-15, 20');
assert.equal(label(['2026-11-30', '2026-12-01', '2026-12-02']), 'Nov 30; Dec 1-2');

const el = new JSDOM('<p id="n" hidden></p>').window.document.getElementById('n');
const noon = new Date('2026-11-08T20:00:00Z');
render(el, { dates: ['2026-11-14', '2026-11-15'] }, noon);
assert.equal(el.hidden, false);
assert.equal(el.textContent, '\u26D4\uFE0F Fully booked on Nov 14-15 \u26D4\uFE0F');
render(el, { dates: ['2026-11-14', '2026-11-15', '2026-11-22', '2026-12-04', '2026-12-05', '2026-12-12', '2026-12-13', '2026-12-19'] }, noon);
assert.equal(el.textContent, '\u26D4\uFE0F Fully booked on Nov 14-15, 22; Dec 4-5, 12-13, 19 \u26D4\uFE0F');
assert.deepEqual([...el.querySelectorAll('span')].map(s => s.textContent), ['\u26D4\uFE0F Fully', 'Nov 14-15,', '22;', 'Dec 4-5,', '12-13,', '19 \u26D4\uFE0F']);
render(el, { dates: ['2026-10-01'] }, noon);
assert.equal(el.hidden, true);
render(el, null, noon);
assert.equal(el.hidden, true);

const root = path.join(__dirname, '..');
for (const file of ['index.html', 'bay-area-wedding-photo-booth.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.match(html, /id="booked-notice"/, file);
  assert.match(html, /assets\/js\/availability\.js/, file);
}
JSON.parse(fs.readFileSync(path.join(root, 'availability.json'), 'utf8'));
console.log('availability tests passed');

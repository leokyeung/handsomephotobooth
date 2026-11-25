const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { upcoming, label, activeBlocks, render } = require('../assets/js/availability.js');

const today = '2026-11-08';

assert.deepEqual(upcoming(['2026-11-07', '2026-11-08', '2026-12-09', '2026-12-31', '2027-01-01', 'bad', '2026-02-31'], today), ['2026-11-08', '2026-12-09', '2026-12-31']);
assert.deepEqual(upcoming(['2026-12-31', '2027-01-31', '2027-02-01'], '2026-12-14'), ['2026-12-31', '2027-01-31']);
// From the 15th on, the month after next is included too.
assert.deepEqual(upcoming(['2026-12-31', '2027-01-05', '2027-01-31', '2027-02-01'], '2026-11-15'), ['2026-12-31', '2027-01-05', '2027-01-31']);
assert.deepEqual(upcoming(['2027-01-31', '2027-02-28', '2027-03-01'], '2026-12-15'), ['2027-01-31', '2027-02-28']);
assert.deepEqual(upcoming(['2026-11-14', '2026-11-14', '2026-11-06'], today), ['2026-11-14']);

assert.equal(label(['2026-11-14', '2026-11-15', '2026-11-20']), 'Nov 14-15, 20');
assert.equal(label(['2026-11-30', '2026-12-01', '2026-12-02']), 'Nov 30, Dec 1-2');

const sept = [{ label: 'Sept 2027', from: '2027-09-01', until: '2027-09-30' }];
assert.deepEqual(activeBlocks(sept, '2026-11-08').map(b => b.label), ['Sept 2027']);
assert.deepEqual(activeBlocks(sept, '2027-09-30').map(b => b.label), ['Sept 2027']);
assert.deepEqual(activeBlocks(sept, '2027-10-01'), []);
assert.deepEqual(activeBlocks([{ label: 'Bad', until: 'nope' }, null], '2026-11-08'), []);

// Blocks never change which upcoming dates appear outside the blocked range.
const blockEl = new JSDOM('<p id="b"><strong>Fully booked:</strong> <span data-booked-dates></span></p>').window.document.getElementById('b');
const upcomingDates = ['2026-11-14', '2026-11-15', '2026-12-04', '2027-01-09'];
render(blockEl, { dates: upcomingDates }, new Date('2026-11-08T20:00:00Z'));
const withoutBlock = blockEl.textContent;
render(blockEl, { dates: upcomingDates, blocked: sept }, new Date('2026-11-08T20:00:00Z'));
assert.equal(blockEl.textContent, withoutBlock + ', Sept 2027');
// In Aug 2027, booked dates inside September fold into the block; August dates still show.
render(blockEl, { dates: ['2027-08-14', '2027-09-04', '2027-09-11'], blocked: sept }, new Date('2027-08-10T20:00:00Z'));
assert.equal(blockEl.textContent, 'Fully booked: Aug 14, Sept 2027');
// After September 2027 the block disappears and October dates are untouched.
render(blockEl, { dates: ['2027-10-02'], blocked: sept }, new Date('2027-10-01T20:00:00Z'));
assert.equal(blockEl.textContent, 'Fully booked: Oct 2');

const el = new JSDOM('<p id="n" hidden></p>').window.document.getElementById('n');
const noon = new Date('2026-11-08T20:00:00Z');
render(el, { dates: ['2026-11-14', '2026-11-15'] }, noon);
assert.equal(el.hidden, false);
assert.equal(el.textContent, '\u26D4\uFE0F Fully booked on Nov 14-15 \u26D4\uFE0F');
render(el, { dates: ['2026-10-01'] }, noon);
assert.equal(el.hidden, true);
render(el, null, noon);
assert.equal(el.hidden, true);

const root = path.join(__dirname, '..');
for (const file of [
  'index.html',
  'bay-area-wedding-photo-booth.html',
  'alameda-photo-booth-rental.html',
  'san-leandro-photo-booth-rental.html',
  'pleasanton-photo-booth-rental.html',
]) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.match(html, /id="booked-notice"/, file);
  assert.match(html, /assets\/js\/availability\.js/, file);
  const notice = new JSDOM(html).window.document.getElementById('booked-notice');
  assert.equal(notice.hidden, true, file);
  render(notice, { dates: ['2026-11-14', '2026-11-15', '2026-12-04'] }, noon);
  assert.equal(notice.hidden, false, file);
  assert.equal(notice.textContent, 'Fully booked: Nov 14-15, Dec 4', file);
  render(notice, { dates: ['2026-12-04'], blocked: sept }, noon);
  assert.equal(notice.textContent, 'Fully booked: Dec 4, Sept 2027', file);
  render(notice, { dates: [], blocked: sept }, noon);
  assert.equal(notice.hidden, false, file);
  assert.equal(notice.textContent, 'Fully booked: Sept 2027', file);
  render(notice, { dates: [], blocked: sept }, new Date('2027-10-01T20:00:00Z'));
  assert.equal(notice.hidden, true, file);
  assert.equal(notice.querySelector('strong').textContent, 'Fully booked:', file);
  render(notice, { dates: ['2026-12-12'] }, noon);
  assert.equal(notice.textContent, 'Fully booked: Dec 12', file);
  assert.equal(notice.querySelectorAll('[data-booked-dates]').length, 1, file);
  assert.equal(notice.querySelectorAll('i, svg').length, 0, file);
  render(notice, { dates: [] }, noon);
  assert.equal(notice.hidden, true, file);
  render(notice, { dates: ['2026-12-19'] }, noon);
  assert.equal(notice.hidden, false, file);
  assert.ok(notice.textContent.includes('Dec 19'), file);
}
JSON.parse(fs.readFileSync(path.join(root, 'availability.json'), 'utf8'));
const blockedFile = JSON.parse(fs.readFileSync(path.join(root, 'blocked-dates.json'), 'utf8'));
assert.ok(Array.isArray(blockedFile.blocked), 'blocked-dates.json needs a blocked list');
for (const b of blockedFile.blocked) assert.ok(b.label && /^\d{4}-\d{2}-\d{2}$/.test(b.from) && /^\d{4}-\d{2}-\d{2}$/.test(b.until) && b.from <= b.until, JSON.stringify(b));
console.log('availability tests passed');

(function (root) {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TIME_ZONE = 'America/Los_Angeles';

  function dayNumber(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return NaN;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    // Rejects rolled-over dates such as 2026-02-31.
    if (d.getUTCMonth() !== +m[2] - 1) return NaN;
    return d.getTime() / 86400000;
  }

  function todayIso(now) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(now);
  }

  function upcoming(dates, today) {
    var start = dayNumber(today);
    // Last day of next month.
    var end = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) + 1, 0) / 86400000;
    var seen = {};
    return dates.filter(function (iso) {
      var n = dayNumber(iso);
      if (isNaN(n) || n < start || n > end || seen[iso]) return false;
      seen[iso] = true;
      return true;
    }).sort();
  }

  function label(dates) {
    var groups = [];
    dates.forEach(function (iso) {
      var month = +iso.slice(5, 7) - 1;
      var day = +iso.slice(8, 10);
      var group = groups[groups.length - 1];
      if (!group || group.month !== month) {
        group = { month: month, runs: [] };
        groups.push(group);
      }
      var run = group.runs[group.runs.length - 1];
      if (run && run[1] === day - 1) run[1] = day;
      else group.runs.push([day, day]);
    });
    return groups.map(function (g) {
      var days = g.runs.map(function (r) {
        return r[0] === r[1] ? String(r[0]) : r[0] + '-' + r[1];
      });
      return MONTHS[g.month] + ' ' + days.join(', ');
    }).join(', ');
  }

  // Long-term blocks, e.g. { "label": "Sept 2027", "from": "2027-09-01", "until": "2027-09-30" }, shown until their last day.
  function activeBlocks(blocked, today) {
    var start = dayNumber(today);
    return (Array.isArray(blocked) ? blocked : []).filter(function (b) {
      return b && typeof b.label === 'string' && b.label && dayNumber(b.until) >= start;
    });
  }

  function render(el, data, now) {
    var today = todayIso(now || new Date());
    var dates = data && Array.isArray(data.dates) ? data.dates : [];
    var blocks = activeBlocks(data && data.blocked, today);
    // A booked date inside a block is already covered by the block's label.
    var list = upcoming(dates, today).filter(function (iso) {
      var n = dayNumber(iso);
      return !blocks.some(function (b) { return n >= dayNumber(b.from) && n <= dayNumber(b.until); });
    });
    var parts = list.length ? [label(list)] : [];
    parts = parts.concat(blocks.map(function (b) { return b.label; }));
    if (!parts.length) {
      el.hidden = true;
      return;
    }
    var text = parts.join(', ');
    var dateTarget = el.querySelector('[data-booked-dates]');
    if (dateTarget) dateTarget.textContent = text;
    else el.textContent = '\u26D4\uFE0F Fully booked on ' + text + ' \u26D4\uFE0F';
    el.hidden = false;
  }

  var api = { upcoming: upcoming, label: label, activeBlocks: activeBlocks, render: render, todayIso: todayIso };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root.document) return;

  var el = root.document.getElementById('booked-notice');
  if (!el || !root.fetch) return;
  // availability.json is rewritten by the Google Sheet sync; blocked-dates.json is edited by hand.
  var load = function (url) {
    return root.fetch(url, { cache: 'no-cache' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
  };
  Promise.all([load('./availability.json'), load('./blocked-dates.json')])
    .then(function (files) {
      render(el, {
        dates: files[0] && files[0].dates,
        blocked: files[1] && files[1].blocked
      });
    })
    .catch(function () {});
})(typeof window !== 'undefined' ? window : globalThis);

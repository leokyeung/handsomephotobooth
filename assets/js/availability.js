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
    }).join('; ');
  }

  function render(el, data, now) {
    var dates = data && Array.isArray(data.dates) ? data.dates : [];
    var list = upcoming(dates, todayIso(now || new Date()));
    if (!list.length) {
      el.hidden = true;
      return;
    }
    var words = label(list).split(' ');
    var tokens = [];
    for (var i = 0; i < words.length; i++) {
      // A month name stays with its first day; ranges like "12-13," never split.
      if (/^[A-Za-z]/.test(words[i]) && i + 1 < words.length) tokens.push(words[i] + ' ' + words[++i]);
      else tokens.push(words[i]);
    }
    tokens[tokens.length - 1] += ' \u26D4\uFE0F';

    var doc = el.ownerDocument;
    var unbreakable = function (text) {
      var span = doc.createElement('span');
      span.style.whiteSpace = 'nowrap';
      span.textContent = text;
      return span;
    };
    el.textContent = '';
    el.appendChild(unbreakable('\u26D4\uFE0F Fully'));
    el.appendChild(doc.createTextNode(' booked on '));
    tokens.forEach(function (token, n) {
      if (n) el.appendChild(doc.createTextNode(' '));
      el.appendChild(unbreakable(token));
    });
    el.style.textWrap = 'balance';
    el.hidden = false;
  }

  var api = { upcoming: upcoming, label: label, render: render, todayIso: todayIso };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root.document) return;

  var el = root.document.getElementById('booked-notice');
  if (!el || !root.fetch) return;
  root.fetch('./availability.json', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) { render(el, data); })
    .catch(function () {});
})(typeof window !== 'undefined' ? window : globalThis);

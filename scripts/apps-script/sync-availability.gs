// Paste into the Google Sheet's Apps Script project. Needs Script Property GITHUB_TOKEN.
var REPO = 'leokyeung/handsomephotobooth';
var FILE_PATH = 'availability.json';
var BRANCH = 'main';

function syncAvailability() {
  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('Missing GITHUB_TOKEN script property');

  var dates = upcomingDates_();
  var url = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;
  var headers = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  var current = UrlFetchApp.fetch(url + '?ref=' + BRANCH, { headers: headers, muteHttpExceptions: true });
  var code = current.getResponseCode();
  var sha;
  if (code === 200) {
    var file = JSON.parse(current.getContentText());
    sha = file.sha;
    try {
      var bytes = Utilities.base64Decode(file.content.replace(/\n/g, ''));
      var existing = JSON.parse(Utilities.newBlob(bytes).getDataAsString());
      if (JSON.stringify(existing.dates) === JSON.stringify(dates)) return;
    } catch (e) {
      // Unreadable file: overwrite it.
    }
  } else if (code !== 404) {
    throw new Error('GitHub read failed: HTTP ' + code);
  }

  var body = {
    message: 'Update booked dates',
    branch: BRANCH,
    content: Utilities.base64Encode(JSON.stringify({ dates: dates }, null, 2) + '\n', Utilities.Charset.UTF_8)
  };
  if (sha) body.sha = sha;

  var res = UrlFetchApp.fetch(url, {
    method: 'put',
    headers: headers,
    contentType: 'application/json',
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  });
  var status = res.getResponseCode();
  if (status !== 200 && status !== 201) throw new Error('GitHub write failed: HTTP ' + status);
}

// Column A of every sheet tab; row 1 of each tab is a header.
// A year in the tab name (e.g. "2026 earnings") overrides the year of every date on that tab.
function upcomingDates_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = ss.getSpreadsheetTimeZone();

  var fmt = function (d) { return Utilities.formatDate(d, tz, 'yyyy-MM-dd'); };
  var today = fmt(new Date());
  // Keeps today through the last day of next month.
  var t = today.split('-');
  var end = new Date(Date.UTC(+t[0], +t[1] + 1, 0)).toISOString().slice(0, 10);
  var seen = {};

  ss.getSheets().forEach(function (sheet) {
    if (sheet.getLastRow() < 2) return;
    var nameYear = /\b(20\d{2})\b/.exec(sheet.getName());
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().forEach(function (row) {
      toIsoDates_(row[0], tz, nameYear ? +nameYear[1] : null).forEach(function (iso) {
        if (iso >= today && iso <= end) seen[iso] = true;
      });
    });
  });
  return Object.keys(seen).sort();
}

var MONTH_NAMES_ = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Accepts a date cell, a parseable date string, or text starting with "Mon D" or "Mon D-D" (e.g. "Dec 5-7 Xmas Party").
// Returns every ISO date covered, or an empty list.
function toIsoDates_(value, tz, year) {
  var y, month, day;
  var lastDay = null;
  var fromDate = function (d) {
    var p = Utilities.formatDate(d, tz, 'yyyy-MM-dd').split('-');
    y = +p[0]; month = +p[1]; day = +p[2];
  };

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return [];
    fromDate(value);
  } else {
    var text = String(value).trim();
    if (!text) return [];
    var parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      // Strings are parsed in the script time zone, so format them in it too.
      var p = Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd').split('-');
      y = +p[0]; month = +p[1]; day = +p[2];
      // Year-less text such as "12/4" parses as 2001.
      if (!/\d{4}/.test(text)) y = +Utilities.formatDate(new Date(), tz, 'yyyy');
    } else {
      var m = /^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:\s*[-\u2013]\s*(\d{1,2}))?\b/.exec(text);
      if (!m) return [];
      var word = m[1].toLowerCase();
      var idx = MONTH_NAMES_.findIndex(function (name) { return name.indexOf(word) === 0; });
      if (idx < 0) return [];
      month = idx + 1; day = +m[2];
      if (m[3]) lastDay = +m[3];
      y = +Utilities.formatDate(new Date(), tz, 'yyyy');
    }
  }

  if (year) y = year;
  if (lastDay === null || lastDay < day) lastDay = day;

  var out = [];
  for (var d = day; d <= lastDay; d++) {
    // Skips impossible dates such as Feb 30 or Feb 29 in a non-leap year.
    if (new Date(Date.UTC(y, month - 1, d)).getUTCMonth() !== month - 1) continue;
    out.push(y + '-' + ('0' + month).slice(-2) + '-' + ('0' + d).slice(-2));
  }
  return out;
}

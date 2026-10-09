# Handsome Photobooth SEO operating plan

## Goal and scope

Grow qualified Bay Area wedding and event inquiries through organic search. Use Google Search Console for `sc-domain:handsomephotobooth.com` and the repository `leokyeung/handsomephotobooth`. The owner authorized routine SEO improvements, article publication, and deployment on October 9, 2026. Publishing must remain focused on this website and its actual services.

## Content map

- `/`: general Bay Area photo booth rentals, weddings, corporate events, and parties.
- `/bay-area-wedding-photo-booth.html`: primary Bay Area wedding service and quote page.
- `/alameda-photo-booth-rental.html`: actual Alameda location and local event planning.
- `/san-leandro-photo-booth-rental.html`: actual San Leandro location and local event planning.
- `/blog/blog_3.html`: existing cost guide. Improve this URL rather than creating a competing cost article.
- `/blog/wedding-photo-booth-timeline.html`: scheduling and placement.
- `/blog/open-air-vs-enclosed-photo-booth.html`: booth-style comparison.
- `/blog/wedding-photo-booth-setup-checklist.html`: space, outlet, connectivity, and load-in checklist.
- `/blog/blog_2.html`: vendor selection.
- `/blog/blog_1.html`: wedding benefits.

## Business facts and boundaries

The owner confirmed two active locations: Alameda and San Leandro. Public Google Places listings returned 1209 Park St, Alameda, CA 94501 (place ID `ChIJ7TAsbjaHj4ARqLT78siF4do`) and 1415 E 14th St, San Leandro, CA 94578 (place ID `ChIJ_ddK0IenxGMRfHvdMTvcMEM`). Do not invent storefront access, walk-in availability, phone numbers, office hours, or additional locations.

Use the currently published package and booking terms as the source of truth; reread them on every run. As of the initial change, the website lists $899 for three operating hours, $150 for an extra hour, $49 for a photo album, and $99 for scrapbook service. Do not change prices, cancellation/deposit policies, taxes, or service commitments without explicit owner instructions. Confirm the total through the quote process; do not invent market-average prices or claim all fees are included.

Use existing approved website images for routine content. Do not invent completed events, venue partnerships, client names, quotes, awards, statistics, or firsthand experience. A public customer review is evidence of that review, not authorization to create an invented case study. Event case studies require owner-confirmed details and approved photos. Avoid duplicate city pages with only city names changed and topics for services not actually offered (for example 360 video rentals).

## Recurring cadence

Run a weekly search-performance and editorial review. Aim for two new useful articles and two substantive existing-page improvements per calendar month. One weekly run may publish one substantive item; skip new publication when evidence does not support a useful distinct topic. Log changes before selecting the next item so recurring runs do not repeat work. Refresh a page rather than creating a second URL for the same search intent.

Suggested next topics: prints versus digital sharing; planning a photo booth for a 100–150 guest wedding; scrapbook versus album; custom template planning. Confirm current search demand and existing coverage first. Venue case studies are contingent on actual approved materials. Review local profiles and links monthly; website automation does not authorize third-party outreach or changes to unrelated accounts.

## Publication procedure

1. Read this playbook, the changelog, current source, pending PRs, and current Search Console data. Compare the latest 28 settled days with the prior 28 where the tool supports comparison. Keep branded and non-branded demand separate.
2. Choose one opportunity based on relevant impressions, clicks, CTR, position, user usefulness, and business intent. Treat low-volume positions cautiously. Check query-to-page overlap where available.
3. Create a branch from the latest `main`. Preserve the current design, form destination, established URLs, and working business functionality.
4. Write specific useful content, descriptive title and description, a self-referencing HTTPS canonical, appropriate honest JSON-LD, internal links, and a booking CTA. Show real publication/update dates for new or materially changed articles.
5. Add new articles to the blog index and its Blog schema. Add only canonical working URLs to the sitemap. Change `lastmod` only for pages actually changed; no fake date refreshes.
6. Run `python scripts/check_seo.py`. Validate arithmetic, schema, target links, desktop/mobile layouts, and relevant interactions. For form changes, run `npm ci` and `npm test` for mocked DOM/HTTP checks. Where a Playwright browser is available, start a local server and run `node tests/lead-tracking.browser.cjs` for intercepted browser checks; never send test inquiries to the real business. Analytics must never block accepted submissions and must not transmit form field values. Clearly report any unavailable visual checks.
7. Review the diff, create a PR, and merge after relevant checks pass. Do not bypass branch protection or force-push `main`. If access or a required check blocks publication, keep a reviewable PR and report the precise blocker.
8. Verify GitHub Pages deployment and live pages. Submit the published sitemap through Search Console when URLs change. A submitted sitemap does not guarantee crawling, indexing, or ranking.
9. Append a dated changelog entry with topic, intent, URLs, checks, and PR link. Send a concise report of what changed and what needs owner input.

## Measurement and access

Track non-branded clicks, relevant query groups, page CTR, and completed inquiries, not article volume alone. Google positions are averages and vary by searcher and location. Establish conversion data once Google Analytics is connected in GSC Wizard. `generate_lead` is emitted only after an accepted Formspree response, with a form identifier and page path; mark it as a key event in GA4 using the owner's Analytics account. The initial session could not read GA4 because Analytics consent was missing.

Google Business Profile management access is separate from public listing URLs. Update the San Leandro website link to HTTPS and consider pointing each profile at its corresponding live location page. Do not claim these updates happened without a successful write and verification. Maintain genuine reviews and current profile information; do not buy reviews, create fake links, or send messages to clients or venues without explicit sending authorization.

No top ranking is guaranteed. Prioritize first-page visibility and qualified inquiries, and reassess after sufficient settled data instead of repeatedly changing titles after a few days.

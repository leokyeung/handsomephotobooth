# SEO change log

## 2026-11-09: Compact booking availability notices

- Applied the approved text-only, 15px availability notice to the
	[homepage](https://handsomephotobooth.com/) and
	[wedding page](https://handsomephotobooth.com/bay-area-wedding-photo-booth.html).
- Kept a muted-red semibold label, dark dates, and the existing 24px gap above
	the name field. Preserved automatic date updates and the current date window.
- Updated CSS and script cache versions without changing booking data, forms,
	videos, URLs, or unrelated local previews.

Validation: inquiry and availability unit tests passed; the SEO checker passed
all 11 canonical pages in an isolated release worktree. Six intercepted browser
form scenarios passed without sending real inquiries. Both pages passed layout
checks at 320, 360, 390, and 1440px with no clipping and the existing form gap.
The current dates fit one line at 360px and wider and wrap naturally at 320px.
Release: [PR #62](https://github.com/leokyeung/handsomephotobooth/pull/62).
No sitemap submission is needed because no URLs were added or changed.

## 2026-10-12: Wedding photo booth timeline update

- Expanded the existing wedding timeline article instead of creating a competing URL. The update now answers how long to run a booth, compares three-hour schedule patterns, explains dinner and dancing tradeoffs, covers placement, and gives a fact-bounded answer about when to request availability.
- Updated the page title, description, Open Graph copy, visible heading, BlogPosting modification date, and matching FAQ structured data.
- Updated the existing blog-index card and Blog schema headline, then changed sitemap modification dates only for the article and index actually edited.
- Preserved the canonical URL, published three-hour package, pricing, booking terms, imagery, and quote destination.

Search Console comparison for relevant non-branded commercial queries, September 13–October 10 versus August 16–September 12, 2026: clicks increased from 4 to 9; impressions decreased from 2,730 to 1,420; CTR increased from 0.15% to 0.63%; and impression-weighted average position improved from 19.4 to 17.6. The existing timeline page recorded 31 impressions at average position 6.9 in the latest window, including visibility for questions about how long to run a booth and how far ahead to book. Query/page data also showed the homepage and cost guide overlapping on broad Bay Area rental terms, so this update stays focused on timeline intent rather than adding another commercial landing page.

Validation: `python scripts/check_seo.py` passed all 11 canonical pages, JSON-LD, metadata, sitemap parity, local links, and fragments. Published through [PR #47](https://github.com/leokyeung/handsomephotobooth/pull/47). The article, blog card, and sitemap dates were verified live after GitHub Pages deployment, and the desktop article layout was visually checked. A mobile viewport was not available in the browser session. The sitemap was not resubmitted because no URL was added or changed.

## 2026-10-09: Initial foundation and local content

- Revised the existing cost-guide URL with the published $899 package, checked add-on arithmetic, fee questions, and related planning links; removed unsupported market-average claims.
- Published a wedding photo booth setup checklist using setup details already on the website.
- Added Alameda and San Leandro location pages, actual location schema, Google listing links, and distinct planning guidance.
- Linked the local pages and checklist from the homepage and wedding page, and added the checklist to the blog index and timeline guide.
- Removed the wedding page's self-serving aggregate review markup; retained customer testimonials.
- Updated sitemap URLs and real modification dates.
- Added `generate_lead` after accepted quote-form responses and expanded the homepage's Analytics collection CSP to cover Google Analytics subdomains.
- Added repeatable static SEO and intercepted lead-tracking checks.

Validation: all 11 canonical pages passed static checks. Mocked DOM tests covered successful, rejected, offline, and Analytics-failure submissions on both forms. A local Chromium preview was unavailable, so live visual verification is tracked separately from these passing checks.

Initial Search Console window: September 9–October 6, 2026. The wedding service page was submitted and indexed. Analytics consent and direct Business Profile management were not available in the initial session.

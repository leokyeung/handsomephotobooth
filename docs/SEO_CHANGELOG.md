# SEO change log

## 2026-11-10: Visible homepage review strip

- Replaced the homepage's three oversized badges with the owner-approved
  four-platform review strip, local logo assets, platform-colored links,
  brighter gold stars, and published review counts. Counts are shown per
  platform, not added together; Google links cover both existing locations.
- Preserved the Best of Weddings award years and added a connected divider
  cross on mobile, with minimum 44px link targets. No rating schema added.
- Versioned the homepage stylesheet to avoid stale cached presentation.

## 2026-11-10: Review profiles in llms.txt and current Yelp URL

- Added a Reviews and awards section to `/llms.txt` with owner-supplied and
  profile-verified ratings: The Knot/WeddingWire 5.0 (194 shared reviews),
  Yelp 5.0 (40), Google 5.0 (100+), plus awards. Not added as on-page or
  `AggregateRating` markup (self-serving review rule).
- Updated Yelp links and `sameAs` from `handsome-photobooth-oakland-2` to
  `handsome-photobooth-san-leandro`.

## 2026-11-10: Bing title length and hero alt text

- Bing URL Inspection flagged "Title too long" and a missing image alt on the
  homepage. Shortened all titles to 70 characters or fewer (homepage, Alameda,
  San Leandro, benefits guide, cost guide) and added descriptive alt text to
  the hero poster image on the homepage and wedding page.

## 2026-11-10: Repaired article markup and AI-readable contact facts

- Repaired spliced HTML from the previous release in the
  [wedding benefits guide](https://handsomephotobooth.com/blog/blog_1.html)
  (byline and intro inside the header nav, FAQ inside the table),
  [cost guide](https://handsomephotobooth.com/blog/blog_3.html) (stray text in
  the menu, FAQ inside the questions list, stale visible date), and
  [setup checklist](https://handsomephotobooth.com/blog/wedding-photo-booth-setup-checklist.html)
  (dangling byline).
- Showed email and both location addresses in the homepage and wedding page
  footers; homepage location schema now has `hasMap` Google listing links.
- Wedding page Google review card now links to the Alameda Google listing
  instead of a generic search.
- Linked the cost and timeline guides from the homepage package section.
- Added `/llms.txt` with approved business facts and key pages.

## 2026-11-10: Article comparison tables, FAQ parity, image dimensions, and SEO guardrails

- Upgraded all six blog guides and both East Bay city service pages with
  `.article-meta` bylines, bold **Quick Answer** openings, scannable
  `.article-table` comparison tables, and matching visible + `FAQPage` JSON-LD
  questions:
  - [open-air vs. enclosed guide](https://handsomephotobooth.com/blog/open-air-vs-enclosed-photo-booth.html):
    repaired spliced paragraphs and added a 5-row Open-Air vs. Enclosed table.
  - [wedding benefits guide](https://handsomephotobooth.com/blog/blog_1.html):
    added a 4-row print format and keepsake table (2 × 6 strip, 4 × 6 print,
    $99 scrapbook, $49 album) and 3 visible + schema FAQs.
  - [vendor selection guide](https://handsomephotobooth.com/blog/blog_2.html):
    added a DSLR vs. Tablet comparison table, a 6-question copy-and-send vendor
    checklist, 3 visible + schema FAQs, and accurate `planning.jpg` alt text.
  - [cost guide](https://handsomephotobooth.com/blog/blog_3.html): synced the
    visible update date, added a 5-row sample package combinations table ($899
    to $1,148), and added 3 visible + schema Cost FAQs.
  - [wedding timeline guide](https://handsomephotobooth.com/blog/wedding-photo-booth-timeline.html):
    added a 3-option schedule comparison table and completed the three timed
    schedule patterns.
  - [setup checklist](https://handsomephotobooth.com/blog/wedding-photo-booth-setup-checklist.html):
    added `FAQPage` JSON-LD matching the four existing visible setup FAQs.
  - [Alameda](https://handsomephotobooth.com/alameda-photo-booth-rental.html)
    and [San Leandro](https://handsomephotobooth.com/san-leandro-photo-booth-rental.html):
    added a 5-row package and setup summary table, 3 local FAQs + `FAQPage`
    JSON-LD, and reservation-only venue delivery wording.
- Improved [blog.html](https://handsomephotobooth.com/blog/blog.html) by adding
  an `<h2>` heading above the article grid, removing `loading="lazy"` and
  adding `fetchpriority="high"` on the top featured LCP image, and adding
  explicit `width` and `height` attributes to all images across all 11 canonical
  pages.
- Hardened `scripts/check_seo.py` to skip `noindex` local mockups, require at
  least 2 incoming internal links per canonical page, and require `alt` plus
  numeric `width` and `height` attributes on all `<img>` elements.

Validation: `python3 scripts/check_seo.py` passed all 11 canonical pages;
`npm test` passed all inquiry and availability checks; headless Chrome verified
all updated pages at 390px and 1440px with zero horizontal overflow.
Release: [PR #67](https://github.com/leokyeung/handsomephotobooth/pull/67).
No sitemap submission is needed because no URLs were added or changed.

## 2026-11-10: Fact-aligned blog content and structured-data cleanup

- Grounded [blog_1.html](https://handsomephotobooth.com/blog/blog_1.html) and
  [blog_2.html](https://handsomephotobooth.com/blog/blog_2.html) in published
  package facts ($899 three-hour Glam Package, smudge-free instant prints,
  digital album delivery within a few days, optional $49 album and $99
  scrapbook add-ons, and 50% deposit/travel terms), removing unverified
  "completely waterproof", "Weeks after", and unqualified "all-inclusive" claims.
- Aligned the `FAQPage` JSON-LD and body copy on the
  [open-air vs. enclosed guide](https://handsomephotobooth.com/blog/open-air-vs-enclosed-photo-booth.html)
  and added a visible FAQ section matching the structured data.
- Removed the artificial same-page anchor `BreadcrumbList` from the
  [homepage](https://handsomephotobooth.com/) and added valid `BreadcrumbList`
  JSON-LD (`Home → Blog → Article`) to the
  [blog index](https://handsomephotobooth.com/blog/blog.html) and all six
  articles.
- Linked the
  [Alameda](https://handsomephotobooth.com/alameda-photo-booth-rental.html) and
  [San Leandro](https://handsomephotobooth.com/san-leandro-photo-booth-rental.html)
  `LocalBusiness` entities to `https://handsomephotobooth.com/#business` via
  `parentOrganization`, changed their `og:type` to `website`, and replaced the
  blog hub's external `i.ibb.co` `og:image` with a first-party image.
- Updated `dateModified` and `sitemap.xml` `lastmod` dates to `2026-11-10` for
  all edited pages.

Validation: `python3 scripts/check_seo.py` passed all 11 canonical pages;
`npm test` passed all inquiry and availability checks; headless Chrome verified
all updated pages at 390px and 1440px.
Release: [PR #66](https://github.com/leokyeung/handsomephotobooth/pull/66).
No sitemap submission is needed because no URLs were added or changed.

## 2026-11-09: Internal linking to East Bay city pages and wedding guides

- Restored crawlable links to the
  [Alameda](https://handsomephotobooth.com/alameda-photo-booth-rental.html) and
  [San Leandro](https://handsomephotobooth.com/san-leandro-photo-booth-rental.html)
  service pages from the [homepage](https://handsomephotobooth.com/) FAQ, the
  [wedding page](https://handsomephotobooth.com/bay-area-wedding-photo-booth.html)
  service-area section, and between the two East Bay pages.
- Added contextual links from the wedding page FAQ cards to the
  [timeline guide](https://handsomephotobooth.com/blog/wedding-photo-booth-timeline.html),
  [setup checklist](https://handsomephotobooth.com/blog/wedding-photo-booth-setup-checklist.html),
  [cost guide](https://handsomephotobooth.com/blog/blog_3.html), and
  [open-air vs. enclosed comparison](https://handsomephotobooth.com/blog/open-air-vs-enclosed-photo-booth.html).
- Added the setup checklist to the related-reading sections of
  [blog_1.html](https://handsomephotobooth.com/blog/blog_1.html),
  [blog_2.html](https://handsomephotobooth.com/blog/blog_2.html), and the
  comparison guide, and updated cost-guide link descriptions to reference
  published package and add-on pricing rather than local-average claims.
- Updated `dateModified` and `sitemap.xml` `lastmod` dates for the edited pages,
  and bumped `seo-guides.css` cache version on the homepage.

Validation: `python3 scripts/check_seo.py` passed all 11 canonical pages in an
isolated release export; `npm test` passed all inquiry and availability checks;
headless Chrome confirmed all new internal links and underline styles. Every
canonical page now has incoming links from at least 3 to 10 other pages.
Release: [PR #65](https://github.com/leokyeung/handsomephotobooth/pull/65).
No sitemap submission is needed because no URLs were added or changed.

## 2026-11-09: Consistent setup dimensions and new SEO checks

- Set the booth footprint to approximately 10 ft × 10 ft everywhere. The
  [wedding page](https://handsomephotobooth.com/bay-area-wedding-photo-booth.html)
  FAQ structured data said 8 × 8 while the visible card said 10 × 10; both now
  use the same wording, and the "an 10" typo is gone.
- Changed three 8 × 8 mentions in the
  [open-air vs enclosed article](https://handsomephotobooth.com/blog/open-air-vs-enclosed-photo-booth.html)
  to 10 ft × 10 ft, matching the setup checklist and both city pages. Updated its
  modified date and the sitemap dates for it and the wedding page.
- `scripts/check_seo.py` now fails if a sitemap page lacks the `G-6RDG7BCNMX`
  tag, or if a page's FAQ structured-data dimensions differ from its visible text.

Validation: the checker passed all 11 canonical pages in a clean export. Test
copies with a wrong tag ID, a commented-out tag, and a stale 8 × 8 in either the
FAQ or the visible text each failed as intended. Inquiry and availability tests
passed. Release: [PR #64](https://github.com/leokyeung/handsomephotobooth/pull/64).
No sitemap submission is needed because no URLs were added or changed.

## 2026-11-09: Wedding page Analytics tag

- Added the existing `G-6RDG7BCNMX` Analytics tag to the
	[wedding page](https://handsomephotobooth.com/bay-area-wedding-photo-booth.html),
	the only canonical page without it. Direct landings are now measured, and
	the existing `generate_lead` event now fires there; before, the form script
	skipped it silently because `gtag` was undefined.
- No change to the form script, which records a lead only after Formspree
	accepts an inquiry and never lets an Analytics error interrupt one.

Validation: inquiry and availability unit tests passed; the SEO checker passed
all 11 canonical pages in an isolated release worktree. In a real browser with
all external requests intercepted, the tag loaded once, the property was
configured, and one `generate_lead` carrying only form id and page path was
recorded after an accepted inquiry. No real inquiry was sent.
Release: [PR #63](https://github.com/leokyeung/handsomephotobooth/pull/63).
No sitemap submission is needed because no URLs were added or changed.

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

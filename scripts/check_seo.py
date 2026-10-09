"""Check the static site's crawlable pages, metadata, schema, and local links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = 'handsomephotobooth.com'

class Page(HTMLParser):
    def __init__(self, content):
        super().__init__()
        self.links, self.ids, self.canonicals, self.descriptions = [], set(), [], []
        self.h1s = 0
        self.title = ''
        self.in_title = False
        self.schema = None
        self.schemas = []
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'h1': self.h1s += 1
        if tag == 'title': self.in_title = True
        if tag == 'meta' and a.get('name') == 'description': self.descriptions.append(a.get('content', ''))
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag in ('a', 'link') and a.get('href'): self.links.append(a['href'])
        if tag in ('img', 'script', 'source') and a.get('src'): self.links.append(a['src'])
        if tag == 'script' and a.get('type') == 'application/ld+json': self.schema = ''

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.schema is not None: self.schema += data

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script' and self.schema is not None:
            self.schemas.append(json.loads(self.schema))
            self.schema = None

pages = {p: Page(p.read_text(encoding='utf-8-sig')) for p in ROOT.rglob('*.html')}
errors = []
titles, canonicals = set(), set()
for path, page in pages.items():
    rel = path.relative_to(ROOT)
    if page.h1s != 1: errors.append(f'{rel}: expected one H1, got {page.h1s}')
    title = ' '.join(page.title.split())
    if not title or title in titles: errors.append(f'{rel}: missing or duplicate title')
    titles.add(title)
    if len(page.descriptions) != 1 or not page.descriptions[0]: errors.append(f'{rel}: expected one nonempty description')
    if len(page.canonicals) != 1: errors.append(f'{rel}: expected one canonical URL')
    else:
        canonical = page.canonicals[0]
        expected = f'https://{HOST}/' + ('' if str(rel) == 'index.html' else rel.as_posix())
        if canonical != expected: errors.append(f'{rel}: canonical {canonical} does not match {expected}')
        if canonical in canonicals: errors.append(f'{rel}: duplicate canonical')
        canonicals.add(canonical)
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme not in ('', 'http', 'https'): continue
        if parsed.netloc and parsed.netloc not in (HOST, 'www.' + HOST): continue
        part = unquote(parsed.path)
        if parsed.netloc or part.startswith('/'):
            target = ROOT / part.lstrip('/')
        else:
            target = path.parent / part if part else path
        if target.is_dir(): target /= 'index.html'
        target = target.resolve()
        if not target.exists(): errors.append(f'{rel}: missing local target {link}')
        elif parsed.fragment and target in pages and parsed.fragment not in pages[target].ids:
            errors.append(f'{rel}: missing fragment {link}')

ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [x.text for x in ET.parse(ROOT / 'sitemap.xml').findall('.//sm:loc', ns)]
if len(urls) != len(set(urls)): errors.append('Sitemap contains duplicate URLs')
if set(urls) != canonicals: errors.append('Sitemap and canonical page URLs differ')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, unique titles/canonicals, descriptions, JSON-LD, sitemap, local links and fragments')

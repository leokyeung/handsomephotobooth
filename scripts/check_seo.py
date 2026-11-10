"""Check the static site's crawlable pages, metadata, schema, and local links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = 'handsomephotobooth.com'
ANALYTICS_ID = 'G-6RDG7BCNMX'
DIMENSION = re.compile(r'(\d+)\s*(?:ft|feet|foot)?\s*(?:×|x|by)\s*(\d+)\s*(?:ft|feet|foot)\b', re.I)

def dimensions(text):
    return {tuple(sorted(map(int, m.groups()))) for m in DIMENSION.finditer(text)}

def answers(node):
    if isinstance(node, dict):
        if node.get('@type') == 'Answer': yield node.get('text', '')
        for value in node.values(): yield from answers(value)
    elif isinstance(node, list):
        for value in node: yield from answers(value)

class Page(HTMLParser):
    def __init__(self, content):
        super().__init__()
        self.links, self.anchors, self.imgs, self.ids, self.canonicals, self.descriptions = [], [], [], set(), [], []
        self.noindex = False
        self.h1s = 0
        self.title = ''
        self.in_title = False
        self.schema = None
        self.schemas = []
        self.script_srcs, self.inline_scripts = [], []
        self.inline = None
        self.skip = 0
        self.text = ''
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'script' and a.get('src'): self.script_srcs.append(a['src'])
        if tag == 'script' and not a.get('src') and a.get('type') != 'application/ld+json': self.inline = ''
        if tag == 'h1': self.h1s += 1
        if tag == 'title': self.in_title = True
        if tag == 'meta' and a.get('name') == 'description': self.descriptions.append(a.get('content', ''))
        if tag == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '').lower(): self.noindex = True
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag in ('a', 'link') and a.get('href'): self.links.append(a['href'])
        if tag == 'a' and a.get('href'): self.anchors.append(a['href'])
        if tag == 'img': self.imgs.append(a)
        if tag in ('img', 'script', 'source') and a.get('src'): self.links.append(a['src'])
        if tag == 'script' and a.get('type') == 'application/ld+json': self.schema = ''

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.schema is not None: self.schema += data
        if self.inline is not None: self.inline += data
        elif not self.skip: self.text += ' ' + data

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag in ('script', 'style'): self.skip -= 1
        if tag == 'script' and self.inline is not None:
            self.inline_scripts.append(self.inline)
            self.inline = None
        if tag == 'script' and self.schema is not None:
            self.schemas.append(json.loads(self.schema))
            self.schema = None

all_pages = {p.resolve(): Page(p.read_text(encoding='utf-8-sig')) for p in ROOT.rglob('*.html')}
pages = {p: page for p, page in all_pages.items() if not page.noindex}
errors = []
titles, canonicals = set(), set()
incoming = {p: set() for p in pages}
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
    for img in page.imgs:
        src = img.get('src', '<img without src>')
        if 'alt' not in img:
            errors.append(f'{rel}: image {src} missing alt attribute')
        elif not img['alt'].strip() and 'hero-poster' not in src:
            errors.append(f'{rel}: non-decorative image {src} has empty alt')
        if not str(img.get('width', '')).isdigit() or not str(img.get('height', '')).isdigit():
            errors.append(f'{rel}: image {src} missing numeric width/height')
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
    for href in page.anchors:
        parsed = urlsplit(href)
        if parsed.scheme not in ('', 'http', 'https'): continue
        if parsed.netloc and parsed.netloc not in (HOST, 'www.' + HOST): continue
        part = unquote(parsed.path)
        target = (ROOT / part.lstrip('/')) if (parsed.netloc or part.startswith('/')) else (path.parent / part if part else path)
        if target.is_dir(): target /= 'index.html'
        target = target.resolve()
        if target in incoming and target != path:
            incoming[target].add(path)

ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [x.text for x in ET.parse(ROOT / 'sitemap.xml').findall('.//sm:loc', ns)]
if len(urls) != len(set(urls)): errors.append('Sitemap contains duplicate URLs')
if set(urls) != canonicals: errors.append('Sitemap and canonical page URLs differ')
config = re.compile(r'''gtag\(\s*['"]config['"]\s*,\s*['"]''' + ANALYTICS_ID + r'''['"]''')
for path, page in pages.items():
    if not page.canonicals or page.canonicals[0] not in urls: continue
    rel = path.relative_to(ROOT)
    loader = any(
        urlsplit(src).netloc == 'www.googletagmanager.com' and urlsplit(src).path == '/gtag/js'
        and parse_qs(urlsplit(src).query).get('id') == [ANALYTICS_ID]
        for src in page.script_srcs)
    if not loader or not any(config.search(script) for script in page.inline_scripts):
        errors.append(f'{rel}: missing Google Analytics tag {ANALYTICS_ID}')
    faq = dimensions(' '.join(a for schema in page.schemas for a in answers(schema)))
    if faq and faq != dimensions(page.text):
        errors.append(f'{rel}: FAQ setup dimensions {sorted(faq)} do not match visible text {sorted(dimensions(page.text))}')
    if len(incoming[path]) < 2:
        errors.append(f'{rel}: expected at least 2 incoming internal links, got {len(incoming[path])}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, unique titles/canonicals, descriptions, JSON-LD, sitemap, local links and fragments, Analytics tag, FAQ setup dimensions, incoming links, image dimensions/alt')

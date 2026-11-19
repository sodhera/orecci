// Builds the Speaking Coach pages on orecci.com from _src/content.
// Usage: node _src/build.mjs [--check]   (--check validates without writing)
// No dependencies. Output: speaking-coach/**, sitemap.xml, robots.txt, llms.txt, feed.xml, and every
// other page on orecci.com (home, 404, each app's legal pages) from _src/static/<path>.html, wrapped in
// the same header, footer and styles. Edit those sources, never the generated .html at the root. Documents
// copied from an app repo (VerseBlock's exports) go in as the <main> content with a <!--static {…} --> header.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(SRC);
const OUT = path.join(ROOT, 'speaking-coach');
const ORIGIN = 'https://www.orecci.com';
const BASE = '/speaking-coach';
const CHECK_ONLY = process.argv.includes('--check');
const FORCE = process.argv.includes('--force'); // write even with errors (drafts only)

export const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'sv', 'tr', 'ru', 'uk', 'hi', 'ar', 'ja', 'ko', 'zh', 'id', 'fil', 'vi'];
const HREFLANG = { pt: 'pt-BR', zh: 'zh-Hans' };
const SPEECH_LANG = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', pt: 'pt-BR', nl: 'nl-NL', pl: 'pl-PL', sv: 'sv-SE', tr: 'tr-TR', ru: 'ru-RU', uk: 'uk-UA', hi: 'hi-IN', ar: 'ar-SA', ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN', id: 'id-ID', fil: 'fil-PH', vi: 'vi-VN' };
const RTL = new Set(['ar']);
// Sections in nav/home order. `pages` = loose pages served at /speaking-coach/<slug>/.
export const SECTIONS = ['tools', 'interview-questions', 'interview-questions-by-role', 'interviews', 'speeches', 'presentations', 'small-talk', 'guides', 'compare', 'best', 'glossary', 'pages'];
const NAV = ['interview-questions', 'speeches', 'small-talk', 'tools'];
const APP_STORE = 'https://apps.apple.com/app/id6767124039';
const PLAY = 'https://play.google.com/store/apps/details?id=com.sodhera.speakingcoach';
const CHATGPT = 'https://chatgpt.com/';
// App Store Connect's provider token (App Analytics → Campaigns). When set, App Store links carry a
// campaign per page type, so installs from these pages show up by campaign. Empty: plain links;
// App Store Connect still counts orecci.com under Web Referrers.
const APPLE_PROVIDER_TOKEN = '';
// PostHog's public project key (Sodhera, project 616125), the same one the apps use.
const POSTHOG_KEY = 'phc_ALgrnBzj9vrzd5ETJZPS3WSAPMGkBboz9dWHWwvaQmy2';

// Store links that say where the visitor came from: Google Play keeps the UTM referrer for Play
// Console's acquisition reports; the App Store takes a campaign once the provider token is set.
// `place` is where on the page the button sits (top or end).
function storeLinks(p, lang, place) {
  const section = p.section || 'hub';
  const slug = p.slug || (p.hub ? 'hub' : 'home');
  const campaign = `${section}-${place}`.slice(0, 40);
  const referrer = `utm_source=orecci&utm_medium=website&utm_campaign=${campaign}&utm_content=${lang}-${slug}`.slice(0, 200);
  const appStore = APPLE_PROVIDER_TOKEN ? `${APP_STORE}?pt=${APPLE_PROVIDER_TOKEN}&ct=${encodeURIComponent(`orecci-${campaign}`)}&mt=8` : APP_STORE;
  return { appStore, play: `${PLAY}&referrer=${encodeURIComponent(referrer)}`, chatgpt: CHATGPT };
}
const TOOLS = new Set(['speech-checker', 'filler-counter', 'pace-checker', 'speech-length', 'role-questions']);

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// ---------- parsing ----------
function parseFrontmatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) { err(file, 'missing --- frontmatter'); return { meta: {}, body: text }; }
  const meta = {};
  let listKey = null;
  for (const raw of m[1].split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const item = raw.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { meta[listKey].push(item[1].trim()); continue; }
    const kv = raw.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) { err(file, `bad frontmatter line: ${raw}`); continue; }
    const [, k, v] = kv;
    if (v === '' || v.startsWith('#')) { meta[k] = []; listKey = k; } else { meta[k] = unquote(v.trim()); listKey = null; }
  }
  return { meta, body: m[2] };
}
const unquote = (v) => (/^".*"$/.test(v) ? v.slice(1, -1).replace(/\\"/g, '"') : v.replace(/\s+#\s.*$/, ''));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s, ctx) {
  let out = esc(s);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
    const h = href.replace(/&amp;/g, '&');
    if (h.startsWith('/')) ctx.links.push(h);
    // A link to a Speaking Coach page that isn't written yet is shown as plain text.
    if (h.startsWith(BASE)) { const c = h.split('#')[0]; if (!allUrls.has(c.endsWith('/') ? c : c + '/')) return t; }
    const ext = /^https?:/.test(h) && !h.startsWith(ORIGIN);
    return `<a href="${esc(h)}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return out;
}

// Markdown subset: ## / ### headings, paragraphs, - and 1. lists, pipe tables, > example boxes.
// "## FAQ" (any language: frontmatter faq_heading or the ui faq string) is pulled out as the FAQ.
function renderMarkdown(body, ctx) {
  const lines = body.replace(/\r/g, '').split('\n');
  const html = [];
  const faq = [];
  let i = 0;
  let inFaq = false;
  let curQ = null;
  const flushQ = () => { if (curQ) { faq.push(curQ); curQ = null; } };
  const isFaqHeading = (t) => ctx.faqHeadings.some((h) => t.trim().toLowerCase() === h.toLowerCase());
  const push = (s) => { if (inFaq && curQ) curQ.html.push(s); else if (!inFaq) html.push(s); };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^##\s+(.*)$/))) {
      flushQ();
      if (isFaqHeading(m[1])) { inFaq = true; i++; continue; }
      inFaq = false;
      html.push(`<h2 id="${slugify(m[1])}">${inline(m[1], ctx)}</h2>`);
      ctx.headings.push(m[1]);
      i++; continue;
    }
    if ((m = line.match(/^###\s+(.*)$/))) {
      if (inFaq) { flushQ(); curQ = { q: m[1].trim(), html: [], text: [] }; i++; continue; }
      html.push(`<h3>${inline(m[1], ctx)}</h3>`); i++; continue;
    }
    if (/^\s*\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = (r) => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      const bodyRows = rows.slice(1).filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r)).map(cells);
      push(`<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c, ctx)}</th>`).join('')}</tr></thead><tbody>${bodyRows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, ctx)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      if (curQ) curQ.text.push(rows.join(' '));
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+[.)]\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const l = lines[i];
        if (/^\s{2,}\S/.test(l) && !/^\s*([-*]|\d+[.)])\s+/.test(l)) items[items.length - 1] += ' ' + l.trim();
        else items.push(l.replace(/^\s*([-*]|\d+[.)])\s+/, ''));
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      push(`<${tag}>${items.map((it) => `<li>${inline(inFaq ? it : autoLink(it, ctx), ctx)}</li>`).join('')}</${tag}>`);
      if (curQ) curQ.text.push(items.join(' '));
      continue;
    }
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      const paras = q.join('\n').split(/\n\s*\n/).map((p) => `<p>${inline(p.replace(/\n/g, ' '), ctx)}</p>`).join('');
      push(`<div class="example">${paras}</div>`);
      if (curQ) curQ.text.push(q.join(' '));
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\s*\||\s*[-*]\s+|\s*\d+[.)]\s+|>)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
    const text = para.join(' ');
    push(`<p>${inline(inFaq ? text : autoLink(text, ctx), ctx)}</p>`);
    if (curQ) curQ.text.push(text);
  }
  flushQ();
  return { html: html.join('\n'), faq };
}

function slugify(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section';
}
const plain = (s) => String(s).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1');
const wordCount = (s, lang) => (['ja', 'zh'].includes(lang) ? Math.round(plain(s).replace(/\s/g, '').length / 2.5) : plain(s).split(/\s+/).filter(Boolean).length);

// ---------- load ----------
function loadUi(lang) {
  const f = path.join(SRC, 'content', lang, '_ui.json');
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { err(f, `bad JSON: ${e.message}`); return null; }
}

const uiEn = loadUi('en');
const ui = {};
const pages = [];
for (const lang of LANGS) {
  const dir = path.join(SRC, 'content', lang);
  if (!fs.existsSync(dir)) continue;
  const u = loadUi(lang);
  if (!u) { err(dir, 'missing _ui.json'); continue; }
  ui[lang] = deepMerge(uiEn, u);
  for (const k of Object.keys(flatten(uiEn))) if (!(k in flatten(u))) warn(`${lang}/_ui.json`, `missing key ${k} (falls back to English)`);
  const files = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.md')) files.push(p); } };
  walk(dir);
  for (const f of files) {
    const rel = path.relative(dir, f).replace(/\\/g, '/');
    const parts = rel.replace(/\.md$/, '').split('/');
    let section, slug;
    if (parts.length === 1 && parts[0] === 'home') { section = 'home'; slug = ''; }
    else if (parts.length === 2 && SECTIONS.includes(parts[0])) { [section, slug] = parts; }
    else { err(f, 'must be home.md or <section>/<slug>.md'); continue; }
    if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(f, `slug "${slug}" must be lowercase a-z, 0-9 and hyphens`);
    const { meta, body } = parseFrontmatter(fs.readFileSync(f, 'utf8'), path.relative(ROOT, f));
    pages.push({ lang, section, slug, meta, body, file: path.relative(ROOT, f) });
  }
}

function flatten(o, p = '') { const r = {}; for (const [k, v] of Object.entries(o || {})) { if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(r, flatten(v, p + k + '.')); else r[p + k] = v; } return r; }
function deepMerge(a, b) { const r = { ...a }; for (const [k, v] of Object.entries(b || {})) r[k] = v && typeof v === 'object' && !Array.isArray(v) && a?.[k] && typeof a[k] === 'object' ? deepMerge(a[k], v) : v; return r; }

const urlOf = (lang, section, slug) => {
  const l = lang === 'en' ? '' : `/${lang}`;
  if (section === 'home') return `${BASE}${l}/`;
  if (section === 'pages') return `${BASE}${l}/${slug}/`;
  if (!slug) return `${BASE}${l}/${section}/`;
  return `${BASE}${l}/${section}/${slug}/`;
};
for (const p of pages) p.url = urlOf(p.lang, p.section, p.slug);

// Hubs: one per section with pages, per language.
const hubs = [];
for (const lang of Object.keys(ui)) {
  for (const s of SECTIONS) {
    if (s === 'pages') continue;
    const members = pages.filter((p) => p.lang === lang && p.section === s);
    if (members.length) hubs.push({ lang, section: s, url: urlOf(lang, s, ''), members, hub: true });
  }
}
const allUrls = new Set([...pages.map((p) => p.url), ...hubs.map((h) => h.url)]);
const byKey = new Map(pages.map((p) => [`${p.lang}|${p.section}|${p.slug}`, p]));

// ---------- automatic internal links ----------
// Every page links to a few pages of its own section, and some sections link across (questions to
// roles, best-of lists to comparisons). No page then depends on its hub alone to be found: half of
// each list is picked by rotation, so every page of a section is linked from the same number of
// pages, and the other half by shared words in slug and breadcrumb, so the links are relevant.
const CROSS = {
  'interview-questions': [['interview-questions-by-role', 6]],
  'interview-questions-by-role': [['interview-questions', 6]],
  interviews: [['interview-questions', 6]],
  best: [['compare', 30]],
  compare: [['best', 8]],
  glossary: [['guides', 4]],
  guides: [['glossary', 4]],
  presentations: [['guides', 4]],
  speeches: [['guides', 4]],
};
const bySection = new Map();
for (const p of pages) { const k = `${p.lang}|${p.section}`; if (!bySection.has(k)) bySection.set(k, []); bySection.get(k).push(p); }
for (const list of bySection.values()) list.sort((a, b) => a.slug.localeCompare(b.slug));
// Job families for the role pages (_src/role-families.json): a nurse page links to other healthcare
// roles first. Slugs alone ("web-developer", "software-engineer") don't show that they belong together.
const familyOf = new Map();
for (const [family, slugs] of Object.entries(JSON.parse(fs.readFileSync(path.join(SRC, 'role-families.json'), 'utf8')))) for (const slug of slugs) { if (familyOf.has(slug)) err('_src/role-families.json', `${slug} is in two families`); familyOf.set(slug, family); }
const docFreq = new Map();
const langSize = new Map();
for (const p of pages) {
  if (p.section === 'interview-questions-by-role') { p.family = familyOf.get(p.slug); if (!p.family) warn(p.file, 'role is in no family in _src/role-families.json'); }
  p.tokens = new Set(`${p.slug} ${p.meta.breadcrumb || ''}`.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2));
  for (const w of p.tokens) docFreq.set(`${p.lang}|${w}`, (docFreq.get(`${p.lang}|${w}`) || 0) + 1);
  langSize.set(p.lang, (langSize.get(p.lang) || 0) + 1);
}
function pickLinks(p, section, count, taken) {
  const pool = (bySection.get(`${p.lang}|${section}`) || []).filter((q) => q !== p && !taken.has(q.url));
  if (!pool.length) return [];
  count = Math.min(count, pool.length);
  const idx = Math.max(0, (bySection.get(`${p.lang}|${p.section}`) || []).indexOf(p));
  const turn = Math.ceil(count / 2);
  const start = section === p.section ? idx : idx * turn;
  const rotated = [];
  for (let i = 0; rotated.length < turn; i++) rotated.push(pool[(start + i) % pool.length]);
  const n = langSize.get(p.lang);
  // Ties go to the pages that follow this one, so the similar links also spread over the section.
  const after = (q) => (pool.indexOf(q) - start % pool.length + pool.length) % pool.length;
  const similar = pool.filter((q) => !rotated.includes(q)).map((q) => { let score = p.family && p.family === q.family ? 3 : 0; for (const w of q.tokens) if (p.tokens.has(w)) score += Math.log(n / docFreq.get(`${p.lang}|${w}`)); return [score, q]; })
    .filter(([score]) => score > 1.5).sort((a, b) => b[0] - a[0] || after(a[1]) - after(b[1])).slice(0, count - turn).map(([, q]) => q);
  const picks = [...similar, ...rotated];
  for (let i = turn; picks.length < count; i++) { const q = pool[(start + i) % pool.length]; if (!picks.includes(q)) picks.push(q); }
  return picks;
}

// Glossary terms are linked where a page first uses them (at most three per page), so each
// definition is one click from the pages that use the word.
const SKIP_TERMS = new Set(['pause', 'cadence']); // everyday words that mostly mean something else
const glossaryTerms = new Map();
for (const p of pages.filter((q) => q.section === 'glossary')) {
  const term = (p.meta.breadcrumb || '').toLowerCase().trim();
  if (!term || term.includes(',') || SKIP_TERMS.has(term)) continue;
  const pattern = term.split(/[\s-]+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s-]');
  if (!glossaryTerms.has(p.lang)) glossaryTerms.set(p.lang, []);
  glossaryTerms.get(p.lang).push({ url: p.url, length: term.length, re: new RegExp(`(?<![\\p{L}\\p{N}-])${pattern}(?:s|es)?(?![\\p{L}\\p{N}-])`, 'iu') });
}
for (const list of glossaryTerms.values()) list.sort((a, b) => b.length - a.length);
const MD_LINK = /(\[[^\]]+\]\([^)\s]+\))/;
function autoLink(text, ctx) {
  if (!ctx.terms) return text;
  for (const term of ctx.terms) {
    if (ctx.autoLinks >= 3) break;
    if (ctx.linked.has(term.url)) continue;
    const parts = text.split(MD_LINK);
    for (let i = 0; i < parts.length; i += 2) {
      const m = term.re.exec(parts[i]);
      if (!m) continue;
      parts[i] = `${parts[i].slice(0, m.index)}[${m[0]}](${term.url})${parts[i].slice(m.index + m[0].length)}`;
      ctx.linked.add(term.url); ctx.autoLinks++;
      break;
    }
    text = parts.join('');
  }
  return text;
}

// ---------- validation of each page ----------
const REQUIRED = ['title', 'description', 'answer', 'updated'];
const titleSeen = new Map();
for (const p of pages) {
  for (const k of REQUIRED) if (!p.meta[k]) err(p.file, `missing ${k}`);
  if (p.meta.title && p.meta.title.length > 75) warn(p.file, `title is ${p.meta.title.length} chars (keep under 70)`);
  if (p.meta.description && (p.meta.description.length > 170 || p.meta.description.length < 50)) warn(p.file, `description is ${p.meta.description.length} chars (50–160)`);
  if (p.meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(p.meta.updated)) err(p.file, 'updated must be YYYY-MM-DD');
  const key = `${p.lang}|${(p.meta.title || '').toLowerCase()}`;
  if (titleSeen.has(key)) err(p.file, `duplicate title with ${titleSeen.get(key)}`); else titleSeen.set(key, p.file);
  if (p.meta.tool && !TOOLS.has(p.meta.tool)) err(p.file, `unknown tool ${p.meta.tool}`);
}

// ---------- templates ----------
function t(lang, key) { return key.split('.').reduce((o, k) => o?.[k], ui[lang]) ?? key.split('.').reduce((o, k) => o?.[k], uiEn) ?? key; }

function alternates(p) {
  if (p.hub) return Object.keys(ui).filter((l) => allUrls.has(urlOf(l, p.section, ''))).map((l) => [l, urlOf(l, p.section, '')]);
  return Object.keys(ui).map((l) => byKey.get(`${l}|${p.section}|${p.slug}`)).filter(Boolean).map((q) => [q.lang, q.url]);
}

// ---------- shared header and footer (every page on orecci.com) ----------
// The apps whose legal documents live on orecci.com, in the order the home page lists them.
const LEGAL_APPS = [['speakingcoach', 'Speaking Coach'], ['verseblock', 'VerseBlock'], ['sleepblock', 'SleepBlock'], ['journalblock', 'JournalBlock'], ['bhetam', 'Bhetam'], ['jyotish', 'Jyotish Baje'], ['pdf-all-in-one', 'PDF All-in-One'], ['gymblock', 'GymBlock']];

function siteHeader(lang, alts = []) {
  const langOptions = Object.keys(ui).map((l) => { const a = alts.find(([x]) => x === l); return `<option value="${a ? a[1] : urlOf(l, 'home', '')}"${l === lang ? ' selected' : ''}>${esc(ui[l].language_name)}</option>`; }).join('');
  const nav = NAV.filter((s) => allUrls.has(urlOf(lang, s, ''))).map((s) => `<a href="${urlOf(lang, s, '')}">${esc(t(lang, `sections.${s}.nav`))}</a>`).join('');
  return `      <header class="site-header">
        <nav class="nav sc-nav" aria-label="${esc(t(lang, 'main_nav'))}">
          <a class="brand" href="${lang === 'en' ? '/' : urlOf(lang, 'home', '')}">
            <img class="brand-logo" src="/app_logo_rounded.png" alt="" width="36" height="36">
            <span>Speaking Coach</span>
          </a>
          <div class="nav-links">${nav}</div>
          <label class="lang-pick"><span class="visually-hidden">${esc(t(lang, 'language'))}</span>
            <select onchange="location.href=this.value" aria-label="${esc(t(lang, 'language'))}">${langOptions}</select>
          </label>
        </nav>
      </header>`;
}

function siteFooter(lang) {
  const links = [['pages', 'about'], ['pages', 'how-we-review'], ['pages', 'chatgpt']].map(([s, slug]) => byKey.get(`${lang}|${s}|${slug}`) || byKey.get(`en|${s}|${slug}`)).filter(Boolean).map((q) => `<a href="${q.url}">${esc(q.meta.nav_label || q.meta.title)}</a>`).join('');
  const apps = LEGAL_APPS.map(([dir, name]) => `<a href="/${dir}/">${esc(name)}</a>`).join('');
  return `      <footer class="site-footer sc-footer">
        <div class="footer-inner">
          <div class="footer-links"><a href="${urlOf(lang, 'home', '')}">${esc(t(lang, 'home_crumb'))}</a>${links}<a href="/speakingcoach/">${esc(t(lang, 'privacy_terms'))}</a><a href="/sitemap.xml">Sitemap</a></div>
          <div class="footer-links footer-apps"><span>Legal documents:</span>${apps}</div>
          <p>${esc(t(lang, 'footer_line'))} © 2026 Sodhera Intelligence Private Limited.</p>
        </div>
      </footer>`;
}

function layout(p, { title, description, main, jsonld, lang }) {
  const alts = alternates(p);
  const altLinks = alts.length > 1 ? alts.map(([l, u]) => `<link rel="alternate" hreflang="${HREFLANG[l] || l}" href="${ORIGIN}${u}">`).join('\n    ') + (alts.find(([l]) => l === 'en') ? `\n    <link rel="alternate" hreflang="x-default" href="${ORIGIN}${alts.find(([l]) => l === 'en')[1]}">` : '') : '';
  return `<!doctype html>
<html lang="${HREFLANG[lang] || lang}"${RTL.has(lang) ? ' dir="rtl"' : ''}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <link rel="canonical" href="${ORIGIN}${p.url}">
    ${altLinks}
    <meta property="og:type" content="${p.hub || p.section === 'home' ? 'website' : 'article'}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${ORIGIN}${p.url}">
    <meta property="og:image" content="${ORIGIN}/app_logo_rounded.png">
    <meta property="og:site_name" content="Speaking Coach">
    <meta name="twitter:card" content="summary">
    <meta name="apple-itunes-app" content="app-id=6767124039">
    <link rel="icon" href="/app_logo_rounded.png">
    <link rel="alternate" type="application/atom+xml" title="Speaking Coach: new and updated guides" href="${BASE}/feed.xml">
    ${p.mdUrl ? `<link rel="alternate" type="text/markdown" href="${p.mdUrl}">` : ''}
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="${BASE}/assets/sc.css">
    <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
    <script src="${BASE}/assets/track.js" data-key="${POSTHOG_KEY}" data-section="${esc(p.section || 'hub')}" data-slug="${esc(p.slug || (p.hub ? 'hub' : 'home'))}" data-lang="${lang}" defer></script>
  </head>
  <body class="sc">
    <div class="site-shell">
${siteHeader(lang, alts)}
      <main class="sc-main">
${main}
      </main>
${siteFooter(lang)}
    </div>
  </body>
</html>
`;
}

function crumbs(p, lang) {
  const list = [[t(lang, 'home_crumb'), urlOf(lang, 'home', '')]];
  if (p.section !== 'home' && p.section !== 'pages') {
    list.push([t(lang, `sections.${p.section}.nav`), urlOf(lang, p.section, '')]);
  }
  if (!p.hub && p.section !== 'home') list.push([p.meta.breadcrumb || p.meta.title, p.url]);
  return list;
}

function crumbHtml(list) {
  return `<nav class="crumbs" aria-label="Breadcrumb">${list.map(([n, u], i) => (i === list.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${u}">${esc(n)}</a>`)).join('<span class="sep">›</span>')}</nav>`;
}

// The download box. `place` is 'top' (under the answer, or under the tool) or 'end' (after the
// article and its questions, for readers who got to the bottom). The end box uses the general
// heading, so the page doesn't show the same heading twice.
function ctaCard(p, lang, place = 'top') {
  const prompt = p.meta.practice_prompt || t(lang, 'cta.default_prompt');
  const chatgptNote = lang === 'en' ? '' : `<p class="cta-note">${esc(t(lang, 'cta.chatgpt_english_only'))}</p>`;
  const heading = place === 'end' ? t(lang, 'cta.heading') : (p.meta.practice_heading || t(lang, 'cta.heading'));
  const links = storeLinks(p, lang, place);
  return `<aside class="cta${place === 'end' ? ' cta-end' : ''}" aria-label="${esc(t(lang, 'cta.heading'))}" data-cta="${place}">
          <div>
            <p class="cta-kicker">${esc(t(lang, 'cta.kicker'))}</p>
            <h2>${esc(heading)}</h2>
            <p>${esc(t(lang, 'cta.body'))}</p>
            ${prompt ? `<p class="cta-prompt"><span>${esc(t(lang, 'cta.try_saying'))}</span> “${esc(prompt)}”</p>` : ''}
          </div>
          <div class="cta-actions">
            <a class="button" href="${esc(links.appStore)}" rel="noopener" data-store="app_store">${esc(t(lang, 'cta.app_store'))}</a>
            <a class="button secondary" href="${esc(links.play)}" rel="noopener" data-store="google_play">${esc(t(lang, 'cta.google_play'))}</a>
            <a class="button secondary" href="${esc(links.chatgpt)}" rel="noopener" data-store="chatgpt">${esc(t(lang, 'cta.chatgpt'))}</a>
            ${chatgptNote}
          </div>
        </aside>`;
}

// The free AI voice review (English pages only): the reader answers this page's question out loud
// and gets pace, fillers, pauses and quoted feedback from the review server. `review.js` does the work.
const REVIEW_MODE = { 'interview-questions': 'interview', 'interview-questions-by-role': 'interview', interviews: 'interview', speeches: 'speech', presentations: 'speech', 'small-talk': 'smalltalk' };
function reviewSetup(p) {
  const mode = p.meta.review_mode || REVIEW_MODE[p.section];
  if (!mode || p.lang !== 'en' || p.hub) return null;
  if (p.meta.review_question) return { mode, question: p.meta.review_question };
  const title = p.meta.title || '';
  // Titles are sometimes Title Case ("How Was Your Weekend?"); say the question in sentence case.
  const sentence = (x) => x.split(' ').map((w, i) => (i === 0 || w === 'I' || /^[A-Z0-9]{2,}/.test(w) ? w : w.toLowerCase())).join(' ');
  const asked = title.includes('?') ? sentence(title.slice(0, title.indexOf('?') + 1).trim()) : '';
  // "tell-me-about-a-time-you-failed" -> "Tell me about a time you failed."
  const fromSlug = (() => { const x = p.slug.replace(/-/g, ' '); return x.charAt(0).toUpperCase() + x.slice(1) + (/^(what|why|how|are|do|does|is|have|where|who|can|would|will|which|did|when)\b/.test(x) ? '?' : '.'); })();
  const name = (p.meta.breadcrumb || title).replace(/\?$/, '');
  const lower = name.charAt(0).toLowerCase() + name.slice(1);
  const question = {
    'interview-questions': asked || fromSlug,
    'interview-questions-by-role': (p.meta.questions || [])[0] || `Tell me about yourself and why you want to work as a ${lower}.`,
    interviews: 'Tell me about yourself.',
    speeches: `Give the opening of your ${lower}.`,
    presentations: `Give the first minute of your ${lower}.`,
    'small-talk': asked && asked.length <= 60 ? `Someone asks you: “${asked}” Answer and keep the conversation going.` : `The moment: ${lower}. Start the conversation the way you would, and keep it going for a minute.`,
  }[p.section] || 'Tell me about yourself.';
  return { mode, question: question.slice(0, 600) };
}

function reviewHtml(p, lang) {
  const setup = reviewSetup(p);
  if (!setup) return '';
  const links = storeLinks(p, lang, 'review');
  const cfg = { ...setup, slug: p.slug };
  const followUp = { interview: 'an AI interviewer asks the follow-up questions', speech: 'an AI audience listens and asks questions afterwards', smalltalk: 'an AI partner talks back, so you can keep a real conversation going' }[setup.mode];
  return `<section class="review" data-review aria-labelledby="review-${esc(p.slug)}">
          <script type="application/json" class="review-config">${JSON.stringify(cfg).replace(/</g, '\\u003c')}</script>
          <p class="cta-kicker">Free · no account</p>
          <h2 id="review-${esc(p.slug)}">Say your answer out loud and get feedback</h2>
          <div class="review-body"><noscript><p>Turn on JavaScript to record your answer.</p></noscript></div>
          <div class="review-upsell" data-cta="review" hidden>
            <p><strong>That was one answer.</strong> In the Speaking Coach app, ${followUp}, then you retry the moment and see what changed. Practise any interview, speech or conversation, in 20 languages.</p>
            <div class="row">
              <a class="button" href="${esc(links.appStore)}" rel="noopener" data-store="app_store">${esc(t(lang, 'cta.app_store'))}</a>
              <a class="button secondary" href="${esc(links.play)}" rel="noopener" data-store="google_play">${esc(t(lang, 'cta.google_play'))}</a>
            </div>
          </div>
        </section>
        <script src="${BASE}/assets/review.js" defer></script>`;
}

function toolHtml(p, lang) {
  const tool = p.meta.tool;
  const cfg = {
    tool, mode: p.meta.tool_mode || '', lang, speechLang: SPEECH_LANG[lang],
    fillers: (p.meta.fillers || t(lang, 'fillers') || []),
    prompts: p.meta.tool_prompts || [],
    // The speech length calculator can open on a page's own number (tool_minutes: 5).
    minutes: Number(p.meta.tool_minutes) || undefined, words: Number(p.meta.tool_words) || undefined,
    strings: ui[lang].tool || uiEn.tool,
  };
  if (tool === 'role-questions') cfg.rolesUrl = `${BASE}/assets/roles-${lang}.json`;
  return `<section class="tool" data-tool="${esc(tool)}" aria-label="${esc(p.meta.title)}">
          <script type="application/json" class="tool-config">${JSON.stringify(cfg).replace(/</g, '\\u003c')}</script>
          <noscript><p>${esc(t(lang, 'tool.noscript'))}</p></noscript>
        </section>
        <script src="${BASE}/assets/tools.js" defer></script>`;
}

const ORG = { '@type': 'Organization', '@id': `${ORIGIN}/#sodhera`, name: 'Sodhera Intelligence', legalName: 'Sodhera Intelligence Private Limited', url: 'https://www.sodhera.com' };
const APP = { '@type': 'MobileApplication', '@id': `${ORIGIN}${BASE}/#app`, name: 'Speaking Coach', operatingSystem: 'iOS, Android', applicationCategory: 'EducationalApplication', publisher: { '@id': ORG['@id'] }, installUrl: APP_STORE, sameAs: [APP_STORE, PLAY], image: `${ORIGIN}/app_logo_rounded.png` };

function fmtDate(d, lang) {
  try { return new Intl.DateTimeFormat(HREFLANG[lang] || lang, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T00:00:00Z')); } catch { return d; }
}

function renderPage(p) {
  const lang = p.lang;
  const ctx = { links: [], headings: [], faqHeadings: [t(lang, 'faq_heading'), 'FAQ', 'Frequently asked questions'] };
  if (p.section !== 'home' && p.section !== 'pages') {
    ctx.terms = glossaryTerms.get(lang);
    ctx.autoLinks = 0;
    // Never link a term to the page itself, or to a page this one already links to.
    ctx.linked = new Set([p.url, ...(p.meta.related || []), ...[...p.body.matchAll(/\]\((\/speaking-coach\/[^)#\s]*)/g)].map((m) => m[1])]);
  }
  const { html: bodyHtml, faq } = renderMarkdown(p.body, ctx);
  p.faq = faq;
  p.links = ctx.links;
  const answerHtml = inline(p.meta.answer || '', ctx);
  const isContent = p.section !== 'home';
  const words = wordCount(p.body + ' ' + (p.meta.answer || ''), lang);
  const min = { glossary: 150, pages: 250, home: 150, tools: 250 }[p.section] ?? 450;
  if (words < min) warn(p.file, `only ${words} words (min ${min})`);
  if (isContent && p.section !== 'pages' && (faq.length < 3 || faq.length > 8)) warn(p.file, `${faq.length} FAQ questions (want 4–6)`);
  for (const q of faq) if (!q.text.join(' ').trim()) err(p.file, `FAQ "${q.q}" has no answer`);
  const related = (p.meta.related || []).map((u) => {
    const target = pages.find((q) => q.url === u) || hubs.find((h) => h.url === u);
    if (!target) { warn(p.file, `related link ${u} does not exist yet (skipped)`); return null; }
    return target;
  }).filter(Boolean);
  const taken = new Set([p.url, ...related.map((r) => r.url)]);
  const more = [];
  if (isContent && p.section !== 'pages') {
    for (const [s, n] of [[p.section, 8], ...(CROSS[p.section] || [])]) {
      const picks = pickLinks(p, s, n, taken);
      if (!picks.length) continue;
      for (const q of picks) taken.add(q.url);
      more.push(`<section class="more-links"><h2>${esc(t(lang, `sections.${s}.nav`))}</h2><ul>${picks.map((q) => `<li><a href="${q.url}">${esc(q.meta.title)}</a></li>`).join('')}</ul><a class="more" href="${urlOf(lang, s, '')}">${esc(t(lang, 'see_all'))} (${bySection.get(`${lang}|${s}`).length}) →</a></section>`);
    }
  }
  const sources = (p.meta.sources || []).map((s) => { const [title, url] = s.split(/\s+\|\s+/); if (!/^https?:\/\//.test(url || '')) err(p.file, `source needs "Title | URL": ${s}`); return { title, url }; });
  const list = crumbs(p, lang);
  const byline = `${esc(t(lang, 'byline'))} · <time datetime="${esc(p.meta.updated)}">${esc(t(lang, 'updated'))} ${esc(fmtDate(p.meta.updated, lang))}</time>`;
  const homeExtra = p.section === 'home' ? homeSections(lang) : '';
  const tool = p.meta.tool ? toolHtml(p, lang) : '';
  const main = `        <article class="page${p.meta.tool ? ' has-tool' : ''}">
          ${p.section === 'home' ? '' : crumbHtml(list)}
          <header class="page-head">
            ${p.meta.eyebrow ? `<p class="eyebrow">${esc(p.meta.eyebrow)}</p>` : ''}
            <h1>${esc(p.meta.title)}</h1>
            <p class="byline">${byline}</p>
          </header>
          <div class="answer">${answerHtml.split(/\n\n/).map((x) => `<p>${x}</p>`).join('')}</div>
          ${reviewHtml(p, lang)}${tool}
          ${ctaCard(p, lang)}
          <div class="prose">
${bodyHtml}
          </div>
          ${faq.length ? `<section class="faq"><h2>${esc(t(lang, 'faq_heading'))}</h2>${faq.map((q) => `<details><summary>${esc(q.q)}</summary>${q.html.join('')}</details>`).join('')}</section>` : ''}
          ${isContent && p.section !== 'pages' ? ctaCard(p, lang, 'end') : ''}
          ${homeExtra}
          ${related.length ? `<section class="related"><h2>${esc(t(lang, 'related'))}</h2><ul class="card-list">${related.map((r) => `<li><a href="${r.url}"><strong>${esc(r.hub ? t(lang, `sections.${r.section}.title`) : r.meta.title)}</strong><span>${esc(r.hub ? t(lang, `sections.${r.section}.intro`) : r.meta.description)}</span></a></li>`).join('')}</ul></section>` : ''}
          ${more.join('\n          ')}
          ${sources.length ? `<section class="sources"><h2>${esc(t(lang, 'sources'))}</h2><ol>${sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title)}</a></li>`).join('')}</ol></section>` : ''}
        </article>`;
  const graph = [ORG, APP,
    { '@type': 'BreadcrumbList', itemListElement: list.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: ORIGIN + u })) },
  ];
  if (isContent) graph.push({ '@type': 'Article', headline: p.meta.title, description: p.meta.description, image: `${ORIGIN}/app_logo_rounded.png`, inLanguage: HREFLANG[lang] || lang, dateModified: p.meta.updated, datePublished: p.meta.published || p.meta.updated, author: { '@id': ORG['@id'] }, publisher: { '@id': ORG['@id'] }, mainEntityOfPage: ORIGIN + p.url, about: { '@id': APP['@id'] } });
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: plain(q.text.join(' ')) } })) });
  if (p.section === 'glossary') graph.push({ '@type': 'DefinedTerm', '@id': `${ORIGIN}${p.url}#term`, name: p.meta.breadcrumb || p.meta.title, description: plain(p.meta.answer || ''), url: ORIGIN + p.url, inDefinedTermSet: ORIGIN + urlOf(lang, 'glossary', '') });
  if (p.meta.tool) graph.push({ '@type': 'WebApplication', name: p.meta.breadcrumb || p.meta.title, url: ORIGIN + p.url, description: p.meta.description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, inLanguage: HREFLANG[lang] || lang, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': ORG['@id'] } });
  const title = p.section === 'home' ? p.meta.title : `${p.meta.title} | Speaking Coach`;
  return layout(p, { title, description: p.meta.description, main, jsonld: { '@context': 'https://schema.org', '@graph': graph }, lang });
}

function homeSections(lang) {
  return `<section class="hub-grid">${SECTIONS.filter((s) => s !== 'pages').map((s) => hubs.find((h) => h.lang === lang && h.section === s)).filter(Boolean).map((h) => `
            <div class="hub-card">
              <h2><a href="${h.url}">${esc(t(lang, `sections.${h.section}.title`))}</a></h2>
              <p>${esc(t(lang, `sections.${h.section}.intro`))}</p>
              <ul>${h.members.slice(0, 6).map((m) => `<li><a href="${m.url}">${esc(m.meta.breadcrumb || m.meta.title)}</a></li>`).join('')}</ul>
              <a class="more" href="${h.url}">${esc(t(lang, 'see_all'))} (${h.members.length}) →</a>
            </div>`).join('')}
          </section>`;
}

function renderHub(h) {
  const lang = h.lang;
  const list = crumbs(h, lang);
  const members = [...h.members].sort((a, b) => (Number(a.meta.order) || 999) - (Number(b.meta.order) || 999) || a.meta.title.localeCompare(b.meta.title, lang));
  const title = t(lang, `sections.${h.section}.title`);
  const intro = t(lang, `sections.${h.section}.intro`);
  const main = `        <article class="page hub">
          ${crumbHtml(list)}
          <header class="page-head"><h1>${esc(title)}</h1><p class="byline">${esc(t(lang, 'byline'))}</p></header>
          <div class="answer"><p>${esc(intro)}</p></div>
          <ul class="card-list">${members.map((m) => `<li><a href="${m.url}"><strong>${esc(m.meta.title)}</strong><span>${esc(m.meta.description)}</span></a></li>`).join('')}</ul>
          ${ctaCard({ meta: {} }, lang)}
        </article>`;
  const graph = [ORG, APP,
    { '@type': 'BreadcrumbList', itemListElement: list.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: ORIGIN + u })) },
    { '@type': 'CollectionPage', name: title, description: intro, inLanguage: HREFLANG[lang] || lang, url: ORIGIN + h.url, hasPart: members.map((m) => ({ '@type': 'WebPage', name: m.meta.title, url: ORIGIN + m.url })) }];
  return layout(h, { title: `${title} | Speaking Coach`, description: intro, main, jsonld: { '@context': 'https://schema.org', '@graph': graph }, lang });
}

function markdownCopy(p) {
  return `# ${p.meta.title}\n\n${plain(p.meta.answer || '')}\n\n${t(p.lang, 'byline')}. ${t(p.lang, 'updated')} ${p.meta.updated}. Source: ${ORIGIN}${p.url}\n\n${p.body.trim()}\n\n---\nSpeaking Coach on the App Store: ${APP_STORE}\nSpeaking Coach on Google Play: ${PLAY}\n`;
}



// ---------- the rest of orecci.com ----------
// The home page, the 404 page and every app's legal pages live in _src/static/<path>.html: a JSON
// header (title, description, app, document tabs, note) and the page's own content, kept word for
// word. They get the same header, footer and styles as the Speaking Coach pages.
const STATIC = path.join(SRC, 'static');
const MONTHS = 'january february march april may june july august september october november december'.split(' ');
let staticPages = [];
function readStatic() {
  const list = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith('.html')) list.push(f); } };
  if (fs.existsSync(STATIC)) walk(STATIC);
  return list.sort().map((f) => {
    const raw = fs.readFileSync(f, 'utf8');
    const m = /^<!--static\n([\s\S]*?)\n-->\n/.exec(raw);
    if (!m) { err(f, 'missing <!--static {…} --> header'); return null; }
    const meta = JSON.parse(m[1]);
    const rel = path.relative(STATIC, f).replace(/\\/g, '/');
    const url = '/' + rel.replace(/(^|\/)index\.html$/, '$1');
    // "Last updated September 5, 2026" / "5 September 2026" in the page's note → sitemap date.
    const d = /(\d{1,2})\s+([a-z]+)\s+(\d{4})|([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/i.exec(meta.footer_note || '');
    let lastmod = meta.updated || '';
    if (!lastmod && d) { const [day, mon, yr] = d[1] ? [d[1], d[2], d[3]] : [d[5], d[4], d[6]]; const mi = MONTHS.indexOf(mon.toLowerCase()); if (mi >= 0) lastmod = `${yr}-${String(mi + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; }
    return { rel, url, meta, lastmod, body: raw.slice(m[0].length) };
  }).filter(Boolean);
}

function renderStatic(sp) {
  const { meta, url, rel } = sp;
  const dir = rel.includes('/') ? rel.split('/')[0] : '';
  // The root's own legal pages (privacy-policy.html…) belong to Speaking Coach, whose hub is /speakingcoach/.
  const appDir = dir || (meta.app === 'root' || rel === '404.html' ? '' : 'speakingcoach');
  const app = LEGAL_APPS.find(([d]) => d === appDir);
  const abs = (h) => new URL(h, ORIGIN + url).pathname;
  const isHub = app && url === `/${appDir}/`;
  const tabs = (meta.tabs || []).map(([h, label]) => [abs(h), label]);
  const current = tabs.find(([h]) => h === url);
  const crumbs = app ? [['Home', '/'], ['Legal documents', '/#legal'], [app[1], `/${appDir}/`], ...(isHub ? [] : [[current ? current[1] : meta.title.split(/\s[|—-]\s/)[0], url]])] : [];
  // Pages without their own logo (VerseBlock's exported documents) use their app hub's.
  const hub = staticPages.find((q) => q.url === `/${appDir}/`);
  const logo = meta.logo ? abs(meta.logo) : hub?.meta.logo ? new URL(hub.meta.logo, ORIGIN + hub.url).pathname : (appDir === 'speakingcoach' ? '/app_logo_rounded.png' : '');
  const legalBar = app ? `      <div class="legal-bar">
        <div class="legal-bar-inner">
          ${crumbHtml(crumbs)}
          <div class="legal-app">${logo ? `<img src="${esc(logo)}" alt="" width="32" height="32">` : ''}<strong>${esc(app[1])}</strong></div>
          ${tabs.length ? `<nav class="legal-tabs" aria-label="${esc(app[1])} documents">${tabs.map(([h, label]) => `<a href="${esc(h)}"${h === url ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</nav>` : ''}
        </div>
      </div>\n` : '';
  const note = meta.footer_note && !/^Sodhera Intelligence Private Limited$/.test(meta.footer_note) ? `<p class="doc-note">${esc(meta.footer_note)}</p>` : '';
  const graph = meta.jsonld && meta.jsonld.length ? null : {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': ORIGIN + url, url: ORIGIN + url, name: meta.title, description: meta.description, inLanguage: 'en', isPartOf: { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: 'Speaking Coach' }, publisher: ORG, ...(sp.lastmod ? { dateModified: sp.lastmod } : {}) },
      ...(crumbs.length ? [{ '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: ORIGIN + u.replace('#legal', '') })) }] : []),
    ],
  };
  const ld = graph ? `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>` : meta.jsonld.map((j) => `<script type="application/ld+json">${j}</script>`).join('\n    ');
  const robots = meta.noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}">
    <meta name="robots" content="${robots}">
    ${rel === '404.html' ? '' : `<link rel="canonical" href="${ORIGIN}${url}">`}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(meta.title)}">
    <meta property="og:description" content="${esc(meta.description)}">
    <meta property="og:url" content="${ORIGIN}${url}">
    <meta property="og:image" content="${ORIGIN}${logo && appDir !== 'speakingcoach' ? logo : '/app_logo_rounded.png'}">
    <meta property="og:site_name" content="Speaking Coach">
    <meta name="twitter:card" content="summary">
    <link rel="icon" href="/app_logo_rounded.png">
    <link rel="alternate" type="application/atom+xml" title="Speaking Coach: new and updated guides" href="${BASE}/feed.xml">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="${BASE}/assets/sc.css">
    ${ld}
    ${meta.styles || ''}
    <script src="${BASE}/assets/track.js" data-key="${POSTHOG_KEY}" data-section="${meta.app === 'root' ? 'root' : rel === '404.html' ? '404' : 'legal'}" data-slug="${esc(rel.replace(/\.html$/, ''))}" data-lang="en" defer></script>
  </head>
  <body class="sc${meta.body_class ? ' ' + esc(meta.body_class) : ''}${app ? ' legal' : ''}">
    <div class="site-shell">
${siteHeader('en')}
${legalBar}      <main class="sc-main${meta.main_class ? ' ' + esc(meta.main_class) : ''}">
${sp.body.trimEnd()}
        ${note}
      </main>
${siteFooter('en')}
    </div>
  </body>
</html>
`;
}

// ---------- build ----------
function main() {
  for (const p of pages) p.mdUrl = `${p.url}index.md`;
  const outputs = new Map();
  for (const p of pages) { outputs.set(p.url, renderPage(p)); }
  for (const h of hubs) outputs.set(h.url, renderHub(h));
  // link check (after rendering, links collected)
  for (const p of pages) for (const l of p.links || []) {
    const clean = l.split('#')[0];
    if (clean.startsWith(BASE) && !allUrls.has(clean.endsWith('/') ? clean : clean + '/')) warn(p.file, `link to unwritten page ${l} (shown as text)`);
  }
  const missingHome = Object.keys(ui).filter((l) => !byKey.get(`${l}|home|`));
  for (const l of missingHome) err(`${l}`, 'missing home.md');

  // Roles data for the role-questions tool: from interview-questions-by-role pages' "questions" frontmatter.
  const roles = {};
  for (const p of pages.filter((q) => q.section === 'interview-questions-by-role')) {
    (roles[p.lang] ||= []).push({ role: p.meta.breadcrumb || p.meta.title, url: p.url, questions: p.meta.questions || [] });
    if (!(p.meta.questions || []).length) warn(p.file, 'no questions: list for the role tool');
  }

  const stats = { pages: pages.length, hubs: hubs.length, byLang: Object.fromEntries(Object.keys(ui).map((l) => [l, pages.filter((p) => p.lang === l).length])) };
  for (const w of warnings) console.warn('warn  ' + w);
  for (const e of errors) console.error('ERROR ' + e);
  console.log(JSON.stringify(stats));
  console.log(`${errors.length} errors, ${warnings.length} warnings`);
  if (errors.length) process.exitCode = 1;
  if (CHECK_ONLY || (errors.length && !FORCE)) return;

  fs.rmSync(OUT, { recursive: true, force: true });
  const write = (rel, data) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
  for (const [url, html] of outputs) write(`${url}index.html`, html);
  for (const p of pages) write(`${p.url}index.md`, markdownCopy(p));
  fs.cpSync(path.join(SRC, 'assets'), path.join(OUT, 'assets'), { recursive: true });
  for (const [l, r] of Object.entries(roles)) write(`${BASE}/assets/roles-${l}.json`, JSON.stringify(r.sort((a, b) => a.role.localeCompare(b.role, l))));

  const statics = staticPages = readStatic();
  for (const sp of statics) write(sp.rel, renderStatic(sp));
  // sitemap: every Speaking Coach page plus the rest of the site (not noindex pages or the 404 page).
  const entries = [
    ...pages.map((p) => ({ loc: p.url, lastmod: p.meta.updated, alts: alternates(p) })),
    ...hubs.map((h) => ({ loc: h.url, lastmod: h.members.map((m) => m.meta.updated).sort().pop(), alts: alternates(h) })),
    ...statics.filter((sp) => !sp.meta.noindex && sp.rel !== '404.html').map((sp) => ({ loc: sp.url, lastmod: sp.url === '/' ? new Date().toISOString().slice(0, 10) : sp.lastmod })),
  ];
  const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.map((e) => `  <url><loc>${ORIGIN}${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}${(e.alts || []).length > 1 ? e.alts.map(([l, u]) => `<xhtml:link rel="alternate" hreflang="${HREFLANG[l] || l}" href="${ORIGIN}${u}"/>`).join('') : ''}</url>`).join('\n')}\n</urlset>\n`;
  write('sitemap.xml', sm);
  // Redirects for removed or merged pages: _src/redirects.json = [{ "from": "/speaking-coach/...", "to": "/speaking-coach/..." }].
  const redirectsFile = path.join(SRC, 'redirects.json');
  const redirects = fs.existsSync(redirectsFile) ? JSON.parse(fs.readFileSync(redirectsFile, 'utf8')) : [];
  for (const r of redirects) {
    if (allUrls.has(r.from)) console.error(`ERROR redirect from ${r.from} but that page still exists`);
    if (!allUrls.has(r.to)) console.error(`ERROR redirect to ${r.to} which does not exist`);
  }
  // trailingSlash: /speaking-coach/x answers with a permanent redirect to /speaking-coach/x/, so each
  // page has one address (files with an extension are untouched).
  write('vercel.json', JSON.stringify({ trailingSlash: true, redirects: redirects.map((r) => ({ source: r.from, destination: r.to, permanent: true })) }, null, 2) + '\n');
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

  const en = pages.filter((p) => p.lang === 'en');
  const recent = [...en].sort((a, b) => (b.meta.updated || '').localeCompare(a.meta.updated || '') || a.url.localeCompare(b.url)).slice(0, 100);
  write(`${BASE}/feed.xml`, `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Speaking Coach: new and updated guides</title>
  <link href="${ORIGIN}${BASE}/feed.xml" rel="self"/>
  <link href="${ORIGIN}${BASE}/"/>
  <id>${ORIGIN}${BASE}/</id>
  <updated>${recent[0].meta.updated}T00:00:00Z</updated>
  <author><name>Speaking Coach team at Sodhera Intelligence</name></author>
${recent.map((p) => `  <entry><title>${esc(p.meta.title)}</title><link href="${ORIGIN}${p.url}"/><id>${ORIGIN}${p.url}</id><updated>${p.meta.updated}T00:00:00Z</updated>${p.meta.published ? `<published>${p.meta.published}T00:00:00Z</published>` : ''}<summary>${esc(p.meta.description)}</summary></entry>`).join('\n')}
</feed>
`);
  const llmsSections = SECTIONS.map((s) => { const m = en.filter((p) => p.section === s); if (!m.length) return ''; return `\n## ${t('en', `sections.${s}.title`)}\n\n${m.map((p) => `- [${p.meta.title}](${ORIGIN}${p.url}index.md): ${p.meta.description}`).join('\n')}\n`; }).join('');
  const others = Object.keys(ui).filter((l) => l !== 'en').map((l) => `- [${ui[l].language_name}](${ORIGIN}${urlOf(l, 'home', '')}): ${pages.filter((p) => p.lang === l).length} pages`).join('\n');
  write('llms.txt', `# Speaking Coach\n\n> ${t('en', 'one_line')}\n\nSpeaking Coach is an iPhone and Android app by Sodhera Intelligence (${APP_STORE}, ${PLAY}), with a free voice review in ChatGPT and on the English pages below (answer out loud, get pace, fillers, pauses and feedback that quotes your words; no sign-up). These pages answer common questions about interviews, speeches, presentations and conversations. Each page has a Markdown copy at index.md. Recently updated pages: ${ORIGIN}${BASE}/feed.xml\n${llmsSections}\n## Other languages\n\n${others}\n\n## Legal documents\n\n${LEGAL_APPS.map(([d, n]) => `- [${n}](${ORIGIN}/${d}/): privacy policy, terms and support`).join('\n')}\n`);
  console.log(`wrote ${outputs.size} HTML pages, ${pages.length} Markdown copies, sitemap (${entries.length} URLs), robots.txt, llms.txt`);
}

main();

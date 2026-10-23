// Writes dist/<route>/index.html for every client route, so each page answers 200 with its own
// <title> and description instead of relying on the 404.html fallback. Runs as part of `npm run build`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const shell = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function page(title, description) {
  let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  if (description) {
    html = html
      .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(description)}"`)
      .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(description)}"`);
  }
  return html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(title)}"`);
}

// Landing pages: slug, valueProp and headline are plain single-quoted strings in landings.ts.
const src = readFileSync(join(root, 'src/content/landings.ts'), 'utf8');
const field = (block, name) => block.match(new RegExp(`${name}: '([^']*)'`))?.[1];
const landings = src.split(/\n  \{\n/).slice(1).map(b => ({
  slug: field(b, 'slug'), valueProp: field(b, 'valueProp'), headline: field(b, 'headline'),
})).filter(l => l.slug && l.headline);
if (landings.length === 0) throw new Error('static-routes: no landing pages found in landings.ts');

const routes = [
  ...landings.map(l => [`for/${l.slug}`, `${l.valueProp}: UnlockDrill`, l.headline]),
  ['setup', 'Set it up on iPhone: UnlockDrill'],
  ['q', 'One question: UnlockDrill'],
  ['settings', 'Settings: UnlockDrill'],
  ['thanks', 'You’re on the waitlist: UnlockDrill'],
  ['privacy', 'Privacy: UnlockDrill'],
  ['signin', 'Sign in: UnlockDrill'],
  ['profile', 'Your profile: UnlockDrill'],
  ['diagnostic', 'Diagnostic: UnlockDrill'],
];

for (const [path, title, description] of routes) {
  mkdirSync(join(dist, path), { recursive: true });
  writeFileSync(join(dist, path, 'index.html'), page(title, description));
}
writeFileSync(join(dist, '404.html'), shell);
console.log(`static-routes: wrote ${routes.length} pages + 404.html`);

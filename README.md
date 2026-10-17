# UnlockDrill

One practice question before you scroll. Choose an app on your iPhone; the next time you open it, a short question appears first. Skip and pause are always visible.

Built by team **5 PPL** (Linfeng Li, Yicheng Ying, Cody Wang, Arjun Joshi, Kushaan Vardhan) for Columbia's Startup Studio, Fall 2026. Product and brand documents: [`docs/`](docs/). Agent rules: [`AGENTS.md`](AGENTS.md).

**Live:** https://tommylilinfeng.github.io/unlockdrill/ (GitHub Pages, deployed from `main` by [the workflow](.github/workflows/pages.yml)).

## How the integration works

There is no App Store app and no Screen Time entitlement. The iPhone's built-in **Shortcuts** app can run an automation when another app opens ("When Instagram is opened → Open URL"). On iOS 17 and later that runs without a confirmation tap. The URL is this site's `/q?app=instagram`, which shows one question, then hands control back to the app through its URL scheme (`instagram://`). The guided setup lives at `/setup`.

## Pages

| Path | What it is |
| --- | --- |
| `/` | Homepage: who it is for, the promise, a live sample question, email signup |
| `/for/scrollers` | Landing page: a smaller first step (persona Maya) |
| `/for/blocker-skeptics` | Landing page: control, not a lock (persona Jordan) |
| `/for/reviewers` | Landing page: know why you got it wrong (persona Casey) |
| `/setup` | iOS Shortcuts automation guide; picks app and frequency |
| `/q?app=<key>` | The interstitial: one question, explanation, back to the app. `&demo=1` ignores frequency and pause |
| `/settings` | Change app, frequency, pause, reset (all stored on-device) |
| `/thanks` | After signup; fires the `signup` analytics event (mark it a key event in GA4) |
| `/privacy` | What is collected. Adults 18+ only |

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
node scripts/validate-questions.mjs   # checks every question bank
```

Copy `.env.example` to `.env` to turn on the optional services. Everything works without them: signups fall back to `localStorage` and analytics stays off.

| Variable | Purpose |
| --- | --- |
| `VITE_EXAM` | `sat` or `gre`: which copy variant and question bank to use |
| `VITE_SITE_URL` | Public URL, used to build the Shortcuts link on `/setup` |
| `VITE_GA_ID` | GA4 measurement id. Page views on every route change; `signup` on `/thanks`; `practice_*` events in the question flow |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Email signups and practice events go to Supabase. Run [`supabase/schema.sql`](supabase/schema.sql) once; the anon key can only insert |
| `VITE_BASE` | Build-time sub-path, `/unlockdrill/` on GitHub Pages, `/` on a custom domain |

On GitHub Pages the production values come from repository **Variables** (Settings → Secrets and variables → Actions → Variables) named exactly as above.

## Question banks

`src/content/questions.<exam>.json`. Every item is original, written for this project; nothing is copied from the College Board, ETS, or any prep publisher. Fields: `id`, `exam`, `section`, `topic`, `prompt`, `choices[{key,text}]`, `answer`, `explanation`. The validator runs in CI.

## Data rules

- Adults 18 and over only. The course bars collecting data from minors; the copy, the privacy page, and the signup form say so.
- Raw interview notes and participant identities never enter this repository (`.gitignore` blocks `docs/interviews*.md`). Quote interviews by ID only.
- No secrets in git. `.env` is ignored; production values live in GitHub Variables.
- Practice events use a random device id, never an email.

## Project layout

```
src/
  config/exam.ts        exam copy variants, site URL
  content/              question banks, landing page copy
  lib/                  apps (URL schemes), settings, analytics, signup, events, questions
  components/           Shell, Logo, SignupForm, QuestionCard
  pages/                Home, Landing, Setup, Question, Settings, Thanks, Privacy
  styles/               tokens.css (from docs/style_guide.md), base.css
public/logo/            marks, lockups, favicons from HW4
supabase/schema.sql     signups + practice_events tables with insert-only RLS
scripts/                question validator
docs/                   brand_position.md, style_guide.md
.claude/agents/         persona judges (Maya, Jordan, Casey)
```

## Status (October 17, 2026)

Working: homepage, three landing pages, signup → thank-you, question flow with skip/pause/frequency, Shortcuts setup guide, GA/Supabase wiring behind env vars, GitHub Pages deploy.

Not done: custom domain, GA property, Supabase project (all need an account or payment), Android, welcome email, error journal. The Shortcuts automation has been reasoned from Apple's documented behavior and still needs a real-iPhone test before we claim compatibility.

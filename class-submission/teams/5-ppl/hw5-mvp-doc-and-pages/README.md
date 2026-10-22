# 5 PPL — Homework 5: MVP doc, homepage, and landing pages

Product: **UnlockDrill**. One practice question before you scroll.
Product repository: https://github.com/Tommylilinfeng/unlockdrill (code, question bank, brand docs, deploy workflow).
MVP doc: [mvp_doc.md](mvp_doc.md).

## Live pages

| Page | URL | Audience | Value prop |
| --- | --- | --- | --- |
| Homepage | https://unlockdrill.com/ | SAT test takers (18+) who keep putting off practice | One question before you scroll |
| Landing 1 | https://unlockdrill.com/for/scrollers | People who meant to study and opened Instagram instead (persona Maya, the tired starter) | A smaller first step |
| Landing 2 | https://unlockdrill.com/for/blocker-skeptics | People who tried Screen Time or an app blocker and turned it off (persona Jordan, the blocker skeptic) | Control, not a lock: skip is always on the screen |
| Landing 3 | https://unlockdrill.com/for/reviewers | People who already practice but repeat the same mistakes (persona Casey, the purposeful reviewer) | Know why you got it wrong |

The custom domain is hosted on GitHub Pages and deployed from `main` by GitHub Actions. HTTPS is enforced; the homepage and all three landing pages returned HTTP 200 on October 22, 2026.

## How every page meets the brief

- **One clear action.** Each page has one email signup for the waitlist. After signing up, people land on `/thanks`.
- **Working email signup.** Each signup is written to the team's Supabase table `signups` (the browser can only insert), with the page and UTM parameters. Tested from all four pages on October 22, 2026 on the previous GitHub Pages hostname; all four rows and correct page/variant values were verified in Supabase. All four custom-domain forms were retested in Chrome on October 22 and reached `/thanks` with the correct `from` variant. All four new rows were independently verified in Supabase with correct variants and preserved lowercase UTM attribution. Synthetic test addresses are excluded from demand metrics.
- **Our look.** The HW4 style guide and the Drill Buddy logo (`docs/style_guide.md`, `public/logo/`) are applied through CSS tokens. Imagery is the product's own question UI and our vector mark; no stock photography.
- **Audience language.** Headlines and quotes come from our HW3 interviews (cited by ID) and HW4 Reddit research.

## Verification evidence

- [Public URL and GA-tag checks](evidence/public-page-checks.json): homepage, three landing pages, and thank-you page.
- [Custom-domain signup confirmation](evidence/domain-signup.png) and [four stored Supabase test rows](evidence/domain-supabase.png). Test emails use `unlockdrill-test+domain-…-20261022@example.com` and are excluded from real acquisition metrics.
- The team confirmed on October 22 that iPhone testing is complete. The screenshots above document the separate web signup and database checks.

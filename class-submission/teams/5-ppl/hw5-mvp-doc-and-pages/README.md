# 5 PPL — Homework 5: MVP doc, homepage, and landing pages

Product: **UnlockDrill**. One practice question before you scroll.
Product repository: https://github.com/Tommylilinfeng/unlockdrill (code, question bank, brand docs, deploy workflow).
MVP doc: [mvp_doc.md](mvp_doc.md).

## Live pages

| Page | URL | Audience | Value prop |
| --- | --- | --- | --- |
| Homepage | https://[TBD: domain]/ | SAT test takers (18+) who keep putting off practice | One question before you scroll |
| Landing 1 | https://[TBD: domain]/for/scrollers | People who meant to study and opened Instagram instead (persona Maya, the tired starter) | A smaller first step |
| Landing 2 | https://[TBD: domain]/for/blocker-skeptics | People who tried Screen Time or an app blocker and turned it off (persona Jordan, the blocker skeptic) | Control, not a lock: skip is always on the screen |
| Landing 3 | https://[TBD: domain]/for/reviewers | People who already practice but repeat the same mistakes (persona Casey, the purposeful reviewer) | Know why you got it wrong |

The same pages are also served at https://tommylilinfeng.github.io/unlockdrill/ (GitHub Pages), deployed from `main` by GitHub Actions.

## How every page meets the brief

- **One clear action.** Each page has one email signup for the waitlist. After signing up, people land on `/thanks`.
- **Working email signup.** Each signup is written to the team's Supabase table `signups` (the browser can only insert), with the page and UTM parameters. Tested from all four pages on [TBD: date].
- **Our look.** The HW4 style guide and the Drill Buddy logo (`docs/style_guide.md`, `public/logo/`) are applied through CSS tokens. Imagery is the product's own question UI and our vector mark; no stock photography.
- **Audience language.** Headlines and quotes come from our HW3 interviews (cited by ID) and HW4 Reddit research.

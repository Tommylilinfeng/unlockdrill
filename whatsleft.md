# What's left for HW5 and HW6

Deadline: **Friday, October 23, 1:10 PM ET.** Checked October 21.

The drafts are written:

- [`class-submission/teams/5-ppl/hw5-mvp-doc-and-pages/`](class-submission/teams/5-ppl/hw5-mvp-doc-and-pages/): `mvp_doc.md`, `README.md`
- [`class-submission/teams/5-ppl/hw6-demand-plan-and-analytics/`](class-submission/teams/5-ppl/hw6-demand-plan-and-analytics/): `demand_strategy.md`

What's left: the accounts, the domain, merging, the posts, and opening the two class PRs. Do the steps in order; later steps depend on earlier ones. Wherever you see `[TBD: …]` in the drafts, replace it with the real value.

## Where things stand

| Thing | Status |
| --- | --- |
| Homepage + 3 landing pages | Live at https://tommylilinfeng.github.io/unlockdrill/ |
| Email signup | **Broken for the team.** Signups save only in the visitor's browser because Supabase isn't connected |
| Google Analytics | **Not on the site.** No `VITE_GA_ID` repo variable |
| Domain | **Not bought** |
| Drill Buddy logo | In [PR #21](https://github.com/Tommylilinfeng/unlockdrill/pull/21), not merged; the live site still shows the old logo |
| Tag in page source, landing pages return 200, domain switch | In [PR #22](https://github.com/Tommylilinfeng/unlockdrill/pull/22), not merged |
| HW5 / HW6 docs | Drafted on this branch; a few blanks to fill |
| Class repo PRs | **None opened** for HW5 or HW6 |

---

## HW5: MVP doc, homepage, landing pages

### 1. Make signups reach the team (Supabase)
1. Go to supabase.com and create a project called `unlockdrill` (free tier).
2. In the project, open **SQL Editor**, paste in all of [`supabase/schema.sql`](supabase/schema.sql), and run it.
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key. Use the anon key, never the service_role key.
4. On GitHub, open this repo's **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_SUPABASE_URL` = the Project URL
   - `VITE_SUPABASE_ANON_KEY` = the anon key

### 2. Buy the domain
1. Buy a domain (for example on Namecheap, Porkbun, or Cloudflare; about $12 a year).
2. In the registrar's DNS settings, point it at GitHub Pages:
   - Four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `tommylilinfeng.github.io`
3. Once PR #22 is merged (step 3), add a file `public/CNAME` to `main` containing only the domain, e.g. `unlockdrill.com`. The build then serves from the domain root.
4. In this repo's **Settings → Pages**, set the custom domain to the same name and tick **Enforce HTTPS** once it becomes available. That can take up to an hour after DNS is set.

### 3. Merge the two product PRs
1. Review and merge [PR #21](https://github.com/Tommylilinfeng/unlockdrill/pull/21) (the Drill Buddy logo picked in HW4).
2. Review and merge [PR #22](https://github.com/Tommylilinfeng/unlockdrill/pull/22). It does three things:
   - puts the Google tag in each page's HTML;
   - gives each page its own HTML file, so landing pages return 200 instead of 404;
   - supports the domain through `public/CNAME`.
3. Every merge to `main` redeploys automatically. Check the **Actions** tab for a green run.

### 4. Check the live pages
Do this on the domain once it works, or on the github.io URL until then.

1. Open the homepage, `/for/scrollers`, `/for/blocker-skeptics`, and `/for/reviewers`. Each should load and show the new logo.
2. Sign up on **each** of the four pages with a different email you can check (e.g. `you+home@…`, `you+scrollers@…`). Each should go to the thank-you page.
3. In Supabase, open **Table Editor → signups**. There should be four new rows, each with the right `page`.
4. Open the pages on a phone too.

### 5. Finish the HW5 docs
In `class-submission/teams/5-ppl/hw5-mvp-doc-and-pages/`:
- `README.md`: replace every `[TBD: domain]` and the `[TBD: date]` of the signup test.
- `mvp_doc.md` section 5: fill in the domain and registrar.
- `mvp_doc.md` section 8: confirm with everyone that the roles are right. They come from the deck's team slide.
- Optional: ask Ken whether SAT students under 18 may sign up. The doc currently says 18+ until he confirms.

### 6. Submit HW5
1. Fork or update your fork of https://github.com/kenxle/columbia-startup-studio-fall-2026 so it matches the current `main`.
2. Create a new branch from that `main`. **Don't reuse the old `5-ppl-hw5-hw6` branch on Tommy's fork**: it is 32 commits behind and would overwrite HW4 files.
3. Copy `class-submission/teams/5-ppl/hw5-mvp-doc-and-pages/` into `teams/5-ppl/hw5-mvp-doc-and-pages/`.
4. Open a PR titled something like "5 PPL: HW5 MVP doc and pages", and get one teammate to review it.

---

## HW6: demand plan and analytics

### 7. Set up Google Analytics
1. Go to analytics.google.com and create an account for the team.
2. Create a property: name `UnlockDrill`, time zone `America/New_York`, currency `USD`.
3. Add a **Web** data stream with the site URL (the domain, or the github.io URL for now). Copy the measurement ID, which looks like `G-XXXXXXX`.
4. Add the repo variable `VITE_GA_ID` = that ID (same Variables page as step 1).
5. Redeploy: **Actions → Deploy to GitHub Pages → Run workflow**, or push any commit to `main`.

### 8. Prove the tag works
1. On each of the four pages, right-click → **View Page Source** and search for `googletagmanager`. It should appear on every page. This needs PR #22 merged.
2. Open GA → **Reports → Realtime**, then visit the site in another tab with a UTM link, e.g. `…/for/scrollers?utm_source=test&utm_medium=social&utm_campaign=5ppl_unlockdrill_oct2026&utm_content=check`. You should show up in Realtime.
3. Sign up once. The `signup` event should appear in Realtime.
4. In GA, go to **Admin → Events** (or **Key events**) and mark `signup` as a key event. It only shows up there after it has fired once.
5. Screenshot the Realtime view and keep it.

### 9. Start posting
1. Publish the first posts listed in section 3 of `demand_strategy.md`: r/Sat, r/digitalminimalism, and the Columbia groups. Use the full UTM links from that table, with `[TBD: domain]` replaced. Keep every UTM value lowercase.
2. Paste each post's link into the "Link to post" column.
3. Check that the visits show up in GA Realtime with the right source.

### 10. Finish the HW6 doc
In `class-submission/teams/5-ppl/hw6-demand-plan-and-analytics/demand_strategy.md`:
- Replace every `[TBD: domain]`.
- Fill in "Link to post" for the posts that are up.
- Tick the boxes in section 7 that are actually done.
- Confirm the weekly traffic owners in section 1 with the team.

### 11. Submit HW6
1. Make another new branch from the class repo's current `main`.
2. Copy `class-submission/teams/5-ppl/hw6-demand-plan-and-analytics/` into `teams/5-ppl/hw6-demand-plan-and-analytics/`.
3. Open a PR titled something like "5 PPL: HW6 demand plan and analytics", and get it reviewed.

---

## Not HW5/HW6, but due the same day (midterm)
- Test the Shortcuts automation on a real iPhone (iOS 17+), following [issue #3](https://github.com/Tommylilinfeng/unlockdrill/issues/3), and screen-record it as the backup demo.
- Finish the deck (`deck/index.html`): headshots for all five, problem / solution / demo slides, one section per person. Do a timed run under 7.5 minutes.
- HW4 loose end: make sure someone pasted the HW4 fix ([class PR #46](https://github.com/kenxle/columbia-startup-studio-fall-2026/pull/46)) into Courseworks.

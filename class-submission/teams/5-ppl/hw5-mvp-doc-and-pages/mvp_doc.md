# UnlockDrill — MVP doc

**Team:** 5 PPL (Linfeng Li, Yicheng Ying, Cody Wang, Arjun Joshi, Kushaan Vardhan)
**Date:** October 2026 · **Status:** v1 for the October 23 midterm.
**Product repo:** https://github.com/Tommylilinfeng/unlockdrill

## 1. What we're building

**Problem.** People who intend to study for the SAT lose the moment to reflexive scrolling. The barrier is starting, not ability: "The hardest part is just sitting down to start. Once I pick up my phone, hours are gone." (I03). Blockers do not survive contact with the user: "I just tap ignore and keep scrolling." (I04). Evidence: [brand position](../hw4-synthesis-brand-position/brand_position.md), [interview notes](../hw3-interviews/interviews.md), [Reddit research](../hw4-synthesis-brand-position/reddit_research/summary.md).

**Who it's for.** SAT test takers who study in the gaps of a normal week and reach for Instagram, TikTok, or YouTube when they meant to practice. The team chose SAT as the launch audience on October 17 because our HW3 interviews and Reddit research came from SAT takers. The current product limits data collection to adults, so signups are limited to people 18 and over until the instructor confirms otherwise; the copy, privacy page, and signup form say so. A GRE question bank exists in the repo as an exploratory option, not validated demand.

**Core flow: user, action, value.**
A test taker opens the app they chose (say, Instagram). One short question appears first. They answer it, read a one-line explanation, and are sent back into Instagram. The value is a start they actually made, with the "why" attached, at a moment they would otherwise have lost.

**First aha moment.** Completing one brief practice attempt and understanding its explanation at a moment otherwise spent scrolling. A correct answer is not required; the team has tested the app-opening flow on an iPhone.

## 2. MVP features

The web flow is implemented, and the team has completed iPhone testing of the Shortcuts automation.

- iOS integration through the Shortcuts app: "When *app* is opened → Open URL" sends the user to `/q?app=…`. No App Store app, no Screen Time entitlement.
- Guided setup page (`/setup`): choose the app and how often, copy the link, follow the steps.
- One-question screen (`/q`): question, choices, instant verdict, one-line explanation, "Back to *app*".
- Skip, always visible. Pause for an hour or for the day, always visible.
- How-often control: every open, every third open, at most hourly, once a day.
- Original SAT question bank (17 items) with a validator that runs on every deploy.
- Homepage and three landing pages, one per value prop, each with an email signup and a thank-you page.
- Google Analytics page views, a `signup` event on the thank-you page (key-event setting verified October 22), and practice events (`shown`, `answered`, `skipped`, `paused`, `returned`).
- Settings stay on the device. Practice events carry a random device id, never an email.

## 3. What comes later

1. **Broader device and iOS-version coverage.** Build on the completed iPhone test by checking additional configurations.
2. **Question bank to 150+ SAT items, each checked by a second person.** Repeats kill the value; variety is the product.
3. **Welcome and day-3 emails.** "Did you set it up?" is where we expect to lose people.
4. **Mistake log.** After a miss, one tap: careless, concept, or time, with a weekly pattern. Interviewees asked for the why, not the letter (I08, Casey persona).
5. **Topic focus.** Let the user pick sections. R4: "I only need to work on math."
6. **Spaced repeats.** Bring back similar questions, not the same one.
7. **Android.** Possible with automation apps such as Tasker or MacroDroid, but it needs a separate setup guide.

## 4. What's cut and what's faked

**Cut from the MVP:** accounts and sign-in, streaks and badges, any feed, score prediction, tutoring or chat, a native app, Android, payments, topic selection, social features.

**Faked (Wizard of Oz):**
- Launch email: the team will send the promised one-time launch message by hand. No email has been sent as part of this submission; recurring email requires a separate opt-in.
- Question review: a teammate reads every new item by hand before it ships.
- "We'll email you when it's ready": that email is written and sent by hand.
- Demo-day phones: the team manually configures the Shortcuts automation for the demo.

The question flow, settings, signup, and analytics events are real, not mock-ups.

## 5. Stack and services

| Layer | Choice | Cost |
| --- | --- | --- |
| Framework | Vite + React + TypeScript, client-side routing, one HTML file per page | $0 |
| Coding agent | Claude Code and Codex, with `AGENTS.md` and three persona judges in `.claude/agents/` | Existing team subscriptions; no separate project charge, subscription allocation not tracked |
| Hosting | GitHub Pages, deployed by GitHub Actions on every push to `main` | $0 |
| Domain | unlockdrill.com, registered at Squarespace Domains (team-reported) | $20/year (team-confirmed) |
| Analytics | Google Analytics 4 | $0 |
| Database | Supabase free tier: `signups` and `practice_events` tables, insert-only from the browser | $0 on the current free plan |
| Email | Manual team inbox for the one-time launch message; Resend is a future option | $0 incremental currently; no paid email service enabled |
| Sign-in, payments, AI model at runtime | none | $0 |

Incremental project cost: $20/year for the domain; hosting, database, and analytics are currently $0. Existing shared coding-agent subscriptions are not allocated to this project total.

## 6. How you'll know it works

**The action we measure.** The assignment's action is account creation. The MVP has no accounts by design (sign-in is cut, section 4), so the closest equivalent is an **email signup**: someone submits the form, the Supabase insert succeeds, and then the browser opens the thank-you page and emits `signup`. This is a waitlist conversion, not an authenticated account creation, consistent with the assignment’s allowed coming-soon form. Count unique normalized emails in Supabase overall and by landing-page variant; exclude synthetic tests. The database permits the same email on different variants, so total rows are not total people. GA thank-you visits can repeat on reload and are a funnel signal, not the canonical signup count.

**What we watch next.** Of the people who complete setup, how many questions they answer instead of skipping, and whether they are still answering on day 3.

**Keep going if, by November 6:** at least 30 signups across all pages, at least 10 people who complete the Shortcuts setup, and an answer rate above 30% among them. Below that, the hook isn't working, and we rethink either the trigger (opening an app) or the size of the ask (one question).

## 7. Risks and open questions

- **iOS behavior.** The team has confirmed completion of iPhone testing. The recorded trigger/return checks on October 22 passed two cycles each: Instagram opened the question page without a confirmation tap, and returning to Instagram did not bounce ([issue #3](https://github.com/Tommylilinfeng/unlockdrill/issues/3)). Behavior across other devices and iOS versions remains a compatibility risk; expand coverage as the pilot grows.
- **Skip becomes the default.** Our position is control, not a lock. If nearly everyone skips, the offer is wrong, not the user. Skip rate is a first-class metric.
- **Audience vs. data rules.** Many SAT takers are under 18, and we only collect data from adults. Open question for the instructor: can minors sign up, and if not, is an 18+ SAT audience large enough?
- **Content quality.** A wrong explanation destroys trust faster than a missing feature. Every item gets a second reader.
- **Distribution.** r/Sat moderates self-promotion. Posts must be useful first (a question with its explanation) and link second.
- **Return links.** `instagram://` and similar links back into apps aren't officially documented. If one breaks, we fall back to the web URL and the user loses a second, nothing more.

## 8. Roles

The team confirmed these owners on October 22, 2026.

| Area | Owner | Backup |
| --- | --- | --- |
| Product repo, question flow, deploy | Linfeng Li | Kushaan Vardhan |
| Brand, homepage and landing pages, copy | Arjun Joshi | Linfeng Li |
| Question bank and review, interviews | Yicheng Ying | Cody Wang |
| Analytics, Supabase, email | Kushaan Vardhan | Linfeng Li |
| Traffic and communities (weekly owners in the HW6 demand strategy) | Cody Wang | Arjun Joshi |

Midterm: Linfeng runs the live demo; Arjun presents the problem, Cody the audience, Yicheng the solution, Kushaan the metrics.

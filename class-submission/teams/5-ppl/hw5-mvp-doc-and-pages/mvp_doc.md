# UnlockDrill — MVP doc

**Team:** 5 PPL (Linfeng Li, Yicheng Ying, Cody Wang, Arjun Joshi, Kushaan Vardhan)
**Date:** October 2026 · **Status:** v1 for the October 23 midterm.
**Product repo:** https://github.com/Tommylilinfeng/unlockdrill

## 1. What we're building

**Problem.** People who intend to study for the SAT lose the moment to reflexive scrolling. The barrier is starting, not ability: "The hardest part is just sitting down to start. Once I pick up my phone, hours are gone." (I03). Blockers do not survive contact with the user: "I just tap ignore and keep scrolling." (I04). Evidence: [brand position](../hw4-synthesis-brand-position/brand_position.md), [interview notes](../hw3-interviews/interviews.md), [Reddit research](../hw4-synthesis-brand-position/reddit_research/summary.md).

**Who it's for.** SAT test takers who study in the gaps of a normal week and reach for Instagram, TikTok, or YouTube when they meant to practice. The team chose SAT as the launch audience on October 17 because our HW3 interviews and Reddit research came from SAT takers. The course bars collecting data from minors, so signups are limited to people 18 and over until the instructor confirms otherwise; the copy, privacy page, and signup form say so. A GRE question bank exists in the repo as an exploratory option, not validated demand.

**Core flow: user, action, value.**
A test taker opens the app they chose (say, Instagram). One short question appears first. They answer it, read a one-line explanation, and are sent back into Instagram. The value is a start they actually made, with the "why" attached, at a moment they would otherwise have lost.

**First aha moment.** The first time a question appears in front of Instagram and they get it right in under a minute.

## 2. MVP features

- iOS integration through the Shortcuts app: "When *app* is opened → Open URL" sends the user to `/q?app=…`. No App Store app, no Screen Time entitlement.
- Guided setup page (`/setup`): choose the app and how often, copy the link, follow the steps.
- One-question screen (`/q`): question, choices, instant verdict, one-line explanation, "Back to *app*".
- Skip, always visible. Pause for an hour or for the day, always visible.
- How-often control: every open, every third open, at most hourly, once a day.
- Original SAT question bank (17 items) with a validator that runs on every deploy.
- Homepage and three landing pages, one per value prop, each with an email signup and a thank-you page.
- Google Analytics page views, a `signup` key event on the thank-you page, and practice events (`shown`, `answered`, `skipped`, `paused`, `returned`).
- Settings stay on the device. Practice events carry a random device id, never an email.

## 3. What comes later

1. **Real-iPhone verification of the Shortcuts automation across iOS versions.** The whole product rests on it; we claim compatibility only after testing.
2. **Question bank to 150+ SAT items, each checked by a second person.** Repeats kill the value; variety is the product.
3. **Welcome and day-3 emails.** "Did you set it up?" is where we expect to lose people.
4. **Mistake log.** After a miss, one tap: careless, concept, or time, with a weekly pattern. Interviewees asked for the why, not the letter (I08, Casey persona).
5. **Topic focus.** Let the user pick sections. R4: "I only need to work on math."
6. **Spaced repeats.** Bring back similar questions, not the same one.
7. **Android.** Possible with automation apps such as Tasker or MacroDroid, but it needs a separate setup guide.

## 4. What's cut and what's faked

**Cut from the MVP:** accounts and sign-in, streaks and badges, any feed, score prediction, tutoring or chat, a native app, Android, payments, topic selection, social features.

**Faked (Wizard of Oz):**
- Welcome email: sent by hand from the team inbox to each new signup. There is no automated email yet.
- Question review: a teammate reads every new item by hand before it ships.
- "We'll email you when it's ready": that email is written and sent by hand.
- Demo-day phones: we set up the Shortcuts automation on team phones in advance. The audience sees the real flow, not the two-minute setup.

The question flow, settings, signup, and analytics events are real, not mock-ups.

## 5. Stack and services

| Layer | Choice | Cost |
| --- | --- | --- |
| Framework | Vite + React + TypeScript, client-side routing, one HTML file per page | $0 |
| Coding agent | Claude Code, with `AGENTS.md` and three persona judges in `.claude/agents/` | covered by team plans |
| Hosting | GitHub Pages, deployed by GitHub Actions on every push to `main` | $0 |
| Domain | [TBD: domain name], registered at [TBD: registrar] | about $12 a year |
| Analytics | Google Analytics 4 | $0 |
| Database | Supabase free tier: `signups` and `practice_events` tables, insert-only from the browser | $0 up to 500 MB |
| Email | Sent by hand from the team inbox for now; Resend free tier when we automate | $0 up to 3,000 a month |
| Sign-in, payments, AI model at runtime | none | $0 |

Total: about $12 a year, all of it the domain.

## 6. How you'll know it works

**The action we measure.** The assignment's action is account creation. The MVP has no accounts by design (sign-in is cut, section 4), so the closest equivalent is an **email signup**: someone submits the form and lands on the thank-you page, where the `signup` key event fires and a row is written to Supabase. We count signups per page, which also shows which value prop pulls hardest.

**What we watch next.** Of the people who complete setup, how many questions they answer instead of skipping, and whether they are still answering on day 3.

**Keep going if, by November 6:** at least 30 signups across all pages, at least 10 people who complete the Shortcuts setup, and an answer rate above 30% among them. Below that, the hook isn't working, and we rethink either the trigger (opening an app) or the size of the ask (one question).

## 7. Risks and open questions

- **iOS behavior.** Nobody on the team has run the automation on a real iPhone yet. If iOS asks for a confirmation tap, the friction may kill the habit. Next step: test on iOS 17+ before the midterm and record a backup video.
- **Skip becomes the default.** Our position is control, not a lock. If nearly everyone skips, the offer is wrong, not the user. Skip rate is a first-class metric.
- **Audience vs. data rules.** Many SAT takers are under 18, and we only collect data from adults. Open question for the instructor: can minors sign up, and if not, is an 18+ SAT audience large enough?
- **Content quality.** A wrong explanation destroys trust faster than a missing feature. Every item gets a second reader.
- **Distribution.** r/Sat moderates self-promotion. Posts must be useful first (a question with its explanation) and link second.
- **Return links.** `instagram://` and similar links back into apps aren't officially documented. If one breaks, we fall back to the web URL and the user loses a second, nothing more.

## 8. Roles

| Area | Owner | Backup |
| --- | --- | --- |
| Product repo, question flow, deploy | Linfeng Li | Kushaan Vardhan |
| Brand, homepage and landing pages, copy | Arjun Joshi | Linfeng Li |
| Question bank and review, interviews | Yicheng Ying | Cody Wang |
| Analytics, Supabase, email | Kushaan Vardhan | Linfeng Li |
| Traffic and communities (weekly owners in the HW6 demand strategy) | Cody Wang | Arjun Joshi |

Midterm: Linfeng runs the live demo; Arjun presents the problem, Cody the audience, Yicheng the solution, Kushaan the metrics.

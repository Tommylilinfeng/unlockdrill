# HW5 / HW6 submission status

Updated October 22, 2026. Deadline: Friday, October 23, 1:10 PM ET.

## Class-repo submissions

- **HW5:** [PR #50 — MVP doc and pages](https://github.com/kenxle/columbia-startup-studio-fall-2026/pull/50).
- **HW6:** [PR #51 — demand plan and analytics](https://github.com/kenxle/columbia-startup-studio-fall-2026/pull/51).

These PRs are the submissions. Nothing needs to be submitted on Courseworks for HW5 or HW6. The HW4 submission process is separate.

## Completed

- Real domain: https://unlockdrill.com/ (Squarespace Domains, $20/year, team-confirmed).
- HTTPS enforced; homepage, three landing pages, and thank-you page return HTTP 200.
- Product PRs #21 and #22 merged, including Drill Buddy logo and static route HTML.
- Supabase configured with insert-only anonymous access and no public read policy.
- All four custom-domain forms tested October 22. Correct variants and lowercase UTM values independently verified in four new Supabase rows; evidence is included in HW5.
- GA tag `G-46Q4TG01KP` present in the homepage, three landing pages, and thank-you page.
- Team confirmed named roles and semester traffic rotation.
- MVP brief, live-page directory, and semester demand strategy completed and copied to the class PRs.

## HW6 analytics verification completed October 22

- [x] Realtime in property `560263927` showed `page_view` and `signup`; screenshot added to PR #51.
- [x] Existing coded `signup` registered as a key event; starred state verified and screenshot added to PR #51.
- [x] Evidence committed to the class submission and mirrored here.

The 24-hour message applied to the Recent events list, not Realtime. No extra URL-based event trigger was added. Observed Realtime counts include synthetic activity and are not customer signup totals. GA source attribution was not established by that screenshot; lowercase test UTMs were verified separately in Supabase.

## Outreach execution

No posts have been published yet: the team is preparing the midterm, content drafts, and posting calendar. The demand strategy now plans one post per day total from October 24 through December 18 across X, Reddit, and other eligible platforms. It includes a weekly rotation and the first seven dated posts with lowercase-UTM links. This is a plan; no platform scheduler has been configured. Traffic owners should publish where community rules allow and replace the planned status with actual post links. No messages or posts were sent during submission preparation.

## Metrics and email

Exclude all `unlockdrill-test+…@example.com` synthetic test addresses from real signup counts and outreach. Count distinct normalized emails; the same person can appear under multiple landing-page variants. Thank-you reloads can fire GA signup again, so use Supabase for unique signup totals.

The live page promises one launch email. Recurring newsletters or lifecycle emails need a separate opt-in before activation. Anonymous practice events are not linked to subscriber emails.

## Separate product / midterm follow-ups

- iPhone Shortcuts testing is complete (team-confirmed October 22). Broader device/version testing can continue during the pilot.
- Complete the deck and timed team rehearsal.
- Confirm teammate access to Supabase and GA.
- Revisit SAT audience eligibility with the instructor before changing the current adult-only signup restriction.

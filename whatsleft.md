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

## Remaining HW6 verification

- [ ] Open the correct Google Analytics property and confirm `signup` appears in Realtime after a test signup.
- [ ] Mark `signup` as a key event and verify the setting.
- [ ] Save Realtime evidence and add it to PR #51.

The team reported a processing-delay notice. Standard reports may take 24–48 hours, but that does not establish that Realtime is unavailable. The review browser account currently has no property access. Do not check off Realtime based only on a tag or a successful signup form.

## Outreach execution

No posts have been published yet. The demand strategy contains a schedule and full lowercase-UTM links, with each post correctly labeled planned. Traffic owners should publish where community rules allow and replace the planned status with actual post links. No messages or posts were sent during submission preparation.

## Metrics and email

Exclude all `unlockdrill-test+…@example.com` synthetic test addresses from real signup counts and outreach. Count distinct normalized emails; the same person can appear under multiple landing-page variants. Thank-you reloads can fire GA signup again, so use Supabase for unique signup totals.

The live page promises one launch email. Recurring newsletters or lifecycle emails need a separate opt-in before activation. Anonymous practice events are not linked to subscriber emails.

## Separate product / midterm follow-ups

- Test the iPhone Shortcuts automation on a real device and record the demo backup.
- Complete the deck and timed team rehearsal.
- Confirm teammate access to Supabase and GA.
- Revisit SAT audience eligibility with the instructor before changing the current adult-only signup restriction.

# STYLE_GUIDE.md — UnlockDrill

**Team:** 5 PPL
**Status:** The team approved the answer-sheet page and selected Drill Buddy as the new logo on October 17. Production SVG assets and favicon variants are included. The previous phone check concerned the old logo; a fresh check of Drill Buddy is still needed.

**Reference implementation:** [Current product tokens](https://github.com/Tommylilinfeng/unlockdrill/blob/4597dd391ed123b949c890589c5bb37750d7bcab/src/styles/tokens.css) and [updated logo assets in product PR #21](https://github.com/Tommylilinfeng/unlockdrill/pull/21). Earlier [direction A](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/design-exploration/direction-a.html) is an exploration, not the final visual specification.

## Color

| Token | Hex | Job |
| --- | --- | --- |
| ink | #262B2E | Main text |
| ink faint | #5A6367 | Metadata and supporting copy |
| background | #FCFCFA | Cool near-white page background |
| accent | #21664C | Main action, links, mark |
| print | #86B59B | Bubble outlines and decorative rules; not small text |
| tint | #EDF4EF | Supporting panels |
| error | #B3261E | Proposed error text/icon; verify in context |

One saturated accent per control. Graphite on near-white paper; white on forest for primary buttons. Use the pale print color only for decoration, not essential low-contrast text. Verify contrast in the rendered implementation.

## Type

- Headings: Atkinson Hyperlegible Next with Atkinson Hyperlegible, Arial, Helvetica, and sans-serif fallbacks; H1 46 px at widths of 820 px and up, 34 px below.
- Body: the same font stack, 17 px; text measure 64ch.
- The product header pairs the mark with live text. Supplied SVG lockups use Arial/Helvetica fallback text; outline text before exporting fixed production artwork if portability is needed.

## Space and layout

- Content width: maximum 1,120 px.
- Section spacing: 112 px at 820 px and up; 72 px below.
- Base spacing unit: 8 px; card padding 24 px; page gutters 20 px below 820 px and 40 px above.
- Start with one column. Use additional columns only when comparison benefits.
- Keep each practice interaction finite, with one primary action and a clear exit.

## Components

- Buttons: 8 px radius, at least 48 px target height. Forest primary; outlined or underlined secondary actions.
- Icons: simple original SVG geometry, consistent stroke; label ambiguous controls.
- Cards: paper/white or mint surfaces, light border, no decorative shadow.
- Lists and tables: simple bullets; left-aligned text; tinted header and modest separators.
- Links: forest and underlined.
- Feedback: selected, focus, disabled, correct, and error states must include text or shape cues, not color alone.

## Imagery

- Prefer the actual question UI and original vector marks.
- No photos are required for the first prototype. No stock endorsements or fabricated score celebrations.
- Optional illustrations: simple flat line work in the brand palette, representing a concrete action.
- Alt text describes the image and identifies generated artwork where relevant.

### Illustration prompt template

```text
Simple flat vector-style line illustration with generous empty space.
Palette: #262B2E, #21664C, #EDF4EF, #FCFCFA.
Calm, practical mood. Avoid glossy rendering, stock-photo imitation, and decorative clutter.
Scene: [one concrete practice action].
Color emphasis: forest green with a warm paper background.
Composition: one focal action, readable at a small size.
```

This is a reusable proposal; no generated raster illustration is claimed.

## Accessibility floors

Target 4.5:1 normal-text contrast, visible keyboard focus, at least 48 px tap targets, semantic heading order, labeled controls, and reduced-motion support. These are requirements, not a claim of completed device testing.

## Never

No endless practice feed, guilt-based messages, forced celebration, hidden skip controls, emoji-only controls, or claims that a practice count proves score improvement.

## Logo

- Selected mark: **Drill Buddy**, a friendly answer-card mascot with a rounded U-shaped outline, smiling face, three answer bubbles, and small golden rays. The team selected concept B on October 17, replacing the earlier open-U direction.
- References: the team supplied Duolingo, Khan Academy, and Forest images. See [reference images and exploration](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/design-exploration/logo-round-2/README.md). These are inspiration references, not reused product artwork or endorsements.
- Files: [logo/](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/logo/): editable color, dark-background, black/white marks; horizontal lockups; stacked version; square avatar; favicons at 16, 32, 48, 180, 192, and 512 px; ICO. The product PR synchronizes these assets.
- Palette: forest #21664C, mint #86B59B, white face, graphite #262B2E, and decorative golden rays #F5C451. Use the white one-color version on dark backgrounds.
- Header: use the compact mark beside live product text, with a clear gap. Exported lockups use Arial/Helvetica fallback text; the app retains its Atkinson typography. SVG text remains editable and may vary with installed fonts.
- Clear space: at least one quarter of the visible mark width. Do not stretch, rotate, add glow, or add gradients.
- Minimum: use `mark-small.svg` or the simplified 16/32 px favicons below 48 px; these omit the rays and answer bubbles. Use the full mark at 48 px or larger.
- Check: [rendered production sheet](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/design-exploration/logo-round-2/production-check.png) inspected at actual favicon sizes. A fresh physical-phone check of Drill Buddy remains outstanding; the earlier phone check concerned the old logo.

## Exploration and feedback record

The [five HTML page directions](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/design-exploration/README.md) record the first page round. The team approved the implemented answer-sheet page with fillable bubbles, forest-green print, graphite text, and a cool near-white background. Intermediate page keep/kill comments were not supplied and are not reconstructed here.

For the new logo round, the team supplied three references, viewed A (Sprout U), B (Drill Buddy), and C (Small Win), and selected B. Production refinement retained the selected mascot and removed generated glow; the small-size version reduces detail. Detailed team reasons for rejecting A/C were not supplied.

The sample question is “If 3x + 4 = 19, what is x?” Answer: 5. It is not an official SAT item.

## Approval record

On October 17, the team approved the implemented page and old open-U logo and reported a phone check. Later that day, after seeing the new logo exploration, the team said “use second one,” selecting Drill Buddy. That selection supersedes the old logo approval. It does not constitute a new phone check or a Shortcuts integration test.

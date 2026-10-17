# STYLE_GUIDE.md — UnlockDrill

**Team:** 5 PPL
**Status:** The team approved the implemented answer-sheet direction and existing open-U logo on October 17 and reported checking the page and logo on a phone. Device/browser details were not supplied; this is a team-reported visual check, not an automation or accessibility test.

**Reference implementation:** [Current product tokens](https://github.com/Tommylilinfeng/unlockdrill/blob/4597dd391ed123b949c890589c5bb37750d7bcab/src/styles/tokens.css) and [logo component](https://github.com/Tommylilinfeng/unlockdrill/blob/4597dd391ed123b949c890589c5bb37750d7bcab/src/components/Logo.tsx). Earlier [direction A](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/design-exploration/direction-a.html) is an exploration, not the final visual specification.

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
- The product header pairs the mark with live text. Supplied SVG lockups retain their original font treatment; outline text before exporting fixed production artwork if portability is needed.

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

- Mark: an open U with an upward arrow; a small first step rather than a locked gate.
- Directions considered: twelve rough marks appear on page 15 of the report, including question tile, doorway, open book, and monograms. The team approved the open-U direction on October 17.
- Files: [logo/](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/logo), including light/dark marks, black/white versions, horizontal lockups, stacked mark, square avatar, PNG favicons at 16, 32, 48, 180, 192, and 512 px, and ICO.
- Lockup: match the visible mark height to the capital-letter height, with approximately half a cap-height gap.
- Clear space: at least one quarter of the mark height.
- Colors: forest on light, white on dark, black/white one-color variants. No gradients, rotation, or stretched geometry.
- Minimum: 16 px favicon supplied; the team reports a phone page/logo check, but separate 16 px legibility measurements were not recorded.

## Exploration and feedback record

See [five HTML directions](https://github.com/oturaN13570/columbia-startup-studio-fall-2026/blob/codex/hw4-fixes-5ppl/teams/5-ppl/hw4-synthesis-brand-position/design-exploration/README.md). Proposed references are Duolingo for approachability, Khan Academy for educational clarity, and Forest for a calm focus metaphor. These remain reference suggestions, not a reconstructed team feedback history. The approved product direction uses fillable answer bubbles, forest-green print, graphite text, and a cool near-white page. Keep/kill notes from intermediate rounds were not supplied.

The original sample question is “If 3x + 4 = 19, what is x?” Answer: 5. It is not an official SAT item.

## Approval record

On October 17, the team confirmed: “Approve design and logo; we checked them on a phone.” This records approval of the current implemented direction, not completion of the separate Shortcuts integration test.

**Follow-up team decision, October 17:** The team considers the open-U logo suitable for the initial design and may iterate on it later. This is approval for the initial direction; intermediate reference and keep/kill feedback remains undocumented.

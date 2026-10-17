# STYLE_GUIDE.md — UnlockDrill

**Team:** 5 PPL
**Status:** Provisional direction A, Calm momentum. Team keep/kill feedback, refinement rounds, and phone checks are pending.

**Reference implementation:** [Direction A HTML](design-exploration/direction-a.html), a static concept, not a working phone integration.

## Color

| Token | Hex | Job |
| --- | --- | --- |
| ink | #182E29 | Main text |
| ink faint | #52645E | Metadata and supporting copy |
| background | #F7F6F0 | Warm page background |
| accent | #21664C | Main action, links, mark |
| second color | #EFCB74 | Decorative accent only |
| tint | #DDEEE4 | Supporting panels |
| error | #A12D2D | Proposed error text/icon; verify in context |

One saturated accent per control. Ink on paper; white on forest for primary buttons. Do not use gold as small text on white. Verify contrast in the rendered implementation.

## Type

- Headings: Arial Bold, sentence case; H1 40-48 px desktop, 32 px mobile.
- Body: Arial or system sans-serif, 16-18 px, line height 1.5, approximately 60-75 characters per line.
- Wordmark: UnlockDrill in Arial Bold; supplied SVGs retain live text. Outline before final production if font portability is needed.

## Space and layout

- Content width: maximum 1,080 px.
- Section spacing: 64 px desktop; 40 px mobile.
- Base spacing unit: 8 px; card padding 24 px; mobile margins at least 16 px.
- Start with one column. Use two columns above 760 px only when comparison benefits.
- Keep each practice interaction finite, with one primary action and a clear exit.

## Components

- Buttons: 8 px radius, at least 44 px target height. Forest primary; outlined or underlined secondary actions.
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
Palette: #182E29, #21664C, #DDEEE4, #F7F6F0.
Calm, practical mood. Avoid glossy rendering, stock-photo imitation, and decorative clutter.
Scene: [one concrete practice action].
Color emphasis: forest green with a warm paper background.
Composition: one focal action, readable at a small size.
```

This is a reusable proposal; no generated raster illustration is claimed.

## Accessibility floors

Target 4.5:1 normal-text contrast, visible keyboard focus, at least 44 px tap targets, semantic heading order, labeled controls, and reduced-motion support. These are requirements, not a claim of completed device testing.

## Never

No endless practice feed, guilt-based messages, forced celebration, hidden skip controls, emoji-only controls, or claims that a practice count proves score improvement.

## Logo

- Mark: an open U with an upward arrow; a small first step rather than a locked gate.
- Directions considered: twelve rough marks appear on page 15 of the report, including question tile, doorway, open book, and monograms. The open U is an AI-recommended provisional lead. No team selection is claimed.
- Files: [logo/](logo/), including light/dark marks, black/white versions, horizontal lockups, stacked mark, square avatar, PNG favicons at 16, 32, 48, 180, 192, and 512 px, and ICO.
- Lockup: match the visible mark height to the capital-letter height, with approximately half a cap-height gap.
- Clear space: at least one quarter of the mark height.
- Colors: forest on light, white on dark, black/white one-color variants. No gradients, rotation, or stretched geometry.
- Minimum: 16 px is a candidate minimum after PDF review; actual device confirmation remains pending.

## Exploration and feedback record

See [five HTML directions](design-exploration/README.md). Proposed references are Duolingo for approachability, Khan Academy for educational clarity, and Forest for a calm focus metaphor. They are not represented as team-selected preferences or a completed visual audit.

The original sample question is “If 3x + 4 = 19, what is x?” Answer: 5. It is not an official SAT item.

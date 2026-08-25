# WCAG 2.2 — Level AA criteria (enforce in addition to all Level A)

The standard regulatory target. Cite SC numbers when enforcing or reporting.

## 1. Perceivable

- **1.2.4 Captions (Live)** — Live multimedia has synchronized captions.
- **1.2.5 Audio Description (Prerecorded)** — Prerecorded video has audio description.
- **1.3.4 Orientation** — Content not locked to a single orientation (portrait/landscape) unless essential.
- **1.3.5 Identify Input Purpose** — Inputs collecting user info use appropriate `autocomplete` tokens (name, email, tel, etc.).
- **1.4.3 Contrast (Minimum)** — Text contrast against background:
  - Normal text: **≥ 4.5:1**
  - Large text (≥ 24px, or ≥ 18.66px / 14pt bold): **≥ 3:1**
  - Incidental/disabled text and logotypes are exempt.
  - COMPUTE the ratio for every color pair; reject any pair below threshold.
- **1.4.4 Resize Text** — Text resizable up to 200% without loss of content/function. Use relative units (rem/em), avoid fixed px containers that clip text.
- **1.4.5 Images of Text** — Use real text, not images of text (except logos / essential cases).
- **1.4.10 Reflow** — Content reflows to a single column at 320px CSS width (400% zoom) with no horizontal scrolling for vertical content. No fixed-width layouts that force two-axis scrolling.
- **1.4.11 Non-text Contrast** — UI components (borders, form field outlines, toggle states, focus indicators) and meaningful graphical objects have **≥ 3:1** contrast against adjacent colors.
- **1.4.12 Text Spacing** — No loss of content when users override: line-height 1.5×, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em. Don't use fixed heights that clip.
- **1.4.13 Content on Hover or Focus** — Hover/focus-revealed content (tooltips, popovers) is dismissable, hoverable, and persistent.

## 2. Operable

- **2.4.5 Multiple Ways** — More than one way to locate a page (nav, search, sitemap) — except steps in a process.
- **2.4.6 Headings and Labels** — Headings and labels are descriptive.
- **2.4.7 Focus Visible** — Keyboard focus indicator is always visible. NEVER `outline: none` without an equivalent visible replacement.
- **2.4.11 Focus Not Obscured (Minimum)** — When an element has focus, it is not entirely hidden by sticky headers/footers or overlays.
- **2.5.7 Dragging Movements** — Drag operations have a single-pointer (no-drag) alternative.
- **2.5.8 Target Size (Minimum)** — Pointer targets are at least **24×24 CSS px**, or have sufficient spacing. (44×44 recommended.)

## 3. Understandable

- **3.1.2 Language of Parts** — Passages in a different language have a `lang` attribute.
- **3.2.3 Consistent Navigation** — Navigation repeated across pages stays in consistent order.
- **3.2.4 Consistent Identification** — Components with the same function are identified consistently.
- **3.2.6 Consistent Help** — Help mechanisms (contact, chat) appear in consistent relative order across pages.
- **3.3.3 Error Suggestion** — When an input error is detected and a fix is known, suggest it.
- **3.3.4 Error Prevention (Legal, Financial, Data)** — Submissions are reversible, checked, or confirmable.
- **3.3.7 Redundant Entry** — Information already entered is auto-populated or selectable, not re-requested in the same process.
- **3.3.8 Accessible Authentication (Minimum)** — No cognitive function test (e.g. transcribing/remembering) required for login unless an alternative exists; allow password managers / paste.

## 4. Robust

- **4.1.3 Status Messages** — Status messages (success, errors, loading) are exposed to assistive tech via `role="status"`, `role="alert"`, or `aria-live` without moving focus.

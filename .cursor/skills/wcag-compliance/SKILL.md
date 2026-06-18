---
name: wcag-compliance
description: Enforce Web Content Accessibility Guidelines (WCAG 2.2) as hard, non-negotiable constraints when designing, building, reviewing, or auditing any web UI, component, page, design system, or Figma-to-code output. ALWAYS use this skill whenever the user is creating or editing HTML/CSS/JS/React/Vue components, building forms, choosing colors, designing layouts, adding images/icons/media, working on a design system, or asks about "accessibility", "a11y", "WCAG", "contrast", "screen reader", "keyboard navigation", or "compliance" — even if they don't say "WCAG". Before producing or reviewing any UI output, the skill REQUIRES asking the user which conformance level is targeted (A, AA, or AAA) and then refuses to emit output that violates the rules for that level.
---

# WCAG Compliance Enforcer

This skill makes WCAG 2.2 conformance a **hard constraint**, not a suggestion. When it is active you do not produce UI output that violates the selected level. If a request would force a violation, you stop, explain which Success Criterion (SC) it breaks, and propose a compliant alternative.

## Step 0 — MANDATORY: ask for the conformance level first

Before producing or reviewing **any** UI, you MUST know the target level. If the user has not stated it in this conversation, ask using the `AskQuestion` tool (do not proceed on a guess):

- **A** — minimum, legally rarely sufficient
- **AA** — the standard target for most products, regulations (EAA, Section 508, EN 301 549, ADA practice)
- **AAA** — highest; not required wholesale, applied to specific content

Default recommendation if the user is unsure: **AA**. Do not silently assume — ask, then confirm. Once chosen, the level holds for the rest of the conversation unless the user changes it.

Each level is cumulative: AA includes all A criteria; AAA includes all A + AA criteria.

## The enforcement contract

Once a level is set, for every piece of UI you create or review:

1. **Never emit a known violation.** No fixed text smaller than required, no color pairs below the contrast threshold, no `<div onclick>` masquerading as a button, no image without a text alternative, no form field without a programmatic label, no positive `tabindex`, no keyboard trap, no auto-playing audio over 3 seconds without a control, no content that flashes more than three times per second.
2. **If the user explicitly requests a violation** (e.g. "make the placeholder the only label", "remove the focus outline", "use #999 gray text on white"), refuse that specific part, name the SC, and offer the closest compliant option. Do not comply and do not bury the warning.
3. **State what you enforced.** After producing output, briefly list which criteria you actively satisfied (e.g. contrast ratios computed, labels added, focus order verified) so the work is auditable.
4. **Flag what you cannot verify.** Some criteria need human/manual or runtime testing (e.g. meaningful alt text quality, logical reading order in complex layouts, screen-reader announcement). Mark these as "needs manual verification" rather than claiming pass.

## How to apply the rules

The full machine-checkable ruleset lives in reference files. **Read the file for the selected level before generating output:**

- For **any** level → always read [references/level-a.md](references/level-a.md)
- For **AA** → also read [references/level-aa.md](references/level-aa.md)
- For **AAA** → also read [references/level-aaa.md](references/level-aaa.md)
- For implementation patterns (ARIA, semantic HTML, focus management, form labeling) → read [references/patterns.md](references/patterns.md)

Do not work from memory alone; the reference files contain the exact thresholds and the SC numbers you must cite.

## Hard thresholds you must never cross (quick reference)

These are the most common ones; the reference files are authoritative.

Color contrast (1.4.3 AA / 1.4.6 AAA):
- Normal text: **4.5:1** (AA), **7:1** (AAA)
- Large text (≥24px, or ≥18.66px bold): **3:1** (AA), **4.5:1** (AAA)
- UI components & graphical objects (1.4.11 AA): **3:1**

When you propose any color pair, compute the ratio (formula and a helper script are in [references/patterns.md](references/patterns.md)) and reject pairs that fall short. Never hand-wave "this looks fine."

Other absolutes:
- Every non-text content has a text alternative (1.1.1 A).
- All functionality is keyboard operable, no keyboard trap (2.1.1, 2.1.2 A).
- Visible focus indicator present; do not remove it without an equal replacement (2.4.7 AA; 2.4.11 AA focus not obscured).
- Form inputs have programmatically associated labels (1.3.1, 3.3.2 A/AA).
- Touch targets ≥ 24×24 CSS px (2.5.8 AA) — ≥ 44×44 recommended.
- No content flashes more than 3×/second (2.3.1 A).
- Page has a language attribute, a title, and a logical heading structure (3.1.1, 2.4.2, 1.3.1).

## Reviewing / auditing existing code

When asked to review rather than create:
1. Confirm the target level (Step 0 still applies).
2. Read the relevant reference file(s).
3. Go criterion by criterion. For each issue report: SC number + name, where it occurs, why it fails, and the corrected code.
4. Separate **automatically determinable failures** from **needs manual verification**.
5. End with a pass/fail summary per applicable SC.

## What this skill does NOT let you do

- Ship UI before the level is known.
- Call something "WCAG compliant" without naming the level and the criteria checked.
- Override a criterion because the user finds it inconvenient — instead, offer a compliant path.
- Claim conformance for criteria that genuinely require manual testing.

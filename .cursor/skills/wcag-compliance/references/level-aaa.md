# WCAG 2.2 — Level AAA criteria (enforce in addition to all A + AA)

Highest level. Note: WCAG does not recommend AAA as a blanket requirement for entire sites because some criteria can't be met for all content. Apply per the user's scope. Cite SC numbers.

## 1. Perceivable

- **1.2.6 Sign Language (Prerecorded)** — Sign-language interpretation for prerecorded audio in synchronized media.
- **1.2.7 Extended Audio Description (Prerecorded)** — Where pauses are insufficient, provide extended audio description.
- **1.2.8 Media Alternative (Prerecorded)** — Full text alternative for prerecorded synchronized/video-only media.
- **1.2.9 Audio-only (Live)** — Text alternative for live audio-only.
- **1.4.6 Contrast (Enhanced)** — Text contrast:
  - Normal text: **≥ 7:1**
  - Large text: **≥ 4.5:1**
  - COMPUTE and enforce these higher thresholds; reject pairs below them.
- **1.4.7 Low or No Background Audio** — Background sounds in speech audio are low/absent (≥20 dB lower) or controllable.
- **1.4.8 Visual Presentation** — For blocks of text, user-selectable: foreground/background colors; width ≤ 80 chars; not justified; line spacing ≥ 1.5×; resize 200% without horizontal scroll.
- **1.4.9 Images of Text (No Exception)** — No images of text except where essential (e.g. logos).

## 2. Operable

- **2.1.3 Keyboard (No Exception)** — All functionality keyboard-operable with no timing-dependent exceptions.
- **2.2.3 No Timing** — No time limits except for real-time events / non-interactive media.
- **2.2.4 Interruptions** — Interruptions can be postponed/suppressed by the user (except emergencies).
- **2.2.5 Re-authenticating** — After a session expires, the user can continue without data loss.
- **2.2.6 Timeouts** — Warn users of data loss from inactivity timeouts.
- **2.3.2 Three Flashes** — No flashing more than 3×/second at all (stricter than 2.3.1).
- **2.3.3 Animation from Interactions** — Motion animation triggered by interaction can be disabled (respect `prefers-reduced-motion`).
- **2.4.8 Location** — Provide info about the user's location within a set (e.g. breadcrumbs).
- **2.4.9 Link Purpose (Link Only)** — Link purpose is clear from link text alone.
- **2.4.10 Section Headings** — Section headings organize content where appropriate.
- **2.4.12 Focus Not Obscured (Enhanced)** — Focused element is not obscured at all by other content.
- **2.4.13 Focus Appearance** — Focus indicator meets enhanced size (≥ 2px perimeter) and ≥ 3:1 contrast against unfocused state.
- **2.5.5 Target Size (Enhanced)** — Pointer targets are at least **44×44 CSS px**.
- **2.5.6 Concurrent Input Mechanisms** — Don't restrict input modalities (allow touch + keyboard + mouse together).

## 3. Understandable

- **3.1.3 Unusual Words** — Provide definitions for idioms/jargon.
- **3.1.4 Abbreviations** — Provide expansion/meaning for abbreviations.
- **3.1.5 Reading Level** — Where text requires more than lower-secondary education, provide a simpler alternative.
- **3.1.6 Pronunciation** — Provide pronunciation where meaning is ambiguous without it.
- **3.2.5 Change on Request** — Context changes only on user request, or a mechanism to turn them off.
- **3.3.5 Help** — Context-sensitive help is available.
- **3.3.6 Error Prevention (All)** — For any submission, it is reversible / checked / confirmable (extends 3.3.4 to all forms).
- **3.3.9 Accessible Authentication (Enhanced)** — No cognitive function test for authentication, with no object-recognition/personal-content exception.

## 4. Robust

- (No additional AAA criteria beyond AA in 4.x; continue meeting 4.1.2 and 4.1.3.)

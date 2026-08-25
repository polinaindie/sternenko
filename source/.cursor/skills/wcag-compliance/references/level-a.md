# WCAG 2.2 — Level A criteria (enforce always)

Every Level A criterion below is a hard constraint. Cite the SC number when enforcing or reporting.

## 1. Perceivable

- **1.1.1 Non-text Content** — Every image, icon, chart, button-image, CAPTCHA, and decorative graphic has a text alternative. Decorative images: `alt=""` (or `role="presentation"`). Informative images: meaningful `alt`. Functional images (links/buttons): alt describes the action. Complex images (charts): short alt + long description. NEVER omit the `alt` attribute entirely.
- **1.2.1 Audio-only / Video-only (Prerecorded)** — Provide a transcript for audio-only; transcript or audio description for video-only.
- **1.2.2 Captions (Prerecorded)** — Synchronized captions for prerecorded video with audio.
- **1.2.3 Audio Description or Media Alternative (Prerecorded)** — Provide for prerecorded video.
- **1.3.1 Info and Relationships** — Structure conveyed visually must be programmatic: use real `<h1>`–`<h6>`, `<ul>/<ol>`, `<table>` with `<th scope>`, `<fieldset>/<legend>`, `<label>`. No fake headings via bold text. No layout tables with data semantics.
- **1.3.2 Meaningful Sequence** — DOM order matches reading order; don't rely on CSS-only reordering that breaks meaning.
- **1.3.3 Sensory Characteristics** — Instructions don't rely solely on shape, size, position, or sound ("click the round button" → also name it).
- **1.4.1 Use of Color** — Color is never the only means of conveying info (e.g. required fields, error states, links in body text need a non-color cue such as underline or icon).
- **1.4.2 Audio Control** — Any audio that plays automatically for >3s has a pause/stop/volume control independent of system volume.

## 2. Operable

- **2.1.1 Keyboard** — All functionality available via keyboard. Interactive elements are native (`<button>`, `<a href>`, `<input>`) or have proper role + key handlers.
- **2.1.2 No Keyboard Trap** — Focus can always move away using standard keys.
- **2.1.4 Character Key Shortcuts** — Single-character shortcuts can be turned off, remapped, or are active only on focus.
- **2.2.1 Timing Adjustable** — Time limits can be turned off, adjusted, or extended (with exceptions).
- **2.2.2 Pause, Stop, Hide** — Moving/blinking/scrolling/auto-updating content >5s has a mechanism to pause/stop/hide.
- **2.3.1 Three Flashes or Below Threshold** — No content flashes more than 3 times per second.
- **2.4.1 Bypass Blocks** — Provide a skip link or landmarks (`<nav>`, `<main>`) to skip repeated content.
- **2.4.2 Page Titled** — Every page has a descriptive `<title>`.
- **2.4.3 Focus Order** — Focus order preserves meaning and operability. NO positive `tabindex` values.
- **2.4.4 Link Purpose (In Context)** — Link text (with context) describes its destination. Avoid bare "click here"/"read more" without context.
- **2.5.1 Pointer Gestures** — Multipoint/path-based gestures have a single-pointer alternative.
- **2.5.2 Pointer Cancellation** — Down-event alone doesn't trigger; allow abort/undo (use click/up-event).
- **2.5.3 Label in Name** — The accessible name of a control contains its visible label text.
- **2.5.4 Motion Actuation** — Functions triggered by device motion also have a UI control and can be disabled.

## 3. Understandable

- **3.1.1 Language of Page** — Root element has a valid `lang` attribute.
- **3.2.1 On Focus** — Receiving focus does not trigger an unexpected context change.
- **3.2.2 On Input** — Changing a setting doesn't auto-trigger a context change unless the user is warned.
- **3.3.1 Error Identification** — Input errors are identified in text and described to the user.
- **3.3.2 Labels or Instructions** — Inputs that need them have labels/instructions. Placeholder is NOT a substitute for a label.

## 4. Robust

- **4.1.2 Name, Role, Value** — All UI components expose name, role, state, value to assistive tech (correct semantic elements or ARIA). Custom widgets must implement the proper ARIA pattern.

> Note: 4.1.1 Parsing was removed in WCAG 2.2; still produce valid, well-formed markup.

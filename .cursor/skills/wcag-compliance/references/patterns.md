# Implementation patterns & verification helpers

Use these to actually satisfy the criteria — not just describe them.

## Computing color contrast (enforce, don't guess)

Contrast ratio = (L1 + 0.05) / (L2 + 0.05), where L is relative luminance.
Relative luminance: for each sRGB channel c in {R,G,B} normalized to 0–1,
`c_lin = c/12.92 if c ≤ 0.03928 else ((c+0.055)/1.055)^2.4`, then
`L = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin`.

Run this to check any pair before using it:

```python
def _lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hexcolor):
    h = hexcolor.lstrip('#')
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126*_lin(r) + 0.7152*_lin(g) + 0.0722*_lin(b)

def contrast(fg, bg):
    l1, l2 = luminance(fg), luminance(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return round((hi + 0.05) / (lo + 0.05), 2)

# Thresholds: AA normal 4.5, AA large 3.0, AA non-text 3.0,
#             AAA normal 7.0, AAA large 4.5
print(contrast('#767676', '#ffffff'))  # -> 4.54 (passes AA normal)
print(contrast('#999999', '#ffffff'))  # -> 2.85 (FAILS AA normal & large)
```

Reject any pair that does not meet the threshold for the selected level. If a brand color fails, propose the nearest passing shade and show both ratios.

## Accessible form field (1.3.1, 3.3.2, 1.4.11, 4.1.2)

```html
<label for="email">Email address</label>
<input id="email" name="email" type="email" autocomplete="email"
       aria-describedby="email-hint email-err" aria-invalid="false" required>
<p id="email-hint">We'll never share it.</p>
<p id="email-err" role="alert" hidden>Enter a valid email like name@example.com.</p>
```
- Visible `<label>` linked by `for`/`id` — placeholder is never the label.
- Errors announced via `role="alert"`; set `aria-invalid="true"` on failure.
- `autocomplete` token satisfies 1.3.5.

## Button vs link (2.1.1, 4.1.2)

Use `<button>` for actions, `<a href>` for navigation. Never `<div onclick>`. If a custom control is unavoidable:
```html
<div role="button" tabindex="0" aria-pressed="false"
     onkeydown="if(e.key===' '||e.key==='Enter'){...}">…</div>
```

## Visible focus (2.4.7, 2.4.13)

Never strip focus without replacement:
```css
:focus-visible {
  outline: 2px solid #1a1a1a;     /* ≥3:1 vs background */
  outline-offset: 2px;
}
/* NEVER ship: *:focus { outline: none; } with no substitute */
```

## Status messages (4.1.3)

```html
<div role="status" aria-live="polite">Saved.</div>     <!-- non-urgent -->
<div role="alert" aria-live="assertive">Upload failed.</div> <!-- urgent -->
```
Update the text content; do not move focus.

## Skip link & landmarks (2.4.1, 1.3.1)

```html
<a class="skip" href="#main">Skip to content</a>
<nav aria-label="Primary">…</nav>
<main id="main">…</main>
```

## Reduced motion (2.3.3)

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

## Target size (2.5.8 AA = 24px, 2.5.5 AAA = 44px)

Ensure clickable area meets the minimum; use padding, not just icon size.

## Image alt decision tree (1.1.1)

- Decorative → `alt=""`
- Conveys info → concise descriptive `alt`
- Inside a link/button → `alt` = the action/destination
- Complex (chart/diagram) → short `alt` + adjacent long description
- Never omit the attribute.

## Things that ALWAYS need manual verification

Mark these as "needs manual check" — do not claim automated pass:
- Quality/meaningfulness of alt text and labels (not just presence).
- Logical reading & focus order in complex/grid layouts.
- Whether color is truly the only cue in edge cases.
- Caption/transcript accuracy.
- Screen-reader announcement of custom widgets in real AT.
- Reading level (3.1.5) and language-of-parts correctness.

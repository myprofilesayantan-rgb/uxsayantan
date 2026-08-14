# Spacing & Typography Consistency Guide

This guide details the core design system guidelines and tokens implemented across the portfolio to establish uniform typography, grid rhythm, visual hierarchy, and seamless responsive scaling.

---

## 1. The Spacing Design System

All padding, margins, flexbox gaps, and grid layouts must strictly use the following four core layout variables. Hardcoded pixel margins or padding overrides (e.g. `23px`, `35px`) are prohibited.

| Spacing Token | Desktop Value | Mobile Value (≤768px) | Target Use Cases |
| :--- | :--- | :--- | :--- |
| `var(--gap-section)` | `60px` | `40px` | Section-level top/bottom paddings and outer wrapper limits. |
| `var(--gap-component)` | `60px` | `40px` | Gaps between major layouts, sliders, or independent cards inside a section. |
| `var(--gap-element)` | `36px` | `24px` | Spacing between related layout blocks (e.g., heading → slider, graphic → text description). |
| `var(--gap-micro)` | `24px` | `16px` | Padding inside cards, list item gaps, tightly coupled labels (e.g., titles → metadata). |

### Responsive Scaling Architecture
Spacing overrides are implemented globally on the `:root` element in [tokens.css](file:///d:/Projects/uxsayantandotcom_Production/LIve/tokens.css):
```css
@media (max-width: 768px) {
  :root {
    --gap-section: 40px;
    --gap-component: 40px;
    --gap-element: 24px;
    --gap-micro: 16px;
  }
}
```
Components should reference the standard token values directly. The browser automatically compresses spacing values on mobile viewports, eliminating the need for redundant media query overrides in component stylesheets.

---

## 2. Typography Token Scale

All typography specifications must use the standardized font scale and weight parameters.

### Font Family
- **Primary Family**: `'SF Pro', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif` (`var(--font-family)`)

### Typographical Sizes

| Font Size Token | Responsive Value | Typical Applications |
| :--- | :--- | :--- |
| `var(--font-size-hero)` | `clamp(2rem, 5.5vw, 4.5rem)` | Above-the-fold Hero H1 Headings. |
| `var(--font-size-5xl)` | `clamp(20px, 3.5vw, 38px)` | Main Section Headings (Featured, Hidden Friction). |
| `var(--font-size-3xl)` | `32px` | Section Subheadings, Page Headers. |
| `var(--font-size-xl)` | `24px` | Card headers, widget metrics, title highlights. |
| `var(--font-size-base)` | `16px` | Standard interface copy, descriptive text layouts. |
| `var(--font-size-sm)` | `14px` | Captions, card body details, helper descriptions. |
| `var(--font-size-xs)` | `12px` | Eyebrow text, badge tags, category markers. |

### Font Weights

- **Regular**: `400` (`var(--font-weight-regular)`)
- **Medium**: `500` (`var(--font-weight-medium)`)
- **Semibold**: `600` (`var(--font-weight-semibold)`)
- **Bold**: `700` (`var(--font-weight-bold)`)

---

## 3. Dynamic Color Architecture

Theme variables swap dynamically to match the user's active mode preference. All colors must map to the following semantic variables:

```css
:root {
  /* Day / Night Shared Accent & Action Tokens */
  --color-primary-blue: #5AA4F9;
  --color-primary-green: #30D158;
  --color-text-red: #ED2121;
  
  /* Night Mode Semantics (Default) */
  --bg-primary: #151512;
  --text-primary: #AA9D9D;
  --text-heading: #ffffff;
}

html.light-mode {
  /* Day Mode Semantics (Microsoft Fluent 2 Spec) */
  --color-primary-blue: #0078D4;
  --color-primary-green: #107C41;
  --color-text-red: #D13438;
  --bg-primary: #ffffff;
  --text-primary: #424242;
  --text-heading: #242424;
}
```

---

## 4. Visual Verification Dashboard
The live style guide showing these tokens, sizes, and spacing scales dynamically is available at [consistency.html](file:///d:/Projects/uxsayantandotcom_Production/LIve/consistency.html).

---

## 5. Design Token Enforcement & AI Developer Rules

To ensure visual consistency and maintainability across the entire workspace, all styling modifications must strictly consume design tokens from `tokens.css` (either global `tokens.css` or project-specific `smart-bi/tokens.css`).

### Mandatory Compliance Checklist:
1. **No Hardcoded Hex/HSL/RGB Codes**: Color declarations must strictly use `var(--sbi-*)` or standard semantic variables like `var(--color-primary-blue)`.
2. **No Hardcoded Layout & Spacing Dimensions**: Padding, margin, grid gap, and flex gap specifications must use standard layouts like `var(--gap-element)` or spacing scales like `var(--sbi-space-4)`.
3. **No Hardcoded Typography & Border Radii**: Font sizing, weights, line-heights, letter-spacings, border-radii, and border-widths must reference design tokens.
4. **No Hardcoded Motion Constants**: Transitions must leverage duration and easing variables like `var(--sbi-duration-normal)` and `var(--sbi-ease-spring-soft)`.
5. **Enforcement**: Any AI or developer proposing changes must run a static analysis search/verification before committing updates.


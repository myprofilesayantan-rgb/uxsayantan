# Project Rules & Experience Guidelines

> [!CAUTION]
> **STANDING INSTRUCTION — NON-NEGOTIABLE. READ BEFORE ANY ACTION.**
> The Lock System in Section 4 is the highest-priority rule in this document.
> Every section in the Lock Matrix is FROZEN. You may NOT touch any locked section's
> HTML, CSS, JS, spacing, animation, or structure — for ANY reason — unless the user
> explicitly says `Unlock [Section Name]`. No exceptions. No assumptions. No workarounds.

> [!CAUTION]
> **STRICT GIT & UPLOAD RULE — NON-NEGOTIABLE**
> NEVER EVER upload, push, or commit any file from the local environment to GitHub or any remote repository unless explicitly requested by the user. Upload, push, and commit requests will strictly come from the user's end only. Never execute git commit, git push, or repository upload actions proactively or automatically under any circumstances.

> [!CAUTION]
> **STRICT SCOPE RULE — Added 2026-06-05**
> Do ONLY what the user explicitly requests. No additions, no proactive improvements,
> no unrequested features, no extra changes beyond the exact instruction given.
> Discipline is the key. Wait for the instruction. Execute only that. Stop.

> [!IMPORTANT]
> This is the master guidelines document governing the entire user experience, responsive behavior, asset usage, and codebase protection. Every rule in this file MUST be checked and verified before executing any code changes.


---

## 1. Responsive Design Rules

1. **Prefer intrinsic responsiveness** over media queries.
2. **Use CSS Grid** for flexible multi-column layouts:
   ```css
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
   ```
3. **Use Flexbox** with wrap enabled:
   ```css
   flex-wrap: wrap
   ```
4. **Never use fixed widths** unless explicitly requested.
   * *Avoid*: `width: 1200px`, `height: 500px`
5. **Prefer fluid constraints**:
   ```css
   width: 100%;
   max-width: [value];
   ```
6. **Use fluid typography** utilizing `clamp()` for scaling:
   ```css
   font-size: clamp(min, preferred, max)
   ```
7. **Use relative units** for layout, spacing, and sizing:
   `rem`, `em`, `%`, `vw`, `vh`
8. **Component support**: All components must scale and function perfectly from **320px to 1920px** viewport widths without layout breaks or horizontal overflows.
9. **Alternative layout methods**: Before resorting to media queries, attempt:
   * CSS Grid `auto-fit`
   * CSS Grid `minmax`
   * Flexbox wrapping
   * `clamp()` function sizing
   * Fluid `max-width` / `max-height`
10. **Media queries** are the last resort, not the first solution.
11. **Single Layout Structure**: Never create separate desktop and mobile layouts unless specifically requested.
12. **Mental Breakpoint Testing**: Mentally verify and test the design layout at:
    * `320px` (mobile portrait)
    * `768px` (tablet portrait)
    * `1024px` (tablet landscape / desktop small)
    * `1440px` (desktop standard)
13. **Visual Hierarchy**: Always preserve strict visual hierarchy and reading order during viewport resizing.
14. **Layout Structure**: Do not use absolute positioning for primary layout structural elements unless necessary.

---

## 2. 2x Image Quality & Scaling Rules

1. **High-Density Assets**: Recognize that PNG assets under the `images/` directory are exported at double resolution (2x) to ensure pixel depth and crispness on Retina/high-density screens.
2. **Proportional Scaling**: Never output high-density images at their raw dimensions. Always scale them programmatically via CSS (using `max-width: 100%`, `height: auto`, or wrapper containers) to fit the page proportions perfectly.
3. **Aspect Ratio Preservation**: Ensure that layout containers do not distort or warp image aspect ratios when resizing.

---

## 3. Image Instruction Folder Rules

1. **Mandatory Folder Checks**: Every time the user asks to check image instructions, screen captures, or folder references, the agent MUST immediately inspect the `image_instruction` folder for new or updated files.
2. **Apply Visual Instructions**: Use the annotated images, layouts, and comments in `image_instruction` to guide the creation of HTML markup, responsive CSS, dynamic layout adjustments, and debugging tasks.

---

## 4. Design & Code Protection Rules

### Core Principle
Once a section is approved and locked, it becomes immutable. The objective is to prevent unintended modifications, visual drift, structural changes, or creative reinterpretation.

### Locking System
* When the user says:
  ```
  Lock [Section Name]
  ```
  That section is considered frozen and immutable.
* When the user says:
  ```
  Unlock [Section Name]
  ```
  Only then may that section be edited.

### Section Lock Status Matrix
| Section Name | Status | Date Locked |
| :--- | :--- | :--- |
| **Header & Navigation** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Hero Section** | 🔒 **LOCKED (Immutable)** | 2026-05-29 |
| **Mouse Pointer Animation (Gravity Well)** | 🔒 **LOCKED (Immutable)** | 2026-06-01 |
| **Favicon** | 🔒 **LOCKED (Immutable)** | 2026-05-30 |
| **Credibility Logos** | 🔒 **LOCKED (Immutable)** | 2026-05-29 |
| **Scrolling Marquee** | 🔒 **LOCKED (Immutable)** | 2026-05-29 |
| **Tracto (All Slides, CTAs & SOS state)** | 🔓 **UNLOCKED** | 2026-07-03 |
| **Tools & Technologies** | 🔒 **LOCKED (Immutable)** | 2026-06-01 |
| **Hidden Friction (SVG & Slider)** | 🔒 **LOCKED (Immutable)** | 2026-06-01 |
| **About Section (Collapsible grid & transitions)** | 🔒 **LOCKED (Immutable)** | 2026-06-01 |
| **Outcomes** | 🔒 **LOCKED (Immutable)** | 2026-07-24 |
| **Featured** | 🔒 **LOCKED (Immutable)** | 2026-07-24 |
| **Final Statement** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Custom Context Menu** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Smart BI — Navigation** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Smart BI — Hero Section** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Smart BI — Discover** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Smart BI — Goal / Solution Card** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Smart BI — Process & Workflow** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |
| **Smart BI — Footer** | 🔒 **LOCKED (Immutable)** | 2026-06-05 |

---

### DO
* Edit only the section explicitly requested.
* Preserve existing visual hierarchy.
* Preserve spacing and alignment.
* Preserve component structure.
* Preserve existing interactions.
* Preserve typography choices.
* Preserve colors unless explicitly requested.
* Preserve animations unless explicitly requested.
* Add new features only in requested areas.
* Respect all locked sections.
* Ask before making assumptions.
* Make the smallest possible change to satisfy the request.
* Scope theme adjustments: Implement all Day/Light mode visual adjustments strictly as overrides under html.light-mode or body.light-mode.

### DON'T
* Do not redesign completed sections.
* Do not refactor locked sections.
* Do not change spacing in locked sections.
* Do not modify CSS of locked sections.
* Do not rename classes, components, variables, or files unless requested.
* Do not improve visuals on your own.
* Do not modernize layouts on your own.
* Do not change responsive behavior on your own.
* Do not change typography on your own.
* Do not alter animations on your own.
* Do not move components between sections.
* Do not rewrite existing code simply because another approach is preferred.
* Do not apply global changes that affect locked sections.
* Do not introduce new design patterns without approval.
* Do not start any new section HTML or layout changes on your own unless explicitly asked. When designing any new section, first obtain clarity and visual/layout expectations from the user to avoid duplicate visual work.
* Do not alter default Dark Mode: The baseline dark (Night) theme colors, styling, grid lines, and elements are final and immutable. All updates must preserve the original dark mode rendering without conflict.

---

### Before Every Change
Verify:
1. Which section is being modified?
2. Is the section locked?
3. Will this change affect any locked section?
4. Will this change alter visuals outside the requested scope?
5. Can the request be completed with a smaller change?

If any answer creates risk to a locked section, stop and ask for confirmation.

---

### Response Format
Before making changes, always report:
```
Affected Section:
Impact Scope:
Locked Sections Checked:
Risk Level: None / Low / Medium / High
```
Then proceed with the requested change only.

---

### Golden Rule
Never interpret a request as permission to redesign, restructure, refactor, optimize, modernize, beautify, or improve unrelated parts of the project. Change only what is explicitly requested. Everything else remains untouched.

---

## 5. Undo System & Change History

### Core Principle
The agent must remember every change made during the session. If the user says **"Undo"**, the agent must immediately restore the exact previous state of the changed file(s) — no questions asked.

### Rules

1. **Track every change**: Before applying any edit to a file, mentally store the previous content of that exact block.
2. **One-level undo minimum**: Always be able to revert the single most recent change on request.
3. **Multi-level undo**: If the user says "Undo" multiple times in a row, continue reverting step-by-step through the change history of the session.
4. **Undo is exact**: Do not paraphrase, reinterpret, or partially revert. Restore exactly what was there before.
5. **Undo confirmation**: After reverting, confirm with:
   ```
   ↩ Undone: [Brief description of what was reverted]
   Restored: [File name and section]
   ```
6. **Undo does not affect locked sections**: Even during undo, never touch a locked section unless it was the agent who modified it (which should never happen).
7. **Session memory**: Change history is maintained for the full duration of the conversation session.

### Trigger Words
The following phrases trigger an undo action:
- `Undo`
- `Revert`
- `Go back`
- `Bring back the last version`
- `Restore previous`

---

## 6. Workspace Root & Screenshot Policy

### Workspace Root Lock
- **All code changes must be made exclusively under `d:\Projects\uxsayantandotcom_Production\LIve\`**
- Never write files to any other directory or path
- Never assume a different project root without explicit user confirmation

### Screenshot / Visual Diagnosis Policy
- **Do NOT make any code decisions based on screenshots**
- Screenshots are unreliable — they may be outdated, cropped, or from a different state
- Always read the actual source files directly to understand the current state
- If a visual issue is reported, diagnose by reading the code, not by interpreting the screenshot

### GitHub & Repository Upload Policy
- **Zero Automatic GitHub Uploads**: NEVER upload, push, or commit any file from the local environment to GitHub or any remote repository unless the user explicitly requests it.
- **User-Initiated Only**: All upload/push/commit requests must come strictly from the user's end.
- **No Unrequested Git Commands**: Never execute `git push`, `git commit`, or remote repository sync actions automatically or proactively.

---

## 7. Spacing Design System (Thumbrule — Always Apply)

> [!IMPORTANT]
> This spacing system is the **backbone of the portfolio**. It is derived from `image_instruction/consistency.png` and MUST be applied to every existing and future component — even without being explicitly asked. It is a thumbrule for both the agent and the user.

### Reference Canvas
- Width: **1280px**, Height: **832px**
- Spacing values hold at this resolution; they scale fluidly on other viewports.

---

### The Four Spacing Tokens

| Token Name | CSS Variable | Value | Color Code | Use For |
|:-----------|:-------------|:------|:-----------|:--------|
| Section Gap | `--gap-section` | **60px** | 🟠 Orange | Section container top & bottom margin (each side) |
| Component Gap | `--gap-component` | **60px** | 🔵 Blue | Gap between major components or objects within a section |
| Element Gap | `--gap-element` | **36px** | 🟢 Green | Gap between related elements (heading → tabs, image → caption) |
| Micro Gap | `--gap-micro` | **24px** | 🟣 Magenta | Gap between tightly paired elements (eyebrow → sub-label, caption → dots) |

> **Rule:** Two adjacent sections each contributing `--gap-section` = **120px total visual gap** between content. This is the intended section-to-section rhythm.

---

### When to Use Each Token

```
Page Structure
├── [Section A]
│     padding-top: --gap-section (60px)        🟠
│     padding-bottom: --gap-section (60px)      🟠
│
│     ├── [Major Component]
│     │     gap from next component: --gap-component (60px)  🔵
│     │
│     │     ├── [Eyebrow label]
│     │     │     ↓ --gap-micro (24px)                       🟣
│     │     ├── [Sub-label]
│     │     │     ↓ --gap-element (36px)                     🟢
│     │     ├── [Heading / Description]
│     │     │     ↓ --gap-element (36px)                     🟢
│     │     ├── [Tab Navigation]
│     │     │     ↓ --gap-element (36px)                     🟢
│     │     └── [Slide Content]
│     │
│     └── [Image / Media]
│           ↓ --gap-element (36px)                           🟢
│           [Caption Text]
│           ↓ --gap-micro (24px)                             🟣
│           [Pagination Dots]
│
└── [Section B]
      padding-top: --gap-section (60px)         🟠
```

---

### Mobile Spacing
| Token | Desktop | Mobile (≤768px) |
|:------|:--------|:----------------|
| `--gap-section` | 60px | 40px |
| `--gap-component` | 60px | 40px |
| `--gap-element` | 36px | 24px |
| `--gap-micro` | 24px | 16px |

---

### Enforcement Rules

1. **Always** use spacing tokens — never invent new pixel values for margins/gaps without mapping to one of the four tokens.
2. **Never** use 3-digit pixel values for spacing (100px, 120px, 150px etc.) — only the four 2-digit token values apply.
3. **When adding a new component** — map every internal spacing to the appropriate token before writing CSS.
4. **When reviewing existing components** — flag and fix any spacing that doesn't match a token value.
5. **Eyebrow → Sub-label** always uses `--gap-micro` (24px).
6. **Sub-label → Heading / Description** always uses `--gap-element` (36px).
7. **Heading → Navigation or next block** always uses `--gap-element` (36px).
8. **Section container** always uses `--gap-section` (60px) top and bottom via `.section-container`.
9. **Between major objects** (e.g. image → caption, teapot → text) always uses `--gap-element` (36px).
10. **Between micro-paired items** (caption → dots, tag → timestamp) always uses `--gap-micro` (24px).

---

### CSS Variables Reference (in `tokens.css`)
```css
--gap-section:    60px;   /* 🟠 Section container margin each side */
--gap-component:  60px;   /* 🔵 Between major components/objects */
--gap-element:    36px;   /* 🟢 Between related elements */
--gap-micro:      24px;   /* 🟣 Between tightly paired elements */
```

---

## 8. Sub-Project Modular Architecture Rule

### Core Principle
All future sub-projects, showcase case studies, or separate project pages built under the portfolio must follow a completely modular, self-contained directory structure. This separates the parent portfolio's assets from the sub-projects, preventing asset pollution.

### Directory Structure
Each sub-project must live in its own named directory under the working directory (e.g., `[project-name]/`).
Inside that directory, it must maintain its own independent assets, structure, and configurations:
```
LIve/
├── [project-name]/
│   ├── index.html            ← Project entry point
│   ├── images/               ← Project-specific images (completely separate)
│   ├── css/                  ← Project-specific stylesheets (if modularised)
│   └── js/                   ← Project-specific scripts
```

### Rule Enforcement
- Do NOT mix sub-project images with the parent portfolio's `images/` folder.
- Do NOT import parent CSS or components unless explicitly intended (e.g., matching design tokens like font stack or global theme settings).
- All links from the sub-project back to the parent portfolio must point to `../index.html`.

---

## 9. Prompt & Reference Image Comprehension Rule

### Core Principle
The agent must read and fully parse every single word, detail, constraint, and instruction inside the user's prompt, as well as examine any provided reference images or design layout screenshots with extreme detail. No instructions from prompts or visual cues from reference images may be skipped, overlooked, or assumed.

### Implementation Checklist
1. **Prompt Parsing**: Read the full text of the prompt and extract all visual/functional constraints (e.g. alignment, spacing, color matching, font weight).
2. **Reference Image Inspection**: Look for branding details, text weight, spacings, colors, and layout details in any uploaded or referenced screenshots (e.g. Microsoft navigation bar, pixel alignment, padding).
3. **Execution Quality**: Match the code implementation precisely to the extracted rules.


# ClickUp Product Design System (App & Workspace UI)

This document details the visual architecture, typography, color palettes, spacing constraints, and component state logic of the **ClickUp SaaS Application** (specifically focusing on the **ClickUp 3.0** product interface). This specification focuses on the product/workspace UI itself (where users manage tasks, dashboards, and workflows) rather than the marketing website.

---

## 1. Information Architecture & Workspace Layout

The ClickUp product layout is structured as a multi-panel grid designed to maximize data density while maintaining legibility:

*   **App Canvas (Background):** A cool, very light gray/blue canvas (`#F6F8FA` or `#F7F8F9`) that serves as the backdrop for all interface elements.
*   **Containers & Cards:** Core workspace modules (task lists, active chat panels, documentation editors, and dashboard cards) are rendered in solid white (`#FFFFFF`) to visually pop against the canvas.
*   **Subtle Dividers:** Structural columns, folders, and sidebars are separated by a `1px` solid border using a soft neutral gray (typically `#E9EBF0` or `#E2E8F0`).
*   **Elevation & Layering:** Floating menus, dropdown lists, and settings panels are lifted above the canvas using a light, high-blur drop shadow:
    *   *Token:* `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)`
*   **Border Radius:** Rounded corners are systematically applied:
    *   *Small (4px):* Status tags, dropdown menu items.
    *   *Standard (8px / 0.5rem):* Standard buttons, task card containers.
    *   *Large (12px):* Modals, floating pop-overs, and settings panels.
    *   *Pill (9999px):* Search inputs, priority tags, and avatar frames.

---

## 2. Typographic Scales & Rules

The ClickUp product uses a distinct typographic hierarchy optimized for high density and rapid scanning:

### Font Families
*   **Primary Sans-Serif (Inter):** The baseline font for all user text, task names, comment inputs, sidebar links, and buttons.
*   **Headline Font (Plus Jakarta Sans):** Used strictly for major landing headers, dashboard widgets, and large modal titles to provide clean geometric structural hierarchy.
*   **Monospace Font (Sometype Mono / Consolas):** Used for technical metadata (such as task IDs like `#t4b9c`), numeric date/time indicators, and calculated formula cells.

### Size Scale
| Token | Font Size | Line Height | Usage |
| :--- | :--- | :--- | :--- |
| **XS** | `11px` | `1.3` | Status labels, metadata, timestamps, and tiny tags. |
| **SM** | `13px` | `1.4` | Task names in list/board views, navigation menus, and standard button text. |
| **MD** | `14px / 15px`| `1.5` | Task descriptions, comments, documentation body text. |
| **LG** | `18px / 20px`| `1.4` | Modal titles, sub-section headers, and dashboard widgets. |
| **XL** | `24px` | `1.3` | Main dashboard headings and welcome screens. |

---

## 3. Product Button Taxonomy & Interactive States

Buttons inside the ClickUp product dynamically adapt their accent colors based on the user's selected **Workspace Theme Color** (with purple `#6647F0` as the default brand baseline).

### A. Primary Action Buttons (e.g., "Create Task", "Save Changes")
High-contrast filled buttons indicating the main success action on a screen:
*   **Default State:**
    *   *Background:* Solid theme color (default purple `#6647F0`).
    *   *Text:* White (`#FFFFFF`), semi-bold, size `13px` (SM).
    *   *Radius:* `8px` (`0.5rem`).
*   **Hover State:**
    *   *Background:* Darkens by 10% (e.g., `#5539D0`).
    *   *Shadow:* Triggers a subtle colored shadow glow (`box-shadow: 0 4px 12px rgba(102, 71, 240, 0.2)`).
*   **Active (Pressed) State:**
    *   *Background:* Darkens by 20% (e.g., `#4428B0`).
    *   *Transform:* Scales down slightly (`transform: scale(0.97)`) to simulate tactile feedback.
*   **Focus State:**
    *   *Outline:* `2px` solid ring in the theme color.
    *   *Offset:* `2px` offset (`outline-offset: 2px`), leaving a white gap between button and ring.
*   **Disabled State:**
    *   *Background:* Soft gray (`#F1F5F9`).
    *   *Text:* Slate-400 (`#94A3B8`).
    *   *Cursor:* `not-allowed`.
    *   *Pointer Events:* `none`.

### B. Secondary Action Buttons (e.g., "Add Filter", "Share Link")
Outline style buttons used for auxiliary or non-blocking actions:
*   **Default State:**
    *   *Background:* White (`#FFFFFF`).
    *   *Border:* `1px` solid light gray (`#E2E8F0`).
    *   *Text:* Slate-600 (`#475569`).
*   **Hover State:**
    *   *Background:* Slate-50 (`#F8FAFC`).
    *   *Border:* Darkens to `#CBD5E1`.
    *   *Text:* Slate-800 (`#1E293B`).
*   **Active State:**
    *   *Background:* 5% opacity theme color tint (e.g., `rgba(102, 71, 240, 0.05)`).
    *   *Border:* Soft theme color outline.
*   **Disabled State:**
    *   *Border:* Light gray (`#F1F5F9`).
    *   *Text:* Slate-300 (`#CBD5E1`).
    *   *Opacity:* Reduced to `0.5`.

### C. Ghost / Icon Buttons (e.g., Status selector, column settings, checklist items)
Subtle borderless buttons used inside dense task headers:
*   **Default State:**
    *   *Background:* Transparent (`rgba(0,0,0,0)`).
    *   *Text:* Slate-500 (`#64748B`).
*   **Hover State:**
    *   *Background:* 5% opacity theme color tint (e.g., `rgba(102, 71, 240, 0.05)`) or light gray highlight (`#F1F5F9`).
    *   *Text:* Theme color (default purple `#6647F0`).
*   **Active State:**
    *   *Background:* 10% opacity theme color tint (`rgba(102, 71, 240, 0.1)`).

---

## 4. Status Pills & Metadata Tags

Status and metadata indicators are highly optimized to minimize visual noise while encoding states:

*   **Status Tags (e.g., "To Do", "In Progress", "Complete"):**
    *   *Structure:* Rounded pill container with a 5% to 10% opacity background color matching the status category (e.g., light green for active, light blue for staging).
    *   *Indicator:* A small, solid-colored circular dot on the left.
    *   *Text:* Bold uppercase size `11px` (XS) matching the status color shade.
    *   *Hover State:* Background opacity increases to 18%, and a dropdown arrow icon fades in on the right if clickable.
*   **Priority Flags:**
    *   *Urgent:* Red flag (`#EF4444`).
    *   *High:* Yellow flag (`#F59E0B`).
    *   *Normal:* Blue flag (`#3B82F6`).
    *   *Low:* Gray flag (`#94A3B8`).
    *   *Hover:* Background turns light gray, and a priority text label shifts into view.

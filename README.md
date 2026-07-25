# uxsayantan
UX Portfolio of Sayantan Ghosh – UX & AI Experience Strategist | Research, Case Studies & Design Thinking

## Overview
This repository contains the source code for the personal portfolio of Sayantan Ghosh, a Senior UX & Product Designer with 22+ years of experience. The portfolio showcases a variety of professional works across B2B SaaS, Healthcare, Gaming, and enterprise tools (including projects for Google, Cisco, Blue Dart, etc.).

## Project Architecture
The project follows a modular, component-based frontend architecture designed without relying on overly complex framework dependencies, prioritizing fluid responsiveness and native web performance.

- **`index.html`**: The main entry point containing the full portfolio structure, organized into distinct semantic sections (`section-hero`, `section-about`, `section-tracto`, etc.).
- **CSS Architecture**: 
  - `desktop.css` & `responsive.css`: Core layout structure.
  - `tokens.css`: The central source of truth for design tokens (spacing, typography, colors, light/dark mode variables).
  - Component-specific CSS files are housed inside `components/`.
- **GSAP Animations**: Leverages GreenSock Animation Platform for smooth scrolling, transitions, and component micro-interactions.
- **`skill/`**: Contains internal agent/design rules, UX guidelines, assignment instructions, and AI developer context (such as `.agents/rules/rules.md` and `consistency.md`) to maintain codebase and design integrity.

## Design System
- **Responsive Layout**: Designed to be intrinsically responsive using CSS Grid and Flexbox, leveraging `clamp()` and mathematical functions to avoid heavy media queries.
- **Theme Modes**: Supports dark (default) and light themes toggled via a script that restores preferences from `localStorage`.
- **Spacing**: Strictly uses predefined spacing tokens (`--gap-section`, `--gap-component`, `--gap-element`, `--gap-micro`).

## Setup & Local Development
Since the project relies mostly on static HTML/CSS/JS with absolute and relative linking within the `LIve/` directory, it can be previewed seamlessly through any static file server or directly in the browser (though `file://` protocol may restrict some dynamic script interactions).

- Navigate to the `LIve` directory and run a local server, e.g.:
  ```bash
  python -m http.server 8000
  # or
  npx serve
  ```

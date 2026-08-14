# Tracto Visual Design & UX Guidelines

## Purpose
This document defines the visual design, UX behavior, accessibility, interaction, and component standards for Tracto.

This is a product design guideline document intended for:
- Visual Designers
- UX Designers
- Product Designers
- UX Strategists
- Design Systems Teams
- Accessibility Review Teams

This document is not intended to define HTML structure, frontend code implementation, or engineering architecture.

The focus is on:
- Visual behavior
- UI consistency
- Accessibility
- Component behavior
- Interaction principles
- Layout standards
- User experience patterns
- Emotional design behavior
- Healthcare-first interface standards

---

# Global Rules

Global rules apply across the entire Tracto ecosystem including mobile apps, web apps, dashboards, widgets, notifications, emergency systems, and future feature expansions.

---

# 1. Accessibility First

## Core Principle
All UX decisions must follow the latest WCAG guidelines.

Accessibility is not a final QA checklist. It must be integrated into:
- Information Architecture
- Navigation
- Component creation
- Color selection
- Typography
- Motion
- Touch interactions
- Forms
- Alerts
- Notifications
- Emergency workflows

---

## WCAG Standards

### DO
- Maintain minimum WCAG AA compliance across the product
- Use semantic hierarchy for layouts and content
- Ensure all buttons have accessible labels
- Maintain proper touch target size
- Use high contrast between text and background
- Ensure all actions are understandable without relying only on color
- Provide visible focus states
- Support screen readers properly
- Use clear and human-readable labels
- Keep interaction flows predictable
- Use plain language
- Allow scalable text without breaking layouts
- Ensure emergency actions are always reachable within minimal steps

### DON'T
- Do not use low contrast typography
- Do not use tiny clickable elements
- Do not rely only on icons without labels
- Do not hide important actions behind gestures only
- Do not overload users with multiple CTAs in one visual area
- Do not use flashing animations
- Do not use complex medical terminology without explanation
- Do not create hidden navigation patterns
- Do not make users remember information across screens
- Do not use light gray text for essential information

---

# 2. Information Architecture Guidelines

## Goal
The information architecture must support stress-free navigation, especially for elderly users or users in emergency situations.

### DO
- Keep bottom navigation consistent across all screens
- Use maximum 4-5 primary navigation items
- Keep emergency access visible globally
- Use meaningful labels instead of abstract naming
- Group related medical actions together
- Surface the most important tasks first
- Use progressive disclosure for advanced features
- Keep hierarchy shallow
- Maintain predictable layout positioning

### DON'T
- Do not bury emergency features deep inside menus
- Do not use confusing medical categories
- Do not overload the home screen with analytics
- Do not introduce unnecessary nested navigation
- Do not frequently change navigation placement
- Do not prioritize business goals over user urgency

---

# 3. Visual Design System

## Visual Design Direction

### Core Visual Personality
The visual language should feel:
- Calm
- Trustworthy
- Warm
- Human
- Reassuring
- Accessible
- Elder-friendly
- Professional but non-clinical

### Avoid
- Corporate-heavy visuals
- Cold interfaces
- Overly futuristic UI
- Overly gamified experiences
- Dense layouts
- Visually noisy screens

---

## Typography Guidelines

### DO
- Use highly readable sans-serif fonts
- Maintain strong hierarchy between headings and body text
- Use large readable font sizes for elderly users
- Use adequate line spacing
- Use sentence case for readability
- Use bold weight only for emphasis

### DON'T
- Do not use decorative fonts
- Do not use tightly packed typography
- Do not use excessive uppercase text
- Do not use thin font weights for critical information

---

## Color Guidelines

### DO
- Use colors with strong contrast
- Use green for positive confirmation carefully
- Use red only for urgent or dangerous situations
- Use soft neutral backgrounds to reduce stress
- Use consistent semantic color mapping

### DON'T
- Do not overuse bright saturated colors
- Do not use color alone to communicate meaning
- Do not mix too many semantic colors

---

# 4. Component Design Guidelines

## Buttons

### DO
- Use large touch-friendly buttons
- Maintain consistent button hierarchy
- Use clear action labels
- Provide feedback states

### DON'T
- Do not use vague CTA labels
- Do not use icon-only primary actions
- Do not create multiple primary buttons in the same section

---

## Cards

### DO
- Use cards to separate healthcare tasks
- Keep each card focused on one objective
- Use clear headings
- Show critical information first

### DON'T
- Do not overload cards with excessive data
- Do not mix unrelated information inside one card

---

# Page-Based Rules

---

# 5. Home Screen Widget Functional Guidelines

## Header Greeting Widget
### Purpose
Provides emotional connection and quick access to notifications and voice support.

### Functional Elements
- User greeting
- Profile image
- Notification access
- Voice assistant shortcut

---

## Wellness Support Banner
### Purpose
Provides emotional reassurance and immediate help actions.

### Functional Elements
- Family contact CTA
- Doctor contact CTA
- Family member shortcuts

---

## Emergency Assistance Widget
### Purpose
Supports urgent healthcare escalation.

### Functional Elements
- Ambulance support
- Emergency CTA
- Estimated arrival information

---

## Medication Reminder Widget
### Purpose
Helps users maintain medication adherence.

### Functional Elements
- Medicine name
- Dosage information
- Medication purpose
- Schedule timing
- Refill request
- Confirmation action

---

## Health Test Reminder Widget
### Purpose
Tracks preventive healthcare and recurring tests.

### Functional Elements
- Test reminder
- Due date countdown
- Booking action
- Reminder setup

---

## Nearby Emergency Help Widget
### Purpose
Provides quick access to nearby healthcare support.

### Functional Elements
- Medical store access
- Hospital access
- Medical records shortcut

---

## Insurance Widget
### Purpose
Helps users track insurance status and support actions.

### Functional Elements
- Insurance provider
- Coverage summary
- Renewal status
- Contact shortcuts

---

# 6. Visual Reference Preservation Rules

## Core Principle
The uploaded visual reference represents the baseline functional scope of the product experience.

Future redesigns must not remove or hide core functional capabilities shown in the reference.

### DO
- Preserve all primary workflows shown in the visual reference
- Maintain visibility of emergency support actions
- Preserve medication reminder functionality
- Preserve insurance visibility and renewal awareness
- Preserve caregiver and family communication shortcuts
- Preserve nearby healthcare access

### DON'T
- Do not remove existing healthcare support features for cleaner visuals
- Do not hide important actions inside menus during redesigns
- Do not reduce emergency accessibility to save screen space
- Do not simplify the UI by deleting useful workflows

---

# 7. Elderly-Centered UX Rules

### DO
- Prioritize readability
- Reduce cognitive load
- Design for slower interaction speed
- Use large interactive zones
- Maintain predictable workflows

### DON'T
- Do not assume technical knowledge
- Do not create hidden interactions
- Do not depend on memory-heavy workflows
- Do not use overly compact UI

---

# 8. Emergency UX Principles

### DO
- Make emergency access globally visible
- Reduce decision-making steps
- Enable one-tap support
- Prioritize clarity over aesthetics

### DON'T
- Do not interrupt emergency workflows with permissions or surveys
- Do not require complex authentication during critical moments

---

# Final Product Principles

Every Tracto experience should:
- Reduce anxiety
- Increase confidence
- Support independence
- Help caregivers collaborate
- Improve healthcare consistency
- Make emergency support faster
- Remain accessible to all age groups

If a design decision improves aesthetics but reduces clarity, accessibility, trust, or usability, the decision should be rejected.

---

# UX Portfolio Guidelines

## Project Context & Bias Control
- **No Project-Specific Bias**: Do not bias the portfolio's core design, branding, layout, copy, or logic towards "Tracto" or any other individual case study unless explicitly requested by the user.
- **Portfolio-First Focus**: Treat this workspace as the development of a personal UX portfolio. Individual projects (like Tracto or others) are case studies to be displayed within the portfolio, rather than defining the portfolio's own visual identity, goals, or functional systems.

## Skill 1: UX Portfolio Creation & IA Review

### Core Rules
- **Follow best WCAG Standards**: Ensure all design suggestions, layout systems, and visual elements strictly adhere to the highest WCAG accessibility guidelines.
- **Provide the Best Possible Navigation Structure**: Design user journeys and primary/secondary menu structures that minimize friction, cognitive load, and search time.
- **Provide WCAG-Aligned IA Reviews**: Every time the user requests an Information Architecture (IA) review, analyze, refine, and suggest solutions that are explicitly aligned with WCAG standards.
- **Human-Centric Content Only**: Write and format all portfolio content to sound human-centric, natural, and authentic. The tone must not sound or read as if it were AI-generated.
- **Avoid AI-Style Formatting Characters**: Completely avoid using em-dashes (—) or any other special formatting characters that typically look or sound like they were AI-created.

## Skill 2: Advanced HTML/CSS & Fluid Layouts

### Core Design & Layout Rules
- **Follow Design System**: Adhere strictly to the established design system tokens, components, and layout principles across both HTML and CSS.
- **Strict Visual Consistency**: Maintain absolute consistency in color application, fluid spacing scales, visual styles, and typography hierarchies across all elements and pages.

### Core HTML Rules
- **Best Practices**: Use clean, modern semantic HTML5 tags to structure layouts correctly.
- **Avoid Over-Engineering**: Keep the HTML hierarchy shallow and clean. Avoid unnecessary wrapper elements and nested divs.
- **Strict WCAG Compliance**: Maintain accessible markup structure, proper label associations, clear heading flows, and appropriate ARIA attributes where needed.
- **Analyze Graphical References Carefully**: When writing HTML, read and analyze all provided visual reference documents and images, paying precise attention to marked changes and guidelines.

### Core CSS Rules
- **Best-Practice Class Naming**: Use logical, consistent, and semantic class names (such as BEM structure or descriptive naming) rather than abstract or inline styles.
- **Media-Query-Less Responsiveness**: Avoid using hardcoded CSS `@media` breakpoint queries. Create responsive designs by letting the browser engine handle layout adjustments automatically.
- **Intrinsic & Fluid Sizing**: Leverage native browser spacing calculations using CSS mathematical functions like `clamp()`, `min()`, `max()`, and `calc()` for typography, margins, and padding.
- **Dynamic Layout Engines**: Rely on flexible CSS Grid configurations (such as auto-fit, auto-fill, and minmax) and Flexbox wrapping parameters to naturally adapt layouts across all device sizes.
- **Performance-First Styling**: Optimize layout rendering times and completely prevent layout shifts (CLS) by utilizing browser-native math calculations for spacing and layout scaling.


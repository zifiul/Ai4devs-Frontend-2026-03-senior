---
name: LTI Enterprise System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#424656'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#737687'
  outline-variant: '#c3c6d8'
  surface-tint: '#0052dd'
  primary: '#004ccd'
  on-primary: '#ffffff'
  primary-container: '#0f62fe'
  on-primary-container: '#f3f3ff'
  inverse-primary: '#b4c5ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#565758'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f7070'
  on-tertiary-container: '#f5f4f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003da9'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-01:
    fontFamily: IBM Plex Sans
    fontSize: 42px
    fontWeight: '300'
    lineHeight: 48px
    letterSpacing: '0'
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: '0'
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 34px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 26px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 16px
  sidebar-width: 256px
  header-height: 48px
---

## Brand & Style
The design system is built upon the principles of clarity, efficiency, and industrial-grade reliability. Designed for high-density HR management, the aesthetic is strictly functional and systematic, prioritizing information density over decorative flair. It employs a modern corporate style that balances accessibility with a modular architecture.

The emotional response is one of stability and professional confidence. Every visual choice is intended to reduce cognitive load for users managing complex datasets, ensuring that the interface remains unobtrusive while providing clear pathways for action. The style is defined by a rigorous adherence to a 2px radius and a restrained color palette, ensuring a cohesive experience across diverse functional modules.

## Colors
The color architecture of this design system utilizes a grayscale-first approach to define structural hierarchy, reserving vibrant color strictly for interaction and status communication. 

- **Surfaces:** Use White (#ffffff) for primary content areas and Gray 10 (#f4f4f4) for page backgrounds. Gray 20 (#e0e0e0) is reserved for subtle UI partitioning and hover states on light surfaces.
- **Primary Action:** The signature Blue (#0f62fe) is the exclusive signal for interactivity. It must be used for primary buttons, active states, and focus indicators.
- **Semantic Logic:** Status colors are calibrated for high legibility. Success (Green 30), Error (Red 50), and Warning (Yellow 20) provide immediate visual feedback without overwhelming the layout.

## Typography
Typography is the primary tool for hierarchy in the design system. **IBM Plex Sans** is used for all standard UI elements, ensuring maximum readability in dense data environments. **IBM Plex Mono** is employed specifically for technical labels, metadata, and numerical data in tables to provide a distinct visual "texture" for static or system-generated information.

The type scale follows a strict progression to maintain rhythm. Body text is standardized at 14px for most enterprise views to allow for high information density. Headings use lighter weights (300/400) to maintain a clean, sophisticated look even at larger sizes.

## Layout & Spacing
This design system operates on a rigorous 4px/8px grid system. All spatial relationships—padding, margins, and component heights—must be multiples of 4px.

- **Grid Model:** A 12-column fluid grid is used within the main content area. However, the overall page structure is fixed-fluid hybrid: a fixed 256px left navigation sidebar and a fixed 48px top bar.
- **Breakpoints:** 
  - **Desktop (1056px+):** Full 12-column grid with 16px margins.
  - **Tablet (672px - 1055px):** 8-column grid; sidebar can collapse to a 48px icon-only rail.
  - **Mobile (Up to 671px):** 4-column grid; sidebar transitions to a hidden off-canvas drawer.
- **Density:** Use 8px spacing for related elements within a component and 16px to 24px spacing between distinct modular panels.

## Elevation & Depth
Depth in the design system is communicated through **Tonal Layers** and subtle outlines rather than heavy shadows. This maintains a flat, systematic aesthetic that feels integrated into the browser.

- **Layering:** Level 0 is the Gray 10 background. Level 1 is the White content container. Level 2 (modals, popovers) uses a White surface with a very subtle 1px Gray 20 border and a soft, low-opacity ambient shadow (0px 2px 6px rgba(0,0,0,0.1)).
- **Dividers:** Use 1px solid lines in Gray 20 to separate list items, table rows, and sidebar sections.
- **Interactive Depth:** When an element is clicked or "active," it does not lift; instead, it changes fill color or gains a 2px high-contrast Blue border to indicate focus.

## Shapes
The shape language is geometric and precise. All interactive components (buttons, input fields, tags) utilize a consistent **2px border radius**. 

This "near-square" approach reinforces the industrial, professional tone of the software. For specific data-driven elements like Kanban cards or modular dashboard panels, square corners (0px) are preferred to maximize the alignment with the 8px grid and avoid visual gaps at the intersections of containers.

## Components
Consistent component behavior is critical for the accessibility-first mission of this design system.

- **Buttons:** 
  - *Primary:* Blue fill, white text, 2px radius.
  - *Secondary:* Dark Gray (#393939) fill.
  - *Tertiary:* Blue outline (1px), no fill.
  - *Ghost:* No fill or border; Blue text. Used for low-emphasis actions.
- **Data Tables:** High-density rows (32px or 40px height). Column headers use 12px Bold IBM Plex Sans with Gray 20 bottom borders. Alternate row striping is not used; use 1px dividers instead.
- **Input Fields:** 40px height, White fill with a 1px Gray 30 bottom border. On focus, the bottom border thickens to 2px in Blue.
- **Kanban Boards:** Cards should use a White background, 1px Gray 20 border, and no shadow. Use color-coded "Tags" (chips) with 2px radius for status categorization.
- **Navigation:** The left sidebar uses a high-contrast theme (Dark Gray background) to visually separate navigation from the workspace. Active links are indicated by a 4px Blue left-accent bar.
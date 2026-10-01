# UI/UX & Layout Audit Guidelines — SRJ Studio

This document defines mandatory guidelines and automated audit requirements for all user interface, layout, styling, and component code across this repository.

Whenever writing, editing, or refactoring components, pages, or stylesheets, the AI agent must automatically audit all modifications against the following strict UI/UX criteria.

---

## 1. Automated Layout Audit Directive

Before finalizing any UI code or styling change, verify the implementation against:
1. **Visual Hierarchy**: Does the eye naturally track from the primary focal point down through secondary information?
2. **Accessible Contrast**: Do all text elements, icons, and interactive controls satisfy WCAG 2.1 AA standards?
3. **Component Rhythm & Spacing**: Are spacing scales consistent, uncluttered, and balanced across viewport sizes?
4. **Responsive Integrity**: Does the layout adapt fluidly across desktop, tablet, and mobile viewports with zero horizontal overflow or clipping?
5. **Ux/UI Principles**: Leverage the local `uxui-principles` skill and references (`.agents/skills/uxui-principles/`) to eliminate common interface smells and antipatterns.

---

## 2. Strict Visual Hierarchy

- **Distinct Typography Scale**:
  - Maintain a strict hierarchy: Display Title (`h1`) > Section Header (`h2`) > Subheading/Card Title (`h3`/`h4`) > Body Text (`p`) > Eyebrow Badges/Labels.
  - Never allow secondary descriptions or body paragraphs to visually compete with section headings in weight or scale.
- **Action Hierarchy**:
  - Each view or card should feature at most **one primary call to action** (e.g., high-contrast solid pill button).
  - Secondary or exploratory actions must use ghost, outline, or text-link styles to prevent decision fatigue.
- **Grouping & Chunking (Gestalt Principles)**:
  - Related items (e.g., label + input field, icon + statistic) must sit closer together than unrelated elements.
  - Form fields must have dedicated logical groupings with clear section headings.
- **Editorial Balance**:
  - Balance text volume with architectural negative space; avoid monolithic text blocks that diminish scannability.

---

## 3. Accessible Color Contrast & Legibility

- **WCAG 2.1 AA Compliance**:
  - Standard text (< 18pt or < 14pt bold) must maintain a minimum contrast ratio of **4.5:1** against its direct background.
  - Large text (≥ 18pt or ≥ 14pt bold) must maintain at least **3:1** contrast.
- **Glassmorphic & Translucent Surfaces**:
  - When utilizing frosted glass (`backdrop-filter: blur(...)`) or translucent fills (`rgba(...)`), ensure foreground typography retains strong legibility regardless of underlying background gradients, glow shapes, or images.
  - Form inputs on translucent cards must have defined borders and distinct focus outlines.
- **Form Controls & Placeholders**:
  - Input labels must remain visible and legible (avoid relying solely on low-contrast placeholders).
  - Provide distinct `:focus` and `:focus-visible` indicators (e.g., amber accent rings `rgba(205, 162, 111, 0.4)`) for keyboard navigability.
- **Semantic Statuses**:
  - Error and success alerts must combine color with iconography or explicit text labels so information is not conveyed by color alone.

---

## 4. Intuitive Component Spacing & Spatial Rhythm

- **Consistent Spacing Scale**:
  - Standardize spacing using the project's CSS tokens (`--space-xs` through `--space-5xl`) based on a 4px/8px modular rhythm.
  - Card internal padding should comfortably breathe (`clamp(1.5rem, 3vw, 3rem)`) without crowding form inputs or content boundaries.
- **Horizontal & Vertical Alignment**:
  - Header, content sections, and footer must maintain harmonious alignment. Elements sharing a layout role (such as the navbar logo and footer logo) must share identical coordinate margins and edge gutters.
  - Multi-column grids must define explicit column gaps (`clamp(1.5rem, 3vw, 3rem)`) to prevent cognitive density overload.
- **Touch & Click Target Sizing**:
  - Interactive elements (buttons, links, select menus, language toggles) must provide a minimum touch target size of **44 × 44 px** on mobile and tablet devices.
  - Stacked action buttons and links must include sufficient vertical margin to prevent mis-clicks.

---

## 5. Luxury Architectural Aesthetic & Interaction Polish

- **Physical Elevation & Depth**:
  - Elevated elements (such as floating cards and modal dialogs) should utilize multi-tiered, diffuse box-shadows and subtle edge highlights rather than harsh dark outlines.
- **Purposeful Micro-Interactions**:
  - Transitions and hover effects must use smooth deceleration curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`) with durations between `250ms` and `500ms`.
  - Avoid abrupt, jerky hover states or non-performant animations that cause layout shifts (CLS).
- **Reduced Motion Respect**:
  - Always support `@media (prefers-reduced-motion: reduce)` by disabling non-essential continuous keyframe animations (such as marquees or floating loops).

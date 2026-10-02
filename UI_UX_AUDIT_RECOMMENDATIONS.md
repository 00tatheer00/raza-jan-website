# UI/UX Audit & Enhancement Recommendations — SRJ Studio

**Date:** October 2, 2026  
**Evaluation Framework:** `uxui-principles` (168 Research-Backed Design Standards & Smell Taxonomy)  
**Governance:** [`AGENTS.md`](./AGENTS.md)  

This document serves as a centralized reference catalog of all visual hierarchy, spacing, accessibility, and user flow findings identified across the codebase. You can reference this file at any time to prioritize and implement design improvements.

---

## 1. Visual Hierarchy & Content Architecture

### 1.1 Incomplete Section Heading in Team
- **File:** [`app/components/Team.jsx`](./app/components/Team.jsx) (Lines 79–82)
- **Current Behavior:** Heading displays `"When selecting SRJ Studio, we focus on several"`, terminating abruptly mid-sentence without a closing noun phrase.
- **UX Impact:** Increases cognitive load; reads like an unfinished placeholder.
- **Recommended Change:** Complete the statement with purposeful editorial copy (e.g., *"When selecting SRJ Studio, we focus on singular spatial mastery"* or *"our collective architectural disciplines"*).

### 1.2 Sub-Optimal Eyebrow Positioning in Hero
- **File:** [`app/components/Hero.jsx`](./app/components/Hero.jsx) (Lines 64–68)
- **Current Behavior:** The eyebrow badge reads `"• BUILDING FUTURE HOMES"`, which borrows phrasing common to mass-market housing developments.
- **UX Impact:** Incongruent with the bespoke architectural atelier positioning of Syed Raza Jan.
- **Recommended Change:** Update the eyebrow to reflect high-end architectural practice (e.g., *"Architectural Practice & Spatial Design"* or *"Islamabad · Global Commissions"*).

### 1.3 Competing Focal Points in Philosophy & Projects
- **File:** [`app/components/Philosophy.jsx`](./app/components/Philosophy.jsx) (Lines 161–220)
- **Current Behavior:** Contains three major distinct components (the large philosophical text reveal, the rotating quotes module, and the horizontal project carousel) crammed inside one `<section id="about">`.
- **UX Impact:** Competes for user attention; projects lack a dedicated hero framing.
- **Recommended Change:** Introduce a subtle visual divider or distinct section eyebrow before the carousel to clearly demarcate the transition from theoretical philosophy to tangible built works.

### 1.4 Software Proficiency Percentage Bars
- **File:** [`app/components/SkillBars.jsx`](./app/components/SkillBars.jsx) & [`app/components/Process.jsx`](./app/components/Process.jsx)
- **Current Behavior:** Displays percentage progress bars (*AutoCAD 95%*, *3ds Max 98%*, *Lumion 95%*).
- **UX Impact:** Percentage bars are a known portfolio anti-pattern. Prospective architectural clients evaluate spatial portfolios, construction fidelity, and client outcomes—not arbitrary software proficiency scores.
- **Recommended Change:** Replace numeric progress bars with a clean "Atelier Tooling & Technological Standards" pill tag cluster or workflow badges.

---

## 2. Component Spacing & Spatial Rhythm

### 2.1 Hero Viewport Crowding on Mobile Devices
- **File:** [`app/globals.css`](./app/globals.css) (Lines 2898–2924)
- **Current Behavior:** On screens under 900px, `.hero__title` and `.hero__right` stack closely with minimal breathing room.
- **UX Impact:** Monolithic visual density on mobile screens that diminishes the architectural luxury aesthetic.
- **Recommended Change:** Add an explicit vertical spacing gap (`gap: 2.5rem` / `--space-lg`) between the headline and the narrative description on mobile viewports.

### 2.2 Unscaled Quote Icons & Min-Height in Testimonials
- **File:** [`app/globals.css`](./app/globals.css) (Lines 1320–1365)
- **Current Behavior:** Fixed quotation mark SVG (`80px × 60px`) and portrait container (`min-height: 480px`).
- **UX Impact:** Pushes content downward on tablet screens, creating excessive vertical height.
- **Recommended Change:** Apply responsive scaling (`clamp(42px, 6vw, 80px)`) to the quote mark and reduce the client portrait min-height to `340px` on viewports below 768px.

### 2.3 Mobile Padding on Floating Inquiries Card
- **File:** [`app/globals.css`](./app/globals.css) (Line 1925)
- **Current Behavior:** Card padding is scaled with `clamp(2.2rem, 3.8vw, 3rem)`. On small phones (< 480px), multi-field groups crowd close to the outer border.
- **UX Impact:** Cramped touch fields on narrow devices.
- **Recommended Change:** Add a dedicated mobile padding override (`padding: 1.5rem 1.25rem;`) for screens under 480px.

---

## 3. Accessibility & Color Contrast (WCAG 2.1 AA)

### 3.1 Sub-Minimum Touch Targets on Testimonials Dots
- **File:** [`app/globals.css`](./app/globals.css) (Lines 1326–1333)
- **Smell Classification:** *Touch Target Violation (WCAG 2.5.5 / 2.5.8)*
- **Current Behavior:** `.testimonials__dot` is sized at `10px × 10px` with 0 padding.
- **UX Impact:** Severe failure of the 44 × 44px minimum touch target standard; users on phones frequently mis-click or fail to navigate slides.
- **Recommended Change:** Keep the visual dot at 10px using a pseudo-element (`::before`) or add transparent click padding (`padding: 12px; margin: -12px 2px;`) to achieve a compliant 44px target area.

### 3.2 Low-Contrast Footer Muted Text
- **File:** [`app/globals.css`](./app/globals.css) (Lines 2338–2348)
- **Smell Classification:** *`contrast-blindness`*
- **Current Behavior:** `.footer__terms` and `.footer__copy` use `--color-gray-500` (`#666666`) against `--color-obsidian` (`#111111`), yielding a contrast ratio of only **3.31:1**.
- **UX Impact:** Fails the WCAG 2.1 AA 4.5:1 minimum threshold for standard text legibility.
- **Recommended Change:** Update the color to `--color-gray-400` (`#999999` or `#a1a1aa`), increasing the contrast ratio to **5.4:1+**.

### 3.3 Missing "(Optional)" Clarifiers in Inquiry Form
- **File:** [`app/components/ClientInquiries.jsx`](./app/components/ClientInquiries.jsx) (Lines 197–236)
- **Smell Classification:** *Form Ambiguity*
- **Current Behavior:** Mandatory fields have `*`, but optional fields ("Phone / WhatsApp", "Project Location") have no indication.
- **UX Impact:** Users must stop and decipher which fields can be skipped, increasing form hesitation and abandonment.
- **Recommended Change:** Explicitly add `(Optional)` to non-mandatory field labels.

### 3.4 Inappropriate "Settings" Icon on Team Profile Card
- **File:** [`app/components/Team.jsx`](./app/components/Team.jsx) (Lines 105–107)
- **Current Behavior:** Card contains an SVG cog/gear with `aria-label="Settings"`.
- **UX Impact:** Bizarre affordance on a professional architectural profile; confuses screen readers.
- **Recommended Change:** Replace the gear icon with an architectural platform link (e.g., Behance, Instagram, or ArchDaily) and update `aria-label` accordingly.

### 3.5 Prefers-Reduced-Motion Compliance
- **File:** [`app/components/Preloader.jsx`](./app/components/Preloader.jsx)
- **Current Behavior:** The split-curtain animation executes unconditionally for 2 seconds on every session.
- **UX Impact:** Can trigger vestibular discomfort for users who have requested reduced motion in their OS settings.
- **Recommended Change:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')` to instantly bypass or shorten curtain transitions.

---

## 4. User Flow & Conversion Wayfinding

### 4.1 Broken Navigation Anchor for "Process"
- **File:** [`app/components/Navbar.jsx`](./app/components/Navbar.jsx) (Line 228) & [`app/components/Process.jsx`](./app/components/Process.jsx) (Line 80)
- **Smell Classification:** *`mystery-navigation`*
- **Current Behavior:** Navbar menu link labeled **"Process"** navigates to `#team` because `<section className="process">` has no `id` attribute.
- **UX Impact:** Users seeking the 4-step architectural methodology land unexpectedly on team portraits.
- **Recommended Change:** Add `id="process"` to `<section className="process">` and update the navbar link from `href="#team"` to `href="#process"`.

### 4.2 Broken "Learn More" Link in Services Header
- **File:** [`app/components/Services.jsx`](./app/components/Services.jsx) (Line 104)
- **Current Behavior:** The button `<a href="#process">Learn more</a>` in the Services section header does nothing because `#process` is missing in the DOM.
- **UX Impact:** Broken navigational affordance.
- **Recommended Change:** Resolves automatically once `id="process"` is assigned to the Process section.

### 4.3 Dead-End Anchors (`href="#"`) Across Components
- **Files:**
  - [`app/components/Insights.jsx`](./app/components/Insights.jsx) (Lines 71, 88): "See Insights" and article cards
  - [`app/components/Team.jsx`](./app/components/Team.jsx) (Line 84): "ALL MEMBERS"
  - [`app/components/Philosophy.jsx`](./app/components/Philosophy.jsx) (Line 225): Project card diagonal arrow buttons
- **Smell Classification:** *`click-cemetery` & `dead-end-states`*
- **Current Behavior:** Clicking these interactive elements abruptly scrolls the browser to the top of the page without opening content.
- **UX Impact:** Frustrates exploratory users who expect case studies or articles.
- **Recommended Change:** Connect them to actual functional drawers/modals, or direct them down to `#inquire` with pre-filled parameters.

### 4.4 Absence of Primary Inquire CTA in Desktop Navbar
- **File:** [`app/components/Navbar.jsx`](./app/components/Navbar.jsx)
- **Current Behavior:** The top navbar only has text links and the language switcher; it lacks a dedicated conversion button.
- **UX Impact:** The primary commercial conversion goal (Private Client Inquiries) is missing from the persistent top-level navigation.
- **Recommended Change:** Add a high-contrast pill CTA button (e.g., *"Inquire"* or *"Commission"*) linking directly to `#inquire`.

### 4.5 Newsletter Submission Lacks Feedback State
- **File:** [`app/components/Footer.jsx`](./app/components/Footer.jsx) (Lines 55–69)
- **Smell Classification:** *`silent-errors`*
- **Current Behavior:** Submitting an email runs `e.preventDefault()` with no response; the user receives zero confirmation.
- **UX Impact:** Users wonder if their submission went through.
- **Recommended Change:** Add local component state to display a brief confirmation message (e.g., *"Thank you for subscribing"*).

---

## 5. Priority Action Roadmap & Implementation Status

| Priority | Category | Task | Impact | Status |
|:---|:---|:---|:---|:---|
| **P0 (Critical)** | Navigation | Fix broken `#process` ID in `Process.jsx` and link in `Navbar.jsx` & `Services.jsx` | Restores core site navigation | **✓ Resolved** |
| **P0 (Critical)** | Accessibility | Increase `.testimonials__dot` touch target to 44 × 44px | Eliminates mobile tap failures | **✓ Resolved** |
| **P1 (High)** | Conversion | Add "Inquire" pill button to Navbar pointing to `#inquire` | Drives lead generation | **✓ Resolved** |
| **P1 (High)** | Accessibility | Boost `.footer__terms` / `.footer__copy` text contrast to `#a1a1aa` | Achieves WCAG 2.1 AA compliance | **✓ Resolved** |
| **P1 (High)** | Content | Fix cutoff team heading and remove gear "Settings" icon | Eliminates amateur interface smells | **✓ Resolved** |
| **P2 (Medium)** | Polish | Replace empty `href="#"` links with functional modals or inquiry links | Eliminates dead-end user loops | **✓ Resolved** |
| **P2 (Medium)** | Architecture | Replace `SkillBars` percentages with curated capability tags | Aligns with luxury atelier standard | **✓ Resolved** |
| **P2 (Medium)** | Feedback | Add success state to Footer newsletter subscription form | Eliminates silent form submission | **✓ Resolved** |

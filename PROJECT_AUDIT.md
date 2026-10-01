# Project Audit & Technical Specification
## Syed Raza Jan (SRJ Studio) — Architectural Portfolio

---

## 1. Executive Summary

| Attribute | Details |
| :--- | :--- |
| **Project Name** | SRJ Studio — Architectural Portfolio & 3D Visualization Atelier |
| **Client / Subject** | **Ar. Syed Raza Jan** (Registered Architect PCATP, Interior Designer, 3D Artist) |
| **Location & Reach** | Islamabad, Pakistan & Global Commissions (UAE, Guyana, International) |
| **Project Type** | Single-Page Application (SPA) Architectural Portfolio & Agency Showcase |
| **Framework** | Next.js 14 (App Router) + React 18 |
| **Styling Paradigm** | Custom Luxury CSS Design System (Archidex / Atelier Aesthetic, ~2,500 lines) |
| **Animation Stack** | GSAP 3 (GreenSock) + ScrollTrigger plugin |
| **Current Status** | Fully structured frontend, interactive animations active, ready for local execution |

### What this project is about:
This project is a **high-end, editorial digital portfolio and brand presence for Syed Raza Jan (SRJ Studio)**, an Islamabad-based architect and 3D visualization specialist with over 9 years of professional practice. 

The website is styled after world-class architectural atelier websites (such as Archidex / Awwwards-honored architecture portfolios). It portrays the firm's balance between design conceptualization, photorealistic rendering, and turnkey project delivery for luxury residential villas, commercial structures, and interior spaces.

---

## 2. What the Project Does (Feature & Section Breakdown)

The application functions as an immersive, narrative-driven single-page portfolio with sequential scroll-triggered reveals and micro-interactions:

```
[ Preloader (Curtain Reveal + 0-100% Counter) ]
                      │
                      ▼
[ Floating Atmospheric Glow Elements + Custom Cursor ]
                      │
                      ▼
[ Sticky Minimalist Navbar with 2-Row Layout & Mobile Drawer ]
                      │
                      ▼
[ Monumental Hero Section with Parallax Architectural Imagery ]
                      │
                      ▼
[ Philosophy & Statement (Word-by-word Scroll Scrubbing) ]
                      │
                      ▼
[ Horizontal Architectural Works Showcase & Spec Matrix ]
                      │
                      ▼
[ Inverted Dark "Our Services" Matrix with Hover Render Capsules ]
                      │
                      ▼
[ Interactive Client Testimonials Carousel with Portrait Reveal ]
                      │
                      ▼
[ Infinite Looping Partner & Publication Marquee ]
                      │
                      ▼
[ Animated Numeric Impact Statistics (Years, Projects, Clients) ]
                      │
                      ▼
[ Atelier Team & Leadership Roster ]
                      │
                      ▼
[ 4-Stage Architectural Process & Software Proficiency Meters ]
                      │
                      ▼
[ Architectural Insights & Editorial Publications ]
                      │
                      ▼
[ Colophon, WhatsApp Direct, Newsletter & Luxury Footer ]
```

### Detailed Component Specifications

#### 1. Preloader (`app/components/Preloader.jsx`)
- **Visuals**: Full-screen split curtain with a center 0–100% numeric counter and SRJ Studio title.
- **Mechanism**: GSAP timeline counts up in 1.1s, fades text out, unlocks pointer events, and parts the left and right curtains (`xPercent: -100%` and `100%`).
- **Optimization**: Calls `ScrollTrigger.refresh()` upon completion to ensure all trigger offsets calculate accurately.

#### 2. Custom Cursor (`app/components/CustomCursor.jsx`)
- **Visuals**: A smooth, fluid follower circle following cursor movement with easing interpolation.
- **Features**: Automatically expands and glows (`is-hovered`) when hovering over interactive cards, buttons, links, and pagination dots.
- **Resilience**: Automatically hides itself on touch/mobile devices (`pointer: coarse`).

#### 3. Navbar (`app/components/Navbar.jsx`)
- **Layout**: Sleek, horizontally aligned navigation menu with compact max-width (1080px) and balanced spacing.
- **Interactions**: Adds a blurred glassmorphism backdrop on scroll (`>40px`).
- **Language Switcher**: Interactive multi-language translation dropdown supporting English (EN), Urdu (UR), Arabic (AR), French (FR), Spanish (ES), and German (DE). Integrates automatic translation, cookie persistence, and full RTL layout mirroring for Urdu & Arabic.
- **Mobile Mode**: Full-screen hamburger menu overlay with locked background scrolling, quick language switch grid, and direct WhatsApp inquiry button.

#### 4. Hero Section (`app/components/Hero.jsx`)
- **Typography**: Dual-font typography combining sans-serif modernist caps with italic serif ("*Dream Spaces* + Modern Living Homes").
- **Animations**: Staggered bottom-to-top clip-path reveal of heading lines.
- **Imagery**: Full-bleed architectural panoramic photograph with GSAP scroll parallax scrubbing.

#### 5. Philosophy & Architectural Works (`app/components/Philosophy.jsx`)
- **Word-by-word Text Reveal**: Uses GSAP ScrollTrigger scrubbing to fade words from 15% opacity to 100% as the user scrolls down.
- **Work Showcase Carousel**: Horizontal cards featuring residential and interior projects (e.g., *Modern Escape Villa*, *Travertine Timber Atelier*, *Cantilever Concrete Villa*).
- **Spec Overlays**: Interactive card hovers displaying starting price ranges, bedrooms, bathrooms, and total square footage.

#### 6. Inverted Dark Services Matrix (`app/components/Services.jsx`)
- **Themes**: High-contrast obsidian dark section (`#111111`) contrasting with light sections.
- **Entries**: Covers *Architectural Design & Planning*, *Interior Design & Styling*, *3D Visualization & Rendering*, and *Turnkey Execution & Co-Ordination*.
- **Visual Element**: Floating rounded capsule images alongside each service row.

#### 7. Client Testimonials (`app/components/Testimonials.jsx`)
- **Layout**: Split layout with oversized quote marks, testimonial block, and client portrait reveal on the right.
- **Interactivity**: Tabbed dot navigation to transition between commercial clients, luxury villa owners, and engineering partners.
- **Background**: Massive low-opacity "CLIENTS REVIEWS" typography baseline.

#### 8. Partners Marquee (`app/components/Partners.jsx`)
- **Mechanism**: Seamless CSS-powered infinite looping marquee displaying industry partners, publications, and collaborative entities.

#### 9. Animated Statistics (`app/components/Stats.jsx`)
- **Trigger**: Triggers numeric count-up animations on viewport entry via GSAP:
  - **9+** Years Experience
  - **150+** Projects Completed
  - **50+** Happy Clients
  - **4** Countries Served

#### 10. Atelier Team (`app/components/Team.jsx`)
- **Personnel**: Displays key practice roles: Lead Architect (Syed Raza Jan), Interior Designer (Ali Hassan), and 3D Visualization (Sara Ahmed) with social media links.

#### 11. Process & Software Proficiency (`app/components/Process.jsx` & `SkillBars.jsx`)
- **Interactive Step Accordion**: 4-stage methodology (*Architectural Design*, *Concept & Planning*, *Visualization & Presentation*, *Execution & Delivery*).
- **Software Proficiency Gauges**: Dynamic animated progress bars illustrating core technical software mastery:
  - 3ds Max + Corona Renderer (99%)
  - Lumion (96%)
  - Adobe Photoshop (75%)
  - SketchUp (70%)
  - AutoCAD (70%)

#### 12. Architectural Insights & Editorial (`app/components/Insights.jsx`)
- **Design**: Editorial magazine grid showcasing thought leadership articles on urbanism, material sustainability, and site analysis.

#### 13. Colophon & Footer (`app/components/Footer.jsx`)
- **Direct Connect**: Direct phone dialing (+92 346 5564074), direct email link (`arrazajan@gmail.com`), and direct WhatsApp API gateway.
- **Newsletter**: Interactive newsletter submission input.
- **Navigation**: Quick jump links and copyright colophon.

---

## 3. Technology Stack & Technical Architecture

```
                    ┌───────────────────────────────┐
                    │    Next.js 14 (App Router)    │
                    │   React 18 Server & Client    │
                    └───────────────┬───────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   GSAP 3 Engine  │      │  Custom CSS Sys  │      │   Google Fonts   │
│  • ScrollTrigger │      │  • globals.css   │      │  • DM Serif Disp │
│  • Timelines     │      │  • Design Tokens │      │  • DM Sans       │
│  • Clip Paths    │      │  • Dark/Light Sys│      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

| Layer | Implementation | Notes |
| :--- | :--- | :--- |
| **Core Framework** | Next.js `14.2.35` (Node / React `^18`) | Uses App Router (`app/layout.js`, `app/page.js`) |
| **Animations** | `gsap` `^3.15.0` + `gsap/ScrollTrigger` | Context-managed GSAP timelines with automatic cleanup (`ctx.revert()`) |
| **Typography** | `next/font/google` | `DM_Serif_Display` (headings) and `DM_Sans` (body) loaded with CSS variables |
| **Asset Directory** | `public/images/` | High-resolution architectural photography and renders |
| **CSS System** | `app/globals.css` (2,490 lines) | Hand-crafted design tokens, bespoke micro-animations, media queries |

---

## 4. Complete Directory & File Structure

```
raza-jan-website/
├── .git/                      # Git version control metadata
├── .gitignore                 # Standard Next.js gitignore
├── jsconfig.json              # Path aliases configuration (@/* -> ./*)
├── next.config.mjs            # Next.js configuration module
├── package.json               # Project manifest & dependencies
├── package-lock.json          # Dependency lockfile
├── README.md                  # Practice overview and quick start guide
├── public/
│   └── images/
│       ├── hero.jpg           # Panoramic architectural mountain villa render
│       ├── project-1.jpg      # Turnkey interior/facade project render
│       ├── project-facade.jpg # Cantilever brutalist facade render
│       ├── project-interior.jpg # Travertine & timber interior render
│       └── project-villa.jpg  # Modern escape landscape villa render
└── app/
    ├── favicon.ico            # Site favicon
    ├── globals.css            # Master design system & all component styling (50KB)
    ├── layout.js              # HTML root wrapper, Google Font loaders, SEO metadata
    ├── page.js                # Master client page assembling all 14 components
    ├── page.module.css        # (Unused default Next.js boilerplate)
    ├── fonts/
    │   ├── GeistMonoVF.woff   # (Unused default Next.js starter font)
    │   └── GeistVF.woff       # (Unused default Next.js starter font)
    └── components/
        ├── CustomCursor.jsx   # Magnetic follower cursor with hover expansion
        ├── Footer.jsx         # Contact matrix, newsletter, and colophon
        ├── Hero.jsx           # Main heading, CTA, and parallax banner image
        ├── Insights.jsx       # Architectural editorial and articles grid
        ├── Navbar.jsx         # Sticky navigation with mobile menu drawer
        ├── Partners.jsx       # Infinite horizontal brand & partner marquee
        ├── Philosophy.jsx     # Word-by-word reveal statement and project cards
        ├── Preloader.jsx      # Split curtain 0-100% loading sequence
        ├── Process.jsx        # Step-by-step project delivery accordion
        ├── ScrollToTop.jsx    # Back-to-top floating button
        ├── Services.jsx       # Dark themed service offerings with capsule previews
        ├── SkillBars.jsx      # Animated software competency gauge meters
        ├── SmoothScroll.jsx   # Anchor smooth scroll synchronization
        ├── Stats.jsx          # Animated numeric counters on scroll trigger
        ├── Team.jsx           # Atelier team profiles and social channels
        └── Testimonials.jsx   # Client quote carousel with image transitions
```

---

## 5. Technical Audit Findings & Recommendations

### A. Strengths
1. **High Visual Standard**: The design system delivers a luxury editorial look tailored to architecture (clean serif accents, precise letter-spacing, muted charcoal and warm bone tones).
2. **Animation Architecture**: Components properly isolate GSAP contexts with `gsap.context()` and clean up on unmount with `ctx.revert()`, preventing memory leaks and duplicate triggers.
3. **Responsive Execution**: Dedicated styles for desktop, tablet, and mobile devices, including mobile navigation drawers and responsive typography clamping.
4. **Touch Device Awareness**: The custom cursor gracefully turns off on touch screens to preserve native mobile UX.

---

### B. Opportunities for Optimization & Cleanup

| Item | Category | Observation | Recommended Action |
| :--- | :--- | :--- | :--- |
| **Unused Dependencies** | Dependencies | `@studio-freight/lenis` and `split-type` are present in `package.json` but not imported in components. | Either integrate Lenis into `SmoothScroll.jsx` for virtual momentum scrolling or remove from `package.json`. |
| **Unused Boilerplate Files** | File System | `app/page.module.css`, `app/fonts/GeistVF.woff`, and `app/fonts/GeistMonoVF.woff` are leftover starter files. | Safely delete these files to reduce repo size. |
| **Image Optimization** | Performance | Standard `<img>` tags are used instead of `next/image` (`<Image />`). | Convert to Next.js `<Image />` for automatic WebP/AVIF generation, blur placeholders, and lazy-loading optimizations. |
| **External Stock Images** | Content | `Team.jsx` and `Testimonials.jsx` use placeholder portraits from Unsplash URLs. | Replace with genuine portraits of Syed Raza Jan, studio collaborators, and real client projects. |
| **Forms & Actions** | Functionality | Newsletter input in `Footer.jsx` and article links in `Insights.jsx` have placeholder `#` hrefs. | Hook up the newsletter to a mailing list API (Resend, Mailchimp, or Formspree) and connect articles to dedicated routes or PDFs. |
| **Advanced SEO & OpenGraph** | SEO / Marketing | `layout.js` has basic titles and descriptions, but lacks Open Graph tags (`og:image`, `twitter:card`). | Add an `og:image` pointing to `public/images/hero.jpg` and structured schema (`JSON-LD` for an Architectural Firm). |

---

## 6. How to Run & Develop This Project

### 1. Prerequisites
Ensure **Node.js** (v18.17.0 or higher) and **npm** are installed.

### 2. Installation
Open a terminal in the project directory:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Visit **`http://localhost:3000`** in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
This tests for syntax, build errors, and pre-renders static assets.

---

## 7. Summary Verdict
The project is a **well-crafted, visually striking architectural atelier website**. Its layout, typography, animations, and narrative structure are tailored specifically to showcase architectural design, interior styling, and 3D visualization services. With minor cleanups (asset optimization and connecting real contact/newsletter endpoints), it is ready for deployment.

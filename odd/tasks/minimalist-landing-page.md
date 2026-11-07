# Feature: Minimalist Landing Page

## Objective
Create an ultra-minimalist, zero-scroll landing page that communicates the core philosophy of ChatPDF (zero login, zero config, zero personal data required, immediate study and research on uploaded PDFs) with the existing visual style and a prominent "Subir PDF" button linking to the chat view.

## Problem & Value
Users previously landed directly on the raw upload dropzone without context about what the platform offers, its privacy philosophy, or its zero-friction premise. The new landing page clearly introduces the tool's purpose and simplicity while maintaining a distraction-free, elegant aesthetic.

## Scope & Constraints
- Keep page strictly fitted to screen (`min-h-screen`, `h-screen`, minimal to no scrolling required).
- Adhere to the existing design system (Astro, Tailwind CSS, subtle grid background, cyan/blue radial gradient glow).
- Implement a dedicated `/chat` view for the existing upload and chat application.
- Prominent CTA button with text "Subir PDF" directing to `/chat`.
- Copy in clear, professional Spanish explaining the frictionless experience.

## Delivery Strategy
- Strategy: `single-pr`
- Forecasted changed lines: ~150 lines

## Tasks

- [ ] **TASK-01: Establish `/chat` route for the chat & upload application**
  - **Route:** direct inline
  - **Allowed edit surfaces:** `src/pages/chat.astro`, `src/components/Welcome.astro`
  - **Acceptance Criteria:** Navigating to `/chat` renders the PDF upload and chat workflow seamlessly, with a subtle return link to home.
  - **Verification:** `npm run build` succeeds and `/chat` entrypoint is emitted.

- [ ] **TASK-02: Design and implement the minimalist landing page on `/`**
  - **Route:** direct inline
  - **Allowed edit surfaces:** `src/pages/index.astro`, `src/components/LandingHero.astro`
  - **Acceptance Criteria:** `index.astro` renders a single-viewport minimalist landing page with hero headline, value pillars (no login, no config, no personal data), and the "Subir PDF" CTA leading to `/chat`.
  - **Verification:** `npm run build` succeeds; structural verification of viewport fitting classes and button href.

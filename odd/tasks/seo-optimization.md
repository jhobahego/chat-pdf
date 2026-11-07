# Feature: SEO Optimization for ChatPDF

## Objective
Implement comprehensive technical, on-page, and structured data SEO for ChatPDF targeting production URL `https://jhobadev-chatpdf.netlify.app/`.

## Problem & Value
Search engines and social sharing platforms require proper metadata, canonical URLs, language declarations, Open Graph / Twitter Card protocols, sitemaps, robots.txt, and structured data (JSON-LD) to crawl, index, understand, and richly present the application.

## Scope & Constraints
- Production URL: `https://jhobadev-chatpdf.netlify.app/`
- Configure `site` in `astro.config.mjs`
- Enhance `src/layouts/Layout.astro` with dynamic SEO props (title, description, canonical, og, twitter, JSON-LD)
- Correct `<html lang="es">`
- Add `public/robots.txt` and `public/sitemap.xml`
- Generate high-quality 1200x630 `public/og-image.png`
- Provide specific metadata for `/` and `/chat`

## Delivery Strategy
- Strategy: `single-pr`
- Forecasted changed lines: ~180 lines

## Tasks

- [x] **TASK-01: Technical SEO foundation (`astro.config.mjs`, `robots.txt`, `sitemap.xml`, `og-image.png`)**
  - **Route:** direct inline
  - **Allowed edit surfaces:** `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`, `public/og-image.png`
  - **Acceptance Criteria:** `site` configured, crawler instructions in `robots.txt` disallowing `/api/`, `sitemap.xml` listing canonical pages, and social card image available.
  - **Verification:** Files exist and are properly formatted.
  - **Evidence:** Commit `0358873`

- [x] **TASK-02: Metadata, Open Graph, Twitter Cards, and Schema.org JSON-LD in `Layout.astro` and pages**
  - **Route:** direct inline
  - **Allowed edit surfaces:** `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/chat.astro`, `.gitignore`
  - **Acceptance Criteria:** Proper meta tags, canonical links, social preview cards, and WebApplication JSON-LD schema rendered on both pages.
  - **Verification:** `npm run build` succeeds and emitted HTML contains valid SEO tags.
  - **Evidence:** Commit pending

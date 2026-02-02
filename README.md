# Hot Lava Agency — Website

This repository contains the official Hot Lava Agency website.

The project is built with **Astro** and uses **Sanity** as a headless CMS, following a build-time content strategy and a fully automated deployment pipeline.

---

## Core Principles

* **Build-time only** content consumption (no runtime CMS dependency)
* **CMS-driven editorial content**, code-driven infrastructure
* **Global content lives in a singleton (`siteSettings`)**
* **Each section owns its own content domain**
* **Publish in Sanity = Production update**

The CMS scope is intentionally limited to prevent SEO, performance, or infrastructure regressions.

---

## Tech Stack

* **Framework:** Astro
* **CMS:** Sanity (headless)
* **Hosting:** SiteGround (static)
* **Automation:** GitHub Actions
* **Content delivery:** Sanity CDN (assets)

---

## Project Structure (High Level)

```
/
├── docs/              # Architecture & decision documentation
├── src/               # Astro source code
├── public/            # Static assets
├── sanity/            # Sanity Studio & schemas
├── README.md
└── package.json
```

---

## CMS Overview

Sanity is used **only for editorial and brand content**.

### Global Content

Global, shared content lives in the `siteSettings` singleton:

* Site title and tagline
* Global SEO (meta title & description)
* Footer title
* Contact information
* Social links

### Section Content

Each section (Intro, About, Work, Products, Team, etc.) owns its own schema and title.

Titles are **not centralized**.

---

## SEO Strategy (Summary)

* Global SEO values are editable via CMS
* Canonical logic, Open Graph configuration, robots directives, and structured data remain in code
* Layout components never construct SEO content — they only render provided values

---

## Deployment Flow

Publishing content in Sanity automatically triggers a production deployment.

High-level flow:

```
Sanity Publish → Webhook → CI Build → Deploy
```

No manual steps are required.

---

## Documentation

Detailed architecture and decision documentation lives in `/docs`:

* `architecture-overview.md`
* `cms-architecture.md`  
* `deployment-flow.md`
* `decisions.md`

These documents explain **why** the system is built this way.
These documents define architectural rules and guardrails.
Changes to CMS scope or SEO behavior should be reflected there.

---

## Notes

Due to hosting-level dynamic caching, HTML updates may require manual cache invalidation in SiteGround to become immediately visible.

Infrastructure-level files (e.g. `llm.txt`, `robots.txt`) are intentionally **not managed via CMS** and are versioned in code.

---

## License

Private project — all rights reserved.

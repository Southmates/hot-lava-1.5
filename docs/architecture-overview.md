# Architecture Overview

This document provides a high-level view of how the main systems in this project are connected.

Detailed behavior, decisions, and implementation details are documented elsewhere.

---

## System Map

Sanity (CMS + Asset CDN)
↓
Sanity Webhook
↓
Cloudflare Worker
↓
GitHub Actions
↓
Astro Build
↓
SiteGround


---

## Component Roles

### Sanity
- Content authoring and asset storage.
- Emits events when content changes.

### Cloudflare Worker
- Receives CMS events.
- Triggers the CI pipeline.

### GitHub Actions
- Builds the site.
- Deploys static output.

### Hosting
- Serves the built site.

---

## Scope of This Document

This file intentionally does not describe:
- CMS modeling rules
- deployment mechanics
- cache behavior
- architectural decisions

Those topics are covered in:
- `cms-architecture.md`
- `deployment-flow.md`
- `decisions.md`

---

## Purpose

This overview exists to:
- give quick system orientation
- help new developers understand data flow
- avoid duplication across documentation

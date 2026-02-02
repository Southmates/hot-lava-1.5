# CMS Architecture

This project uses Sanity as a headless CMS for content and media management.

Sanity is responsible only for content creation, editing, and asset storage.  
It does not manage deployment, hosting, or build processes.

---

## Dataset Usage

- Only the `production` dataset is used.
- All published content lives in `production`.
- Sanity webhooks listen exclusively to this dataset.
- Draft content does not trigger deployments.

--- 

## Asset Handling

- All images and videos are uploaded to Sanity.
- Assets are served directly from Sanity’s CDN.
- The frontend does not serve or proxy media assets.

### Asset Updates

- Assets must not be replaced in place.
- When an image or video needs to be updated, a new asset must be uploaded.
- Uploading a new asset generates a new CDN URL.

This behavior is relied upon to ensure predictable cache behavior.

---

## Webhooks

- Sanity emits webhook events on:
  - document creation
  - document updates
  - document deletion
- Webhooks are triggered only for the `production` dataset.
- Webhooks do not contain secrets or deployment logic.

Their sole purpose is to signal that content has changed.

---

## CMS Boundaries

Sanity is intentionally unaware of:
- source control
- CI/CD pipelines
- hosting environments
- cache management

All infrastructure orchestration happens outside the CMS.

---

## Editorial Impact

- Editors publish content without interacting with Git or hosting.
- Publishing content triggers an automated deployment.
- No manual cache clearing is required at the CMS level.

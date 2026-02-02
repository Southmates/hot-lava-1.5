# Deployment Flow (Infrastructure Level)

This project uses a fully automated, event-driven deployment pipeline designed to decouple the CMS from the build and hosting infrastructure.

## High-Level Architecture

Sanity (production dataset)  
→ Sanity Webhook  
→ Cloudflare Worker (deployment middleware)  
→ GitHub Actions (`workflow_dispatch`)  
→ Astro static build  
→ rsync  
→ SiteGround (production)

## Hosting Cache Behavior

The hosting environment uses full-page dynamic caching that cannot be disabled.

As a result:
- New HTML builds are deployed correctly.
- Updated content may not become immediately visible until the dynamic cache is cleared.

After publishing content in Sanity, the dynamic cache must be manually cleared in SiteGround for changes to appear instantly.

This limitation is specific to the hosting layer and does not affect the deployment pipeline itself.


## Component Responsibilities

### Sanity
- Single source of truth for content.
- Triggers deployment events on content create, update, or delete.
- Assets (images and videos) are delivered via Sanity’s CDN and treated as immutable.

### Sanity Webhook
- Emits POST requests on content lifecycle events.
- Sends the full document payload without transformation.
- Contains no credentials or deployment logic.

### Cloudflare Worker (Middleware)
The Cloudflare Worker acts as a controlled intermediary between Sanity and GitHub Actions.

It exists for the following reasons:

- **Protocol compatibility**  
  Sanity webhooks cannot shape request bodies to match GitHub’s `workflow_dispatch` requirements (`{ ref: "main" }`).  
  The Worker normalizes the request and issues a valid dispatch call.

- **Security isolation**  
  GitHub tokens are stored as secrets in Cloudflare, never in Sanity or client-editable configuration.

- **Decoupling**  
  The CMS is not aware of GitHub, workflows, branches, or build tooling.  
  Deployment logic can evolve independently without touching Sanity.

- **Operational reliability**  
  The Worker ensures required headers (e.g. `User-Agent`) and request structure are always present, preventing silent API failures.

- **Future extensibility**  
  Rate limiting, environment routing, conditional deploys, or notifications can be added without changing the CMS or CI pipeline.

### GitHub Actions
- Receives deployment triggers via `workflow_dispatch`.
- Installs dependencies and builds the Astro site.
- Deploys static output to SiteGround via rsync.

### Astro
- Performs a static build at deploy time.
- Consumes content from Sanity.
- Does not manage cache invalidation for external CDN assets.

### SiteGround
- Hosts the static production site.
- Serves HTML with dynamic cache.
- Relies on CDN-level asset versioning for cache consistency.

## Deployment Characteristics

- Deployments are fully automated and event-driven.
- No manual cache purging is required.
- Content updates propagate without developer intervention.
- The client never interacts with source control or infrastructure.

## Asset Versioning Strategy

- Images and videos are served from Sanity’s CDN.
- Assets are treated as immutable.
- Updating an asset requires uploading a new file, generating a new CDN URL.
- Cache invalidation relies on URL versioning rather than purge operations.

## Design Rationale Summary

This architecture prioritizes:

- Clear separation of concerns
- Minimal trust surface between systems
- Predictable cache behavior
- Low operational overhead
- Long-term maintainability

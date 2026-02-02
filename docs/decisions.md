# Architectural Decisions

This document records the concrete architectural decisions taken during the implementation of the CMS-driven deployment pipeline.

Only decisions that were actually implemented in production are documented here.

---

## 1. Sanity Does Not Trigger GitHub Actions Directly

**Decision**  
Sanity webhooks do not call GitHub APIs directly.

**Reason**
- Sanity webhooks cannot control or normalize request bodies.
- GitHub’s `workflow_dispatch` endpoint requires a strict payload structure.
- Direct calls resulted in repeated `401`, `422`, and validation errors.

**Outcome**
- Direct Sanity → GitHub integration was abandoned.

---

## 2. Introduce a Middleware Layer

**Decision**  
A Cloudflare Worker is used as a middleware between Sanity and GitHub Actions.

**Reason**
- To transform Sanity webhook requests into valid GitHub API calls.
- To inject required headers (`User-Agent`) enforced by GitHub.
- To store GitHub credentials outside the CMS.

**Outcome**
- The Worker issues a valid `workflow_dispatch` request with `{ ref: "main" }`.
- Authentication and request validation are handled reliably.
- Sanity remains unaware of GitHub, repositories, or workflows.

---

## 3. Use `workflow_dispatch` to Trigger Deployments

**Decision**  
Deployments are triggered via GitHub Actions’ `workflow_dispatch` endpoint.

**Reason**
- Deployments must occur on content changes, not only on code pushes.
- `workflow_dispatch` allows external systems to trigger builds deterministically.

**Outcome**
- Deployments can be triggered by:
  - Sanity content changes
  - manual runs
  - code pushes (separately)

---

## 4. Assets Are Treated as Immutable

**Decision**  
Images and videos uploaded to Sanity are treated as immutable.

**Reason**
- Replacing assets in place caused delayed updates due to CDN and browser caching.
- Uploading a new asset generates a new CDN URL immediately.

**Outcome**
- Assets are never replaced.
- Updating media requires uploading a new file.
- Cache invalidation relies on URL changes, not purge operations.

---

## 5. Cache Purge Is Not Used

**Decision**  
No manual or API-based cache purge is used.

**Reason**
- Cache purging proved unreliable and non-deterministic.
- Multiple cache layers exist (CDN, hosting, browser).
- URL-based versioning produces consistent results.

**Outcome**
- Aggressive caching remains enabled.
- Cache behavior is predictable through asset immutability.

---

## 6. CMS Users Do Not Interact with Infrastructure

**Decision**  
Editors interact only with Sanity.

**Reason**
- Editors should not manage builds, hosting, or caches.
- Publishing content should be sufficient to update production.

**Outcome**
- Content publishing triggers automated deployment.
- No infrastructure access is required for CMS users.

## 7. Accept Hosting-Level Dynamic Cache Constraints

**Decision**  
The hosting-level dynamic cache is kept enabled, and manual cache invalidation is required after content updates.

**Reason**
- The hosting plan does not allow disabling full-page dynamic caching.
- Automated cache purge is not available without additional infrastructure or cost.
- Manual cache clearing is the most economical and reliable option.

**Outcome**
- Content deployments are successful immediately.
- Visibility of HTML updates depends on manual cache invalidation.
- This behavior is documented and communicated to the client.

**Trade-off**
- Immediate content visibility is not guaranteed without manual action.

---

## Summary

All decisions documented here were driven by concrete integration constraints and observed runtime behavior.

The resulting system favors:
- simple interfaces between components
- deterministic deployment behavior
- minimal operational risk

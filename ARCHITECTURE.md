# Architecture

## Goals

POF Rental is a content-first luxury rental experience. The engineering priorities are fast first paint, resilient contact conversion, progressive motion, accessible interaction, and low operational complexity.

## Runtime boundaries

- Next.js App Router renders content, metadata, structured data, sitemap, and robots rules on the server.
- `LandingPage` remains a server component so the primary experience ships as HTML.
- `ConciergeBuilder` and `FloatingConcierge` are client components because they own interactive state.
- The enquiry API validates an untrusted JSON boundary with a shared Zod schema and returns a WhatsApp URL. It stores and forwards no customer data.
- The motion layer is progressive enhancement. Navigation, content, forms, and direct contact links work independently of animation.

## Quality strategy

The repository uses three complementary checks:

1. Node tests protect domain validation and URL construction.
2. Playwright tests protect desktop/mobile journeys, keyboard dialog behavior, browser errors, and semantic landmarks.
3. A media budget prevents accidental performance regressions from oversized assets.

Every pull request runs the production build and both test layers in GitHub Actions.

## Deliberate tradeoffs

The cinematic motion script is retained while its behavior is covered by browser tests. Replacing it all at once would create significant visual-regression risk for limited user benefit. New stateful behavior should be implemented as React components or hooks; existing motion should be migrated incrementally behind the browser tests.

The enquiry endpoint does not use a database. Its only responsibility is validating a brief and preparing an encoded handoff. Adding persistence would increase privacy and operational obligations without supporting the current product requirement.

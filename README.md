# POF Rental

Production Next.js website for POF Rental, a Dubai luxury-car rental concierge. The interface combines server-rendered content with an enquiry builder, accessible digital concierge, responsive media, and progressive motion effects.

## Requirements

- Node.js 22 LTS
- npm 10 or newer

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm test
npm run build
npm run check
```

`npm run check` is the required pre-push check and is also executed by GitHub Actions.
It includes a media-size budget so oversized hero and feature videos cannot be added accidentally.

## Architecture

- `app/` - Next.js App Router pages, metadata, sitemap, robots, and API routes
- `components/` - server and client React components
- `lib/site-data.js` - fleet, plans, FAQs, and contact content
- `lib/enquiry.mjs` - validated enquiry parsing and WhatsApp URL generation
- `media/` - source images and videos copied into `public/` at build time
- `app.js` - progressive motion layer for the server-rendered interface
- `final.css` - production visual system and responsive styling
- `tests/` - dependency-free Node.js regression tests

The animation layer is progressive enhancement: essential navigation, content, contact links, and enquiry functionality remain available without it. Reduced-motion preferences are respected.

## Updating content

Edit `lib/site-data.js` for fleet entries, pricing, plans, FAQs, and WhatsApp messages. Keep images in WebP where possible and provide descriptive `alt` text in `components/LandingPage.jsx`.

For video assets:

- Keep the hero video as small as practical, ideally below 6 MB.
- Use WebM for modern browsers and a poster image for first paint.
- Keep below-the-fold videos at `preload="none"`.
- Verify playback on Safari and a throttled mobile connection.

## Enquiry API

`POST /api/enquiry` accepts JSON containing `vehicle`, `duration`, `delivery`, optional `date`, and optional `note`. Input is normalized, length-limited, and enum-validated. The endpoint does not store enquiry data; it returns an encoded WhatsApp URL.

## Deployment

The project uses standard Next.js commands and deploys directly on Vercel or any Node.js platform supporting `next start`. No environment variables are currently required. Production canonical URLs are configured in `app/layout.jsx`, `app/robots.js`, and `app/sitemap.js`.

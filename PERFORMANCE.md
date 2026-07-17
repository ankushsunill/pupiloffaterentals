# Performance budgets

## Current controls

- Primary page JavaScript is tracked in every production build.
- Images use `next/image` with responsive `sizes` values.
- Below-the-fold videos use `preload="none"` and play only near the viewport.
- Videos pause after leaving the viewport.
- Reduced-motion visitors do not receive smooth scrolling, parallax, tilt, custom cursor, or autoplay behavior.
- `npm run check:media` enforces per-video and total media budgets.

## Budgets

| Area | Budget |
| --- | ---: |
| Total source media | 55 MB |
| Hero video | 15 MB |
| Purosangue feature video | 7 MB |
| Porsche feature video | 10 MB |
| Largest Contentful Paint | < 2.5 s at p75 |
| Cumulative Layout Shift | < 0.1 at p75 |
| Interaction to Next Paint | < 200 ms at p75 |

Core Web Vitals targets are production goals and should be measured with real-user data before being presented as achieved results.

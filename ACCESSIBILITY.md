# Accessibility

The target is WCAG 2.2 AA for all essential browsing and enquiry journeys.

## Implemented

- Semantic navigation, main, section, dialog, form, and footer landmarks
- Descriptive labels for form controls and interactive buttons
- Keyboard-operable navigation, FAQs, galleries, enquiry form, and concierge
- Modal focus entry, focus containment, Escape dismissal, and focus restoration
- Live status announcements for enquiry preparation and concierge messages
- Reduced-motion behavior for animation and autoplay
- Descriptive image alternatives and decorative media treatment

## Verification

Playwright checks essential landmarks, image alternatives, keyboard dialog behavior, and both desktop and mobile flows. Before a major release, manually verify keyboard traversal, 200% zoom, Windows High Contrast Mode, VoiceOver or NVDA announcements, and representative touch devices.

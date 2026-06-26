# Product

## Register

product

## Users
- **Students**: University students (local and international) searching for safe, affordable, and well-located housing in Cusco, Peru. They need to browse listings, filter options, connect with roommates, request reservations, upload documents, and communicate with landlords.
- **Landlords (Arrendadores)**: Local property owners renting rooms or apartments. They need to list accommodations, manage bookings, verify student documents, and communicate with prospective renters. They require straightforward, easy-to-use interfaces, as some may not be highly tech-savvy.
- **Administrators**: University or system admins who monitor bookings, approve/suspend users, moderate listings, and view system analytics.

## Product Purpose
UniStay (Cusco Rent) is a secure, accessible web portal designed to streamline student housing rentals in Cusco. By providing direct, verified connections between students and landlords, it aims to eliminate housing insecurity and booking fraud while ensuring both parties have a clear, documented rental process.

## Brand Personality
- **Trustworthy**: Secure, transparent, and direct.
- **Accessible**: Easy to read and navigate for all users, including non-technical landlords or users with visual or physical impairments.
- **Clarity-Driven**: Clean layout, clear copy, and functional design that prioritized utility over decorative excess.

## Anti-references
- **Over-designed AI/SaaS Templates**: Interfaces using ultra-low contrast light gray text, nested cards, massive headers, and tiny typography.
- **Hidden Controls**: Actions hidden behind obscure hover states or multi-level menus.
- **Keyboard Traps**: Modals or dropdowns that trap focus or cannot be dismissed with standard keyboard shortcuts.

## Design Principles
1. **Clarity Over Decoration**: Avoid unnecessary visual clutter. The user's focus should be directly on property details, pricing, booking status, and chat messages.
2. **Predictable & Native Controls**: Use semantic HTML elements (buttons, inputs, links) that function exactly as expected. Let accessibility APIs naturally interpret the layout.
3. **Continuous Reassurance**: Provide clear status indicators, error state guidance, and successful action feedback (toasts, alerts) to reduce anxiety around booking transactions.

## Accessibility & Inclusion
- **Target Compliance**: WCAG 2.2 Level AA.
- **Keyboard Navigation**: Full focusability of all interactive controls with high-contrast `:focus-visible` outlines. Modals and dropdowns must be keyboard-dismissible.
- **Screen Reader Support**: Semantic HTML structure (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`) with descriptive `aria-label` tags for icon buttons and dynamic status fields.
- **Color Contrast**: Rigid compliance with the 4.5:1 contrast ratio for body copy and 3:1 for large text or interactive states.

---
name: UniStay (Cusco Rent)
description: Simple, clean, and trustworthy housing booking portal for students and landlords.
colors:
  primary: "#895100"
  primary-dark: "#6a3d00"
  terracotta: "#b85151"
  charcoal: "#211f1d"
  neutral-bg: "#faf8f5"
  border-color: "#e6dec9"
  sidebar: "#3b2300"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Outfit, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "28px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.2xl}"
    padding: "16px"
---

# Design System: UniStay (Cusco Rent)

## 1. Overview

**Creative North Star: "The Andean Hearth"**

UniStay's visual system evokes the warmth, solidity, and hospitality of Cusco. Styled around earthy hues (warm browns, terracotta, and soft stone background colors) and clear geometric structure, it aims to establish high trust for students and ease of navigation for local landlords. 

The aesthetic is clean, functional, and highly legible. It avoids the neon styling and low-contrast fonts of typical SaaS products in favor of strong contrast, clear structural separation, and highly visible interactive controls.

**Key Characteristics:**
- Warm, grounded palette inspired by Cusco's masonry and soil.
- High typographic contrast pairing classic serif headlines with highly legible geometric body text.
- Flat design by default, utilizing elevation shifts purely to indicate interaction.
- Strict WCAG 2.2 AA accessibility compliance.

## 2. Colors

The palette is derived from Cusco's natural and historical materials—earth, clay, stone, and wood—curated to achieve a high-contrast, trustworthy environment.

### Primary
- **Andean Amber** (#895100): The primary identity color, representing warmth and hospitality. Used for key call-to-actions, active links, and brand highlights.
- **Dark Hearth** (#6a3d00): The hover and active state variant for primary elements, ensuring continuous readability and state feedback.

### Secondary
- **Terracotta Clay** (#b85151): An accent color used for secondary highlights, verification indicators, and notices.

### Neutral
- **Charcoal Ink** (#211f1d): The main text color, providing excellent contrast (well above 4.5:1) on light surfaces.
- **Pumice Stone** (#faf8f5): The page body background, giving a soft warmth that avoids the sterility of pure white or the eye strain of gray.
- **Clay Mortar** (#e6dec9): Used for borders, dividing lines, and subtle structural boundaries.
- **Pure White** (#ffffff): Used for card backgrounds, modal content blocks, and dropdown menus.

**The Contrast Rule.** Under no circumstances should gray text be used on light backgrounds if it falls below a 4.5:1 contrast ratio. All body copy must use Charcoal Ink (#211f1d) or Dark Gray (#4a4a4a) to guarantee absolute legibility.

## 3. Typography

UniStay uses a high-contrast serif/sans-serif pairing that balances the historical trust of Cusco (serif headers) with the digital efficiency of student portals (geometric body text).

**Display Font:** Playfair Display (fallback: Georgia, serif)
**Body Font:** Outfit (fallback: sans-serif)

### Hierarchy
- **Display (Bold, clamp(2rem, 5vw, 3rem), 1.2):** Used for main headers, page titles, and prominent section titles.
- **Headline (Bold, 1.75rem, 1.2):** Used for subsection titles and card headings.
- **Title (Semi-Bold, 1.25rem, 1.25):** Used for secondary cards and list titles.
- **Body (Regular, 1rem, 1.6):** Used for all descriptive text, paragraphs, and list items. Keep line lengths capped at 70ch.
- **Label (Medium, 0.875rem, 1):** Used for tags, input labels, form hints, and metadata.

**The Focus Rule.** Focus indicators must be prominent. Every interactive element must display a 2px offset outline of Andean Amber (#895100) or an active ring overlay when navigated via keyboard.

## 4. Elevation

The interface is flat by default, relying on solid borders, clean layout shifts, and color blocking to organize content. Elevation and shadows are used sparingly, serving as interactive signals or separation layers for overlays rather than decoration.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04)`): Subtle depth to separate white content cards from the Pumice Stone background.
- **Card Hover** (`box-shadow: 0 20px 40px rgba(137, 81, 0, 0.08)`): Active feedback, replacing the subtle rest shadow with a warm-tinted shadow.
- **Modal Overlay** (`box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12)`): Highest elevation layer, used to float dialog screens above backdrops.

**The Flat-by-Rest Rule.** All cards and container boxes remain flat and outlined with Clay Mortar (#e6dec9) at rest. Deep shadows must only appear during hover states or inside floating popups.

## 5. Components

### Buttons
- **Shape:** Full pill shape (radius: 9999px) for primary actions, or soft corners (radius: 12px) for secondary/ghost buttons.
- **Primary:** Background Andean Amber (#895100) with white text. Focus displays an outer ring.
- **Hover/Focus:** Shifts to Dark Hearth (#6a3d00) with smooth transition curves.

### Chips
- **Style:** Background white, outline 1px Clay Mortar (#e6dec9), rounded full (9999px).
- **Active State:** Background Andean Amber (#895100), white text, no border.

### Cards / Containers
- **Corner Style:** Large rounded corners (radius: 28px) for primary layout cards, and medium corners (radius: 12px) for smaller items.
- **Border:** 1px solid Clay Mortar (#e6dec9) to ensure high visibility without depending on shadows.

### Inputs / Fields
- **Style:** Background white, border 1px solid Clay Mortar (#e6dec9), rounded corners (radius: 12px).
- **Focus:** Border shifts to Andean Amber (#895100) with a 4px blur outer ring.

### Navigation
- **Style:** Sticky top nav or sidebar using Dark Hearth (#6a3d00) background for admin/landlord portals, or white background with Amber indicators for students.

## 6. Do's and Don'ts

### Do:
- **Do** maintain a minimum contrast ratio of 4.5:1 for all text.
- **Do** ensure every button and interactive control has a visible focus outline when focused.
- **Do** design forms with explicit `<label>` tags and clear aria descriptions.
- **Do** make all modals dismissible via the Escape key and ensure they trap keyboard focus.

### Don't:
- **Don't** use border-left/right stripes thicker than 1px as decorative highlights on cards or alerts.
- **Don't** use gradient text backgrounds or neon/saturated accents.
- **Don't** use glassmorphism or back-blur filters as standard card backgrounds.
- **Don't** hide interactive controls or filters behind hover-only states; all controls must be keyboard-accessible.

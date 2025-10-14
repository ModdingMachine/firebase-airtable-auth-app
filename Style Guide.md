# "Plastic Fantastic" Style Guide

This document outlines the visual design system for the "Plastic Fantastic" website, focusing on creating a clean, soft, tactile, and modern aesthetic.

---

## 1. Color Palette

The color scheme is based on soft pastels to create a friendly and light atmosphere.

### Primary Background
- `#f0f4f8` (Light Pastel Blue-Gray)

### Blob & Accent Colors
- **Pastel Blue:** `#a2d2ff`
- **Pastel Pink:** `#ffafcc`
- **Light Pastel Blue:** `#bde0fe`

### Text Colors
- **Primary Heading Text:** `rgb(31 41 55)` (`text-gray-800`)
- **Body Text:** `rgb(75 85 99)` (`text-gray-600`)

---

## 2. Typography

The typography is chosen for its readability and friendly appearance.

### Font Family
- `'Nunito', sans-serif`

### Weights
- **400** (Regular)
- **700** (Bold)
- **800** (Extra Bold)

### Headings (`<h1>`)
- **Font Weight:** 800 (Extra Bold)
- **Sizing:** Responsive (`text-3xl` to `text-4xl`)
- **Letter Spacing:** `tracking-tighter` for a compact, modern look

### Body Text (`<p>`)
- **Font Weight:** 400 (Regular)
- **Sizing:** `text-lg`
- **Color:** Uses the secondary text color for soft contrast

---

## 3. Components

### The "Attention Card"

The main interactive card, styled to look like frosted, glossy plastic. It's designed to draw user focus.

- **Background:** `rgba(255, 255, 255, 0.6)` provides a semi-transparent white base
- **Glassmorphism:** A `backdrop-filter: blur(20px) saturate(180%)` is applied to blur the content behind the card
- **Border:** A subtle `1px solid rgba(200, 200, 220, 0.4)`
- **Radius:** A large `border-radius: 2rem` creates very soft, rounded corners
- **Shadow & Shine:** A multi-layered `box-shadow` is used to achieve a 3D effect, including an inner highlight for shine

### The "Flat Card"

A static card that shares the same aesthetic as the Attention Card but does not move.

- **Background & Glassmorphism:** Uses the same `rgba` background and `backdrop-filter` as the Attention Card for visual consistency
- **Border:** `1px solid rgba(200, 200, 220, 0.4)`
- **Radius:** `border-radius: 2rem` to match the Attention Card
- **Shadow:** A simple `box-shadow` for a soft lift off the page

### Buttons

Buttons are designed to be clean and inviting.

- **Shape:** `rounded-full` for a soft, pill-like shape

#### Primary Button ("Get Started")
- **Background:** `bg-white/50` (semi-transparent white)
- **Hover State:** `hover:bg-white` (fully opaque)

#### Secondary Button ("Learn More", "More Info")
- **Background:** `bg-transparent`
- **Hover State:** `hover:bg-white/30`

#### Transitions
All buttons use transitions for smooth state changes.

---

## 4. Interactivity & Animation

### 3D Card Tilt
The "Attention Card" uses a perspective container and JavaScript to apply a subtle `transform: rotateX() rotateY()` that makes the card tilt towards the cursor.

### Background Parallax
The decorative background blobs move in the opposite direction of the cursor. This creates a subtle parallax effect that adds a sense of depth to the page.

### Transitions
All interactive elements (attention-card, blob, button) have CSS transitions applied to ensure all state changes and movements are smooth and fluid.

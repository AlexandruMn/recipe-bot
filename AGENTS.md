# Culinary Folder Codebase Guidelines

To ensure absolute design perfection, readability, and consistency across both **Light Mode** and **Dark Mode**, adhere to the following rules at all times.

## 1. Typography & Theme Symmetry
- **Unified Fonts**: The refined serif typeface `"EB Garamond"` paired with `"Inter"` must be used uniformly across both Light and Dark mode. Never split font experiences (e.g. EB Garamond for light mode only and default sans-serif for dark mode). Use the `--font-display` variables so all headings render symmetrically.
- **Dynamic Text Outlines**: Dynamic titles using outlines (like `.light-outline-title`) must use responsive outlining variables (`var(--outline-bg)` and `var(--outline-fg)`). This ensures the text shadow has strong contrast in both light and dark.

## 2. Interaction Symmetry (Static vs Clickable Blocks)
- **Static Containers**: Cards and page segment blocks styled with the classic vintage borders (such as `.ink-stamped-card`) are **static containers**. They must **never** scale, lift, Translate, or transform on hover or click. This avoids giving the user tactile feedback on non-clickable layouts.
- **Tactile Inputs & Buttons Only**: Interactive feedback, shifts, translations, and shadow changes must be reserved strictly for actionable buttons (`.ink-stamped-btn`, page tags, individual presets).

## 3. High-Contrast Text Colors
- Avoid gray-on-gray text styling. On muted or pastel backgrounds (such as pale green `bg-emerald-50/70` block or warm linen `bg-slate-50`), favor high-contrast text codes:
  - In **Light Mode**: Use `text-slate-800`, `text-slate-900`, or deep brand colors for body/labels with `font-medium` or `font-semibold`.
  - In **Dark Mode**: Use `text-slate-100`, `text-slate-200`, or clean brand shades.

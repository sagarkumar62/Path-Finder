# 01 — Design System Specification

## Overview
Career PathFinder's design system was established using Stitch MCP exploration. It follows a **Corporate Modernism with AI-forward Edge** aesthetic: clean, minimal, data-driven, friendly, and highly trustworthy.

---

## Design Tokens

### Color Palette
- **Primary**: Deep Indigo (`#4338ca` / `indigo-600`) — Authority, focus, core brand identity.
- **Secondary**: Emerald Green (`#10b981` / `emerald-500`) — Match score rings, completion status, skill acquisition.
- **Accent / AI**: Violet Indigo (`#6366f1` / `indigo-500`) — Adaptive badges, AI prompt chips, AI Assistant highlights.
- **Background**: Soft Off-White Slate (`#f8fafc` / `slate-50`) — Low contrast, zero glare.
- **Surface**: Pure White (`#ffffff`) with subtle `border-slate-200` (`#e2e8f0`).
- **Text Primary**: Slate 900 (`#0f172a`).
- **Text Secondary**: Slate 500 (`#64748b`).

### Typography
- **Headlines & Display**: `Plus Jakarta Sans` (Geometrical, open apertures, aspirational feel).
- **Body, Labels & Form Inputs**: `Inter` (High legibility at small sizes, functional clarity).

### Corner Radius Scale
- **Buttons / Inputs**: `rounded-lg` (8px / `0.5rem`).
- **Cards & Containers**: `rounded-xl` (16px / `1rem`).
- **Banners & Modals**: `rounded-2xl` (24px / `1.5rem`).
- **Pills & Chips**: `rounded-full` (9999px).

### Elevation & Depth
- Ambient soft shadow: `box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.04)`
- AI Glow shadow: `box-shadow: 0px 8px 30px rgba(67, 56, 202, 0.15)`

---

## Core UI Components
- `<Button>`: Supports `primary`, `secondary`, `outline`, `ghost`, `destructive`, and `ai` variants across `sm`, `md`, `lg`, and `icon` sizes.
- `<Card>`: Modular card container with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
- `<Badge>`: Visual indicator supporting `primary`, `secondary`, `success`, `warning`, `info`, `outline`, and `ai`.
- `<Progress>`: Smooth progress bar supporting custom colors and sizes.
- `<MatchScore>`: Circular SVG score indicator displaying fit percentage (e.g., 87% Match) with status labels.

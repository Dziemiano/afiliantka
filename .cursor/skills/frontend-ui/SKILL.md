---
name: frontend-ui
description: Enforces mobile-first responsive design when building React components, pages, or layouts. Use when creating or editing any TSX/JSX file, Tailwind classes, UI components, dashboard pages, admin views, or public website sections. Triggers on any UI-related task.
---

# Frontend UI — Mobile-First Responsive Design

## Mandate

Every UI change in this project MUST be mobile-first. Write styles for 320px screens first, then layer on `sm:`, `md:`, `lg:` Tailwind modifiers for larger viewports. Never build desktop-first.

## Tailwind Breakpoints

| Prefix | Min-width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile phones (320px+) |
| `sm:` | 640px | Large phones / small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

## Responsive Patterns

### Grids

```tsx
// CORRECT: mobile-first, columns increase with viewport
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// WRONG: desktop columns with no mobile fallback
<div className="grid grid-cols-3 gap-4">
```

### Flex Layouts

```tsx
// CORRECT: stacked on mobile, row on tablet+
<div className="flex flex-col md:flex-row gap-4">

// WRONG: row-only, breaks on narrow screens
<div className="flex flex-row gap-4">
```

### Sidebar

The dashboard and admin sidebars must be hidden on mobile. Use this pattern:

```tsx
// Sidebar: hidden on mobile, fixed on md+
<aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">

// Mobile hamburger toggle (visible only on small screens)
<button className="md:hidden p-2 min-h-[44px] min-w-[44px]">
  <Menu className="h-6 w-6" />
</button>
```

### Tables

```tsx
// Wrap tables for horizontal scroll on mobile
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <table className="min-w-full">...</table>
</div>

// Or restructure as cards on mobile:
<div className="hidden md:block">
  <table>...</table>
</div>
<div className="md:hidden space-y-3">
  {items.map(item => <MobileCard key={item.id} item={item} />)}
</div>
```

### Forms

```tsx
// Inputs: full width on mobile, constrained on desktop
<input className="w-full md:w-80" />

// Form layout: stacked on mobile, inline on desktop
<form className="flex flex-col sm:flex-row gap-3">
  <input className="w-full sm:flex-1" />
  <button className="w-full sm:w-auto min-h-[44px]">Wyślij</button>
</form>
```

### Touch Targets

All clickable elements must have at least 44x44px touch area:

```tsx
// Icon button with adequate touch target
<button className="p-3 min-h-[44px] min-w-[44px]">
  <X className="h-4 w-4" />
</button>

// Small text link — add padding
<a className="px-3 py-2 min-h-[44px] inline-flex items-center">
```

### Modals

```tsx
// Full-screen on mobile, centered on desktop
<div className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full md:rounded-lg">
```

## Project Conventions

- **UI library**: shadcn/ui components from `components/ui/`
- **Icons**: Lucide React — import from `lucide-react`
- **Language**: all user-facing text in Polish
- **Colors**: use Tailwind's `stone-*` palette for neutral UI, `blue-*` for primary actions
- **No hardcoded widths**: use `w-full`, `max-w-*`, or flex/grid sizing — never `w-[400px]` on containers
- **Spacing**: use Tailwind spacing scale (`p-4`, `gap-3`, `space-y-6`) — no arbitrary pixel values unless necessary

## Anti-Patterns

- `hidden` without a responsive `sm:block`/`md:flex` — permanently hides content on mobile
- `w-64` or `w-80` on layout containers — breaks on narrow screens
- Desktop-only grids without `grid-cols-1` base — unreadable on phones
- Buttons/links smaller than 44px tap area — unusable on touch devices
- `overflow-hidden` on containers with wide tables — cuts off content
- `text-xs` as the only body text size — too small on mobile

## Pre-Submit Checklist

Before completing any UI task, verify:

1. Base layout works at **320px** (no horizontal scroll, no cut-off content)
2. Layout adapts properly at **768px** (tablet)
3. Layout uses full space at **1280px** (desktop)
4. All buttons and links have at least **44px** touch targets on mobile
5. Text is readable — minimum `text-sm` for body content
6. Sidebar is not visible/overlapping on mobile
7. Tables are scrollable or restructured on mobile
8. Forms are full-width and stacked on mobile

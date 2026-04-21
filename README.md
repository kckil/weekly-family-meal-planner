# Mise — Weekly Family Meal Planner

A personal meal planning app that generates weekly dinner and breakfast plans, auto-assigns leftovers for lunch, and builds a categorized shopping list.

## Features

- **Plan generation** — "Surprise Me!" randomizes a full week (Sun–Fri) of dinners and breakfasts using a Fisher-Yates shuffle
- **Leftover lunches** — each day's lunch is automatically the previous night's dinner
- **Drag and drop** — swap meals between slots or drag from the sidebar
- **Shopping list** — aggregated, deduplicated ingredients grouped by category (Produce, Protein, Dairy, Grains, Pantry)
- **Clipboard export** — copy the full plan + shopping list in plain text
- **Meal library** — add, edit, delete meals; track usage history
- **CSV import/export** — bulk-add meals via CSV (`name, type, ingredients`)
- **JSON backup** — full export/import of meals + plan history
- **Local-only** — all data in localStorage, no backend required

## Tech Stack

- React 18 + TypeScript + Vite
- Custom CSS variables (oklch color system)
- Vitest + Testing Library
- Static deploy (GitHub Pages)

## Getting Started

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Local Build

```bash
npm run build
```

This outputs a production bundle to `dist/`. To preview it locally:

```bash
npx serve dist
```

## Deploy to GitHub Pages

The app is configured to deploy from the `gh-pages` branch.

### One-time setup

Install the deploy helper:

```bash
npm install -D gh-pages
```

Add a deploy script to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### Deploy

```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch.

Then in the repo settings (Settings > Pages), set:
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `/ (root)`

The site will be available at:  
`https://<username>.github.io/weekly-family-meal-planner/`

## Data Format (CSV Import)

```
Chicken Tacos, dinner, chicken thighs; corn tortillas; avocado; cilantro
Greek Yogurt with Fresh Fruit, breakfast, greek yogurt; mixed berries; honey
```

Three columns: **name**, **type** (breakfast/dinner), **ingredients** (semicolon-separated).

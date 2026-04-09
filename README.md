# ng-ecommerce

Angular 21 storefront starter built with standalone components, Angular Material, Tailwind CSS v4, Angular Signals, and NgRx Signal Store.

## Overview

This project is an early-stage e-commerce frontend focused on a simple storefront flow:

- a sticky header with primary actions
- a product listing page filtered by category
- wishlist navigation
- redirects for unknown routes and invalid category slugs

The app defaults to `products/all` and lazy-loads route pages from the Angular router.

The storefront state is centralized in an NgRx Signal Store that manages the selected category and derived product filtering.

The project now includes Angular unit tests powered by the CLI's Vitest-based `@angular/build:unit-test` target.

## Tech Stack

- Angular 21
- Standalone components
- Angular Signals
- NgRx Signals (`@ngrx/signals`)
- Angular Material 21
- Tailwind CSS v4
- SCSS
- Vitest

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

The application runs at `http://localhost:4200`.

## Available Scripts

Start development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run the test suite:

```bash
npm test
```

Run tests in single-run mode:

```bash
npx ng test --no-watch --no-progress
```

Run the dev build in watch mode:

```bash
npm run watch
```

## Routing

The current application routes are:

- `/` redirects to `/products/all`
- `/products/:category` loads the product grid
- `/wishlist` loads the wishlist page
- unknown URLs redirect to `/products/all`

Invalid category slugs under `/products/:category` are also redirected to `/products/all` by the products grid page.

## Project Structure

Key application files:

- `src/app/app.routes.ts` defines route configuration
- `src/app/app.config.ts` configures the router with component input binding
- `src/app/store.ts` defines the root NgRx Signal Store for storefront state
- `src/app/layout/` contains header UI
- `src/app/pages/products-grid/` contains the storefront grid view
- `src/app/components/product-card/` contains the reusable product tile
- `src/app/data/products.ts` contains seed product data
- `src/app/**/*.spec.ts` contains route, store, and component UI tests

## Testing

The application uses Angular's built-in Vitest integration through the `test` target in `angular.json`.

Current automated coverage includes:

- route-level redirects and page loading
- NgRx Signal Store state and derived selectors
- products grid rendering and invalid-category redirects
- app shell, header, and header action UI
- product card UI states and wishlist toggle behavior
- wishlist page placeholder rendering

## Conventions

- standalone components only
- inline templates and inline styles for small components
- signals for local reactive state
- NgRx Signal Store for shared storefront state and derived selectors
- Tailwind utilities for layout and spacing
- Angular Material components for interactive UI

## Notes

This repository currently uses static in-memory product data and is intended as a foundation for future catalog, cart, and wishlist features.

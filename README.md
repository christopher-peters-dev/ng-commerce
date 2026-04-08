# ng-ecommerce

Angular 21 storefront starter built with standalone components, Angular Material, Tailwind CSS v4, and signal-based state.

## Overview

This project is an early-stage e-commerce frontend focused on a simple storefront flow:

- a sticky header with primary actions
- a product listing page filtered by category
- wishlist navigation
- redirects for unknown routes and invalid category slugs

The app defaults to `products/all` and lazy-loads route pages from the Angular router.

## Tech Stack

- Angular 21
- Standalone components
- Angular Signals
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
- `src/app/layout/` contains header UI
- `src/app/pages/products-grid/` contains the storefront grid view
- `src/app/components/product-card/` contains the reusable product tile
- `src/app/data/products.ts` contains seed product data

## Conventions

- standalone components only
- inline templates and inline styles for small components
- signals for local reactive state
- Tailwind utilities for layout and spacing
- Angular Material components for interactive UI

## Notes

This repository currently uses static in-memory product data and is intended as a foundation for future catalog, cart, and wishlist features.

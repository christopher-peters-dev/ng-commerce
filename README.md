# ng-ecommerce

Angular 21 storefront built with standalone components, Angular Material, Tailwind CSS v4, Angular Signals, and NgRx Signal Store.

## Overview

This project implements a small in-memory shopping experience with category browsing, wishlist management, cart management, and toast feedback for user actions.

Current storefront flow includes:

- a sticky header with wishlist and cart navigation
- a product grid filtered by category
- a wishlist page with remove and clear actions
- a cart page with remove, clear, and move-to-wishlist actions
- toast notifications for wishlist and cart updates
- redirects for unknown routes and invalid category slugs

The app defaults to `products/all`, uses standalone Angular pages, and keeps shared UI state in a central NgRx Signal Store.

## Tech Stack

- Angular 21
- Standalone components
- Angular Signals
- NgRx Signals (`@ngrx/signals`)
- Angular Material 21
- Tailwind CSS v4
- SCSS
- `@ngxpert/hot-toast`
- Vitest via Angular's unit test builder

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

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npx ng test --watch=false
```

Run the dev build in watch mode:

```bash
npm run watch
```

## Features

### Product Browsing

- category-based browsing through `/products/:category`
- invalid category slugs redirect back to `/products/all`
- reusable product cards for grid, wishlist, and cart contexts

### Wishlist

- add and remove items from any eligible product card
- dedicated `/wishlist` page
- clear-all action from the wishlist page
- animated removal from the wishlist page

### Cart

- add and remove items directly from product cards
- dedicated `/cart` page
- clear-all action from the cart page
- move items from cart to wishlist
- animated removal from the cart page

### Toast Feedback

- global toast service wrapping `@ngxpert/hot-toast`
- success/info feedback for wishlist and cart actions
- global toast top spacing configured with `marginTop: 70px`

## Routing

The current application routes are:

- `/` redirects to `/products/all`
- `/products/:category` loads the product grid
- `/wishlist` loads the wishlist page
- `/cart` loads the cart page
- unknown URLs redirect to `/products/all`

Invalid category slugs under `/products/:category` are redirected to `/products/all` by the products page logic.

## State Management

The root store in `src/app/store.ts` currently manages:

- `products`
- `wishlist`
- `cart`
- `category`

It also exposes derived values and actions for:

- selected category label
- valid category slugs
- filtered product collections
- wishlist/cart item counts
- add, remove, clear, and move flows across wishlist and cart

## Project Structure

Key application files:

- `src/app/app.routes.ts` defines the route configuration
- `src/app/app.config.ts` configures router and toast providers
- `src/app/store.ts` defines shared storefront state and actions
- `src/app/services/toast.service.ts` wraps the global toast API
- `src/app/layout/` contains the sticky header and navigation actions
- `src/app/components/product-card/` contains the reusable product tile
- `src/app/pages/products-grid/` contains the category browsing view
- `src/app/pages/my-wishlist/` contains the wishlist page
- `src/app/pages/my-cart/` contains the cart page
- `src/app/data/products.ts` contains in-memory seed product data
- `src/app/**/*.spec.ts` contains route, store, page, and component tests

## Testing

The application uses Angular's built-in Vitest integration through the `test` target in `angular.json`.

Current automated coverage includes:

- route redirects and page loading
- store selectors and cart/wishlist state transitions
- product card wishlist and cart interactions
- product grid rendering and invalid-category redirects
- header and header action navigation
- wishlist and cart empty-state rendering

At the time of the latest update, the full suite passes with:

```bash
npx ng test --watch=false
```

Result: `19 passed, 0 failed`

## Conventions

- standalone components only
- inline templates and inline styles for small components
- Angular Signals for local reactive state
- NgRx Signal Store for shared application state
- Tailwind utilities for layout and spacing
- Angular Material for interactive UI controls

## Notes

This repository still uses static in-memory product data. Wishlist and cart state are client-side only and reset on reload.

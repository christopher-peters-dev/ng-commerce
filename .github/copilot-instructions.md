# Copilot Instructions

## Commands

```bash
npm start                              # Dev server at http://localhost:4200
npm run build                          # Production build to dist/ng-ecommerce
npm run watch                          # Development build in watch mode
npm test                               # Unit tests in watch mode
npx ng test --watch=false             # Run the full suite once
npx ng test --watch=false --include='src/app/store.spec.ts'  # Run one spec file
```

## Architecture

This is an Angular 21 storefront built entirely with standalone components. `src/main.ts`
bootstraps the root `App` component with `appConfig`, and `App` itself is a thin shell that
always renders the sticky header plus a `router-outlet`.

Routing is centered on storefront flows rather than feature modules. `src/app/app.routes.ts`
redirects both `/` and unknown routes to `/products/all`, lazy-loads the products grid and
wishlist pages, and serves the cart page directly. The products route binds the `:category`
segment into the page component, and `ProductsGrid` normalizes that route param with
`slugify()` before pushing it into store state or redirecting invalid slugs back to
`/products/all`.

Shared app state lives in the root `AppStore` signal store in `src/app/store.ts`, seeded from
the static catalog in `src/app/data/products.ts`. The store owns product data, selected
category, wishlist items, and cart items; it also exposes derived signals for category lists,
filtered products, valid slugs, and wishlist/cart counts. Cart and wishlist mutations are
implemented as store methods and are responsible for firing user feedback through the
`ToastService`.

UI layers are intentionally thin around that store. `ProductsGrid` reads `filteredProducts()`
and category signals, `MyWishlist` renders `store.wishlist()`, and `MyCart` renders
`store.cart()`. `ProductCard` is the reusable interaction surface across all three contexts:
its `view` input changes the CTA labels and behavior, and wishlist/cart removal in list views
waits 180ms before mutating store state so the exit animation can complete.

Styling combines Tailwind utility classes in templates with Angular Material 21 components and
global SCSS theme overrides in `src/styles.scss`. Shared visual behavior such as Material shape
overrides, toast styling, and the reusable `.responsive-grid` layout helper lives in global
styles rather than per-page styles.

## Key Conventions

- **Standalone components only:** declare Angular Material and router dependencies in each
  component's `imports` array; there are no NgModules.
- **Signals over RxJS state:** shared state is modeled with `@ngrx/signals` (`withState`,
  `withComputed`, `withMethods`), and components consume store values directly via signals and
  `computed()`.
- **Pages stay presentational:** page components mainly select from the store and delegate all
  mutations to `AppStore` methods instead of duplicating business logic.
- **Category routing uses slugs at the URL boundary only:** keep product/category data in its
  readable form and use `src/app/utils/slugify.ts` for route params, category validation, and
  active-state comparisons.
- **`ProductCard` is context-sensitive:** extend cart/wishlist behavior through its `view`
  input instead of forking separate card components.
- **Inline component templates/styles are the default:** Angular schematics are configured for
  inline template/style files and SCSS; generated filenames also omit the `.component` suffix
  (for example `header.ts`).
- **Current data is entirely in-memory:** `PRODUCTS` is the source catalog and cart/wishlist
  state resets on reload, so new persistence or API work needs explicit wiring rather than
  hidden backend assumptions.

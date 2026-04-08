# Copilot Instructions

## Commands

```bash
npm start          # Dev server → http://localhost:4200
npm run build      # Production build → dist/
npm run watch      # Dev build with watch
npm test           # Run unit tests (Vitest)
```

Single test: `ng test --include='**/path/to/foo.spec.ts'`

Generate code: `ng generate component feature/my-component` (supports component, service, directive, pipe, guard, interceptor, resolver)

## Architecture

Angular 21 e-commerce app — early stage, minimal structure. Entry point: `src/main.ts` bootstraps `App` (standalone) with `appConfig`. Routes are in `src/app/app.routes.ts` (currently empty). No services or feature components exist yet.

**Styling stack:** Tailwind CSS v4 (utility classes in templates) + Angular Material 21 (Material 3 theme in `styles.scss`) + SCSS for component styles. Use Tailwind for layout/spacing/typography; use Material components for UI elements.

## Key Conventions

**Standalone components only** — no NgModules. Declare dependencies in the component's `imports` array.

**Angular Signals** for reactive state — use `signal()`, `computed()`, `effect()`. Do not use `BehaviorSubject` or `async` pipe where signals work.

**Inline templates and inline styles** — angular.json schematics default to `inlineTemplate: true` and `inlineStyle: true`. Keep templates inline unless they grow large.

**File naming:** Angular CLI in this project drops the `.component` suffix for generated filenames (e.g. `app.ts`, not `app.component.ts`). Follow the same pattern for new files.

**SCSS for styles**, component prefix `app`, style files use `.scss` extension.

**No environment files** — use Angular build configurations (`--configuration development` / `--configuration production`) instead.

**Prettier** is configured: single quotes, 100-char line width, Angular HTML parser. Run `npx prettier --write .` to format.

**Tests are skipped by default** in schematics (`skipTests: true`). Add `--skip-tests=false` to generate spec files when needed.

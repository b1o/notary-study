You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## This project

- Read `docs/design.md` for the purpose of the app, the content rules and the decisions so far. It is a learning tool, not a tool for real case work.
- Read `README.md` for the folder structure and how the parts work.
- Keep research notes in `docs/research/<topic>/`, with the sources you used.
- Layers: `features/` and `layout/` may use `shared/` and `core/`; `shared/` may use `core/`; `core/` uses neither.
- A page sits in `PageLayout` with a `PageHeader`. Before you write a component, a style or a helper for one page, look in `shared/`, `src/styles/_components.scss` and `core/` for one that exists. Put logic that a test can check (rules, calculations, search) in `core/` as pure functions.
- Every interface text goes into `core/i18n/ui-text.ts` and both language files. Never hard-code a text in a template.
- Course content and law data are files in `public/data`. Run `bun run check:content` after a content change.
- Styles use the tokens of `src/styles/_tokens.scss`. Do not use coloured side borders as decoration.
- A value that the reader sets and that must survive a reload uses `storedSignal()` from `core/storage`.
- Before a commit: `bun run lint`, `bun run test`, `bun run build`, and `bunx prettier --check "src/**/*.{ts,html,scss}"`.

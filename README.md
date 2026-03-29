# DogsApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Testing

### Unit tests

Unit tests use [Vitest](https://vitest.dev/) via the Angular build system and cover the `App` component and `DogService`. Run them with:

```bash
npm test
```

To run in watch mode (re-runs on file save):

```bash
npm test -- --watch
```

To generate a coverage report:

```bash
npm test -- --coverage
```

The spec files live alongside the source they test:

| File | What it tests |
|---|---|
| `src/app/app.spec.ts` | `App` component — signals, favorites logic, thumbnail selection, refresh |
| `src/app/dog.service.spec.ts` | `DogService` — HTTP requests, URL-to-breed parsing |

### End-to-end tests

E2E tests use [Playwright](https://playwright.dev/) with Chromium. They mock the dog.ceo API so runs are fast and deterministic.

**First-time setup** — install the Playwright browser:

```bash
npx playwright install chromium
```

**Run the tests** — the dev server starts automatically:

```bash
npm run e2e
```

The dev server must not already be running when you execute this command (Playwright starts it for you). If you prefer to manage the server yourself, start it first with `npm start` and then run:

```bash
npm run e2e -- --ui
```

The `--ui` flag opens Playwright's interactive UI, which is useful for debugging individual tests.

The test file lives in `e2e/app.spec.ts` and covers:

- Page title and initial layout
- Dog image loading and thumbnail grid
- Adding, deduplicating, and removing favorites
- Selecting a thumbnail as the main image
- Refreshing all images

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

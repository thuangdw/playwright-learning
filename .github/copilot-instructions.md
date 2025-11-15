# Copilot Instructions for Playwright Learning

This is a **Playwright end-to-end testing project** using TypeScript. The codebase demonstrates browser automation patterns with a focus on test structure and cross-browser compatibility.

## Project Architecture

- **Test Runner**: Playwright Test framework (`@playwright/test` v1.56.1)
- **Language**: TypeScript with strict mode enabled
- **Test Location**: `tests/` directory (all `.spec.ts` files)
- **Configuration**: Centralized in `playwright.config.ts`
- **Output**: HTML test report in `playwright-report/` (local runs)

### Key Setup & Execution

**Running Tests:**

- **All browsers**: `npx playwright test` (runs chromium, firefox, webkit in parallel)
- **Single browser**: `npx playwright test --project=chromium`
- **Debug mode**: `npx playwright test --debug`
- **Watch mode**: `npx playwright test --watch`
- **UI mode**: `npx playwright test --ui`
- **View report**: `npx playwright show-report`

**Development Setup:**

- Tests run in parallel by default locally (`fullyParallel: true`)
- CI environment (GitHub Actions) runs serially with retries (2 retries on CI, 0 locally)
- Trace collection enabled on first retry for debugging failures
- HTML reporter generates interactive test report automatically

## Testing Patterns

All test files follow this structure (`tests/example.spec.ts`):

```typescript
import { test, expect } from "@playwright/test";

test("test description", async ({ page }) => {
  await page.goto("https://example.com/");
  // User interactions
  await page.getByRole("link", { name: "text" }).click();
  // Assertions
  await expect(page).toHaveTitle(/pattern/);
});
```

**Common Patterns:**

- Use **accessible role queries** (`getByRole`, `getByLabel`) over selectors when possible
- Page fixture is provided via destructuring in test function
- Assertions use `expect()` from `@playwright/test`
- Async/await required for all page operations

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`):

- Runs on push to `main`/`master` and all pull requests
- Uses Node.js LTS
- Installs browsers via `npx playwright install --with-deps`
- Uploads HTML report as artifact (30-day retention)
- Fails build if `test.only` found in source (forbidOnly check)
- Timeout: 60 minutes per job

## Project Conventions

- **No baseURL configured** – tests must use absolute URLs (e.g., `https://playwright.dev/`)
- **Environment variables** – commented out but can be enabled via `.env` file + dotenv
- **Multi-browser by default** – tests run against Chromium, Firefox, WebKit (see `projects` in config)
- **Mobile testing** – commented out but can be enabled by uncommenting device configs
- **Dev server** – disabled; enable `webServer` in config if needed for local app testing

## File Structure Reference

- `playwright.config.ts` – Test configuration, browser profiles, reporters, retry logic
- `tsconfig.json` – TypeScript strict mode, ES2020+ target, source maps enabled
- `tests/example.spec.ts` – Example tests demonstrating basic patterns
- `.github/workflows/playwright.yml` – CI pipeline definition

## Common Tasks

**Adding new tests:** Create `tests/[feature].spec.ts` with `test()` blocks following the example pattern.

**Debugging failures:** Run `npx playwright test --debug` to step through with Inspector, or check `playwright-report/` for trace recordings.

**Cross-browser issues:** Use `project` option in test config to isolate to specific browsers (e.g., `--project=firefox`).

# Playwright Learning Setup Guide

This guide covers the complete setup, configuration, and workflow for the Playwright learning project.

## Prerequisites

- **Node.js & npm**: Verify installation with `node --version` and `npm --version`
- **TypeScript**: Installed as a dev dependency
- **Git**: For version control and pushing to GitHub

## Installation

### 1. Clone or Initialize Repository

If cloning an existing repository:

```bash
git clone https://github.com/thuangdw/playwright-learning.git
cd playwright-learning
npm install
```

If starting fresh:

```bash
mkdir playwright-learning && cd playwright-learning
npm init -y
npm install --save-dev @playwright/test @types/node
npx playwright install
```

### 2. Install Playwright Browsers

Playwright requires browser binaries. Install them with:

```bash
npx playwright install
```

On CI/CD or with system dependencies:

```bash
npx playwright install --with-deps
```

This installs Chromium, Firefox, and WebKit browsers locally.

## Project Configuration

### TypeScript Configuration (`tsconfig.json`)

The project uses strict TypeScript with ES2020+ target:

- Strict mode enabled (`"strict": true`)
- Source maps enabled for debugging
- Output directory: `test-results/`

No additional configuration needed; compilation happens automatically during test runs.

### Playwright Configuration (`playwright.config.ts`)

Key settings:

- **Test directory**: `tests/` (finds all `.spec.ts` files)
- **Parallel execution**: Enabled locally (`fullyParallel: true`), serial on CI
- **Browsers**: Chromium, Firefox, WebKit by default
- **Reporter**: HTML report (auto-generated in `playwright-report/`)
- **Retries**: 0 locally, 2 on CI
- **Trace collection**: Enabled on first retry for debugging failed tests
- **No baseURL**: Tests use absolute URLs (e.g., `https://playwright.dev/`)

To enable features, uncomment in `playwright.config.ts`:

- **Dev server**: Uncomment `webServer` to auto-start local app before tests
- **Mobile testing**: Uncomment device configs (iPhone 12, Pixel 5, etc.)
- **Environment variables**: Uncomment dotenv import and create `.env` file

## Running Tests

### Basic Commands

**Run all tests across all browsers:**

```bash
npx playwright test
```

**Run tests for a single browser:**

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Run a single test file:**

```bash
npx playwright test tests/todo.spec.ts
```

**Run tests matching a pattern:**

```bash
npx playwright test -g "should add a new todo"
```

### Advanced Test Modes

**Headed mode (see browser window):**

```bash
npx playwright test --headed
# or single browser
npx playwright test --project=chromium --headed
```

**Debug mode (interactive Inspector):**

```bash
npx playwright test --debug
# or with PWDEBUG environment variable
PWDEBUG=1 npx playwright test
```

In debug mode:

- Browser opens and pauses at first action
- Inspector panel allows stepping through, inspecting locators, and evaluating code
- Useful for understanding test execution and fixing selectors

**Watch mode (re-run tests on file changes):**

```bash
npx playwright test --watch
```

**UI mode (interactive dashboard):**

```bash
npx playwright test --ui
# Opens a browser-based test runner with playback controls
```

**View HTML report:**

```bash
npx playwright show-report
```

## Test Structure and Patterns

### Basic Test Template

```typescript
import { test, expect } from "@playwright/test";

test("test description", async ({ page }) => {
  // Navigate to a URL
  await page.goto("https://example.com/");

  // Interact with the page
  await page.getByRole("link", { name: "Get started" }).click();

  // Assert expected behavior
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
```

### Locator Best Practices

Use accessible locators in order of preference:

1. **Role-based** (most resilient):

   ```typescript
   page.getByRole("button", { name: "Submit" });
   page.getByRole("link", { name: "Home" });
   page.getByRole("heading", { level: 1 });
   ```

2. **Label-based**:

   ```typescript
   page.getByLabel("Email");
   ```

3. **Placeholder**:

   ```typescript
   page.getByPlaceholder("Enter your name");
   ```

4. **Text content**:

   ```typescript
   page.getByText("Welcome to the app");
   ```

5. **CSS selector** (least maintainable, use as last resort):
   ```typescript
   page.locator("button.submit-btn");
   ```

### Common Assertions

```typescript
// Visibility
await expect(page.locator("h1")).toBeVisible();

// Text content
await expect(page.getByRole("heading")).toContainText("Welcome");

// Page title
await expect(page).toHaveTitle(/Playwright/);

// URL
await expect(page).toHaveURL("https://playwright.dev/");

// Element count
await expect(page.getByRole("listitem")).toHaveCount(3);

// Value
await expect(page.getByRole("textbox")).toHaveValue("typed text");
```

## Debugging Failed Tests

### View Test Report

After a test run, view the interactive HTML report:

```bash
npx playwright show-report
```

The report includes:

- Test execution timeline
- Browser console logs
- Network requests
- Screenshots at each step
- Trace recordings (on first retry)

### Trace Viewer

If trace collection is enabled (`trace: 'on-first-retry'` in config), failed tests on retry generate trace files:

```bash
npx playwright show-trace path/to/trace.zip
```

Traces allow step-by-step playback of the test with browser state inspection at each action.

### Debug Specific Test

Run a failing test in debug mode:

```bash
npx playwright test tests/todo.spec.ts --debug -g "specific test name"
```

Or use headed mode to watch the browser while running:

```bash
npx playwright test tests/todo.spec.ts --headed
```

## GitHub Integration

### Initial Setup (One-Time)

#### Option A: GitHub CLI (Recommended)

1. Install GitHub CLI:

   ```bash
   brew install gh
   ```

2. Authenticate:

   ```bash
   gh auth login
   # Choose GitHub.com, HTTPS or SSH, then follow browser authorization flow
   ```

3. Verify authentication:
   ```bash
   gh auth status
   ```

#### Option B: SSH Key Setup

1. Generate SSH key:

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   eval "$(ssh-agent -s)"
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

2. Add public key to GitHub:
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   # Paste into GitHub Settings > SSH and GPG keys > New SSH key
   ```

#### Option C: HTTPS + Personal Access Token (PAT)

1. Create a PAT on GitHub:

   - Go to https://github.com/settings/tokens
   - Generate new token with `repo` scope
   - Copy the token (store securely)

2. Configure macOS keychain helper:

   ```bash
   git config --global credential.helper osxkeychain
   ```

3. When prompted for Git credentials:
   - Username: Your GitHub username
   - Password: Paste the PAT (not your account password)

### Initialize Git Repository (One-Time)

```bash
cd /Users/thuang/playwright-learning
git init
git add .
git commit -m "Initial commit: Playwright learning project"
git branch -M main
```

### Create GitHub Repository

**Using GitHub CLI (recommended):**

```bash
gh repo create thuangdw/playwright-learning --public --source=. --remote=origin --push
```

**Or manually via GitHub web UI:**

1. Go to https://github.com/new
2. Repository name: `playwright-learning`
3. Choose Public or Private
4. Click "Create repository"
5. Add remote and push:
   ```bash
   git remote add origin https://github.com/thuangdw/playwright-learning.git
   git push -u origin main
   ```

### Push Changes to GitHub

After making changes locally:

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new test for todo functionality"

# Push to origin (remote)
git push
# or push specific branch
git push origin main
```

### Troubleshooting Push Issues

**"Repository not found"**

- Verify the remote URL: `git remote -v`
- Ensure the GitHub repo exists and you have permission
- Re-authenticate if necessary

**"Password authentication is not supported"**

- GitHub requires either a PAT or SSH key; passwords are not accepted
- Follow Option B (SSH) or Option C (PAT) above

**"Authentication failed"**

- Clear cached credentials (macOS):
  ```bash
  # Remove stored GitHub credential from Keychain
  printf "url=https://github.com\n" | git credential-osxkeychain erase
  ```
- Re-authenticate with `gh auth login` or recreate your PAT

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

- Runs on push to `main`/`master` and all pull requests
- Installs Node.js LTS
- Installs Playwright browsers with system dependencies
- Runs `npx playwright test` (serial execution, 2 retries)
- Uploads HTML report as artifact (30-day retention)
- Enforces `forbidOnly` check (fails if `test.only` found in source)

To verify CI status, check the Actions tab on your GitHub repository after pushing.

## Common Workflows

### Add a New Test

1. Create a new `.spec.ts` file in `tests/`:

   ```bash
   touch tests/myfeature.spec.ts
   ```

2. Use the test template and follow best practices for locators

3. Run the test locally:

   ```bash
   npx playwright test tests/myfeature.spec.ts --headed
   ```

4. Once passing, commit and push:
   ```bash
   git add tests/myfeature.spec.ts
   git commit -m "Add test for my feature"
   git push
   ```

### Debug a Failing Test

1. Run in debug mode:

   ```bash
   PWDEBUG=1 npx playwright test tests/myfeature.spec.ts
   ```

2. Step through in the Inspector, inspect DOM, check console logs

3. View the HTML report for more details:
   ```bash
   npx playwright show-report
   ```

### Test Against a Specific Browser

```bash
npx playwright test --project=firefox --headed
```

### Run Tests in Parallel (Default)

Tests run in parallel by default locally for speed. To run serially:

```bash
npx playwright test --workers=1
```

## Performance Tips

- **Parallel execution** is enabled by default locally; disable with `--workers=1` if needed for debugging
- **Headed mode is slower**; use `--headed` only for debugging, not in CI
- **Use specific `--project`** to test single browser during development
- **Use `-g` pattern matching** to run specific tests instead of all tests
- **Trace collection on-first-retry** adds overhead; disable for fast local runs if not needed

## Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Inspector & Debugging](https://playwright.dev/docs/debug)
- [GitHub Actions for Playwright](https://playwright.dev/docs/ci)

## Quick Reference

| Task                 | Command                                            |
| -------------------- | -------------------------------------------------- |
| Install dependencies | `npm install`                                      |
| Install browsers     | `npx playwright install`                           |
| Run all tests        | `npx playwright test`                              |
| Run tests headed     | `npx playwright test --headed`                     |
| Debug mode           | `PWDEBUG=1 npx playwright test`                    |
| UI mode              | `npx playwright test --ui`                         |
| View report          | `npx playwright show-report`                       |
| Single browser       | `npx playwright test --project=chromium`           |
| Single test file     | `npx playwright test tests/example.spec.ts`        |
| Matching pattern     | `npx playwright test -g "pattern"`                 |
| Git commit & push    | `git add . && git commit -m "message" && git push` |

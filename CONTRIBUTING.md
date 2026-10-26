# Contributing

This repository is the production source for `https://lioncc.ai`. A push to
`main` triggers the GitHub Pages deployment workflow, so repository-only
changes and page changes are not equivalent in risk.

## Branches and commits

- Use a short-lived branch: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, or
  `chore/<topic>`.
- Keep one intent per pull request and do not mix a deployment change with a
  content change.
- Use Conventional Commits in English, for example:
  `docs(tutorial): clarify the local proxy setup`.
- Do not commit secrets, real payment data, temporary browser artifacts, or
  local backup files.

## Production rules

- Do not edit `gh-pages` manually. It is generated from `main`.
- Changes to `.github/workflows/deploy.yml`, `CNAME`, `sitemap.xml`,
  `robots.txt`, or domain configuration require an explicit deployment review.
- Preserve both Chinese and English localization keys when changing visible
  page content.
- Validate desktop and 390px mobile layouts for page changes.
- Rebuild `css/tailwind.css` when a Tailwind page or script gains a new class.

## Before opening a pull request

```bash
bun run build
git diff --exit-code -- css/tailwind.css
```

- State whether the change affects production content.
- Add desktop and mobile screenshots for page changes.
- State the rollback path. Revert the pull request and let the deployment
  workflow publish the previous state.
- Do not add local screenshots, videos, `.playwright-cli/`, `.wrangler/`, or
  backup files to the pull request.

The source license is [PolyForm Noncommercial 1.0.0](LICENSE). Report security
issues according to [SECURITY.md](SECURITY.md).

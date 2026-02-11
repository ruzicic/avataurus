# Contributing to Avataurus

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/ruzicic/avataurus.git
cd avataurus
npm install
npm run dev  # starts local Cloudflare Worker
```

## Making Changes

1. Create a branch: `git checkout -b my-feature`
2. Make your changes
3. Add a changeset: `npm run changeset` — describe what changed
4. Run checks: `npm test && npm run lint`
5. Commit and push
6. Open a Pull Request

## Changesets

We use [changesets](https://github.com/changesets/changesets) for versioning and changelogs. Every PR that changes behavior should include a changeset:

```bash
npm run changeset
# Select patch/minor/major, write a summary
```

This creates a file in `.changeset/` — commit it with your PR. When released, it automatically updates the version and CHANGELOG.

## Code Style

Code style is enforced by [Biome](https://biomejs.dev/). Run:

```bash
npm run lint      # check
npm run lint:fix  # auto-fix
npm run format    # format all files
```

## Guidelines

- Zero runtime dependencies — keep it that way
- Determinism is sacred — never change output for existing inputs
- Test edge cases (empty strings, unicode, long inputs)
- Keep the API surface small

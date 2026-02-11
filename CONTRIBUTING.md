# Contributing to Avataurus

Thanks for wanting to contribute!

## Development

```bash
git clone https://github.com/ruzicic/avataurus.git
cd avataurus
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run tests (Vitest) |
| `npm run lint` | Lint with Biome |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run dev` | Start local Worker (Wrangler) |
| `npm run deploy` | Deploy Worker to Cloudflare |

### Project Structure

```
src/
  avataurus.js    # Core avatar generation (JS API)
  element.js      # <avataurus-el> web component
  index.js        # Package entry point
worker/
  index.js        # Cloudflare Worker (HTTP API)
  landing.js      # Landing page HTML
test/
  avataurus.test.js
  element.test.js
types/
  index.d.ts      # TypeScript declarations
```

## Guidelines

- Zero dependencies. If you need a library, you probably don't.
- All changes must pass `npm run lint && npm test`.
- Avatar output is deterministic. Changing how a seed maps to an avatar is a breaking change.
- Keep it simple. The whole library is one file and should stay that way.

## Pull Requests

1. Fork and create a branch from `master`
2. Make your changes
3. Run `npm run lint:fix && npm test`
4. Open a PR with a clear description

## Reporting Issues

Open an issue at [github.com/ruzicic/avataurus/issues](https://github.com/ruzicic/avataurus/issues).

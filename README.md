<div align="center">

# 🦕 Avataurus

**Deterministic SVG avatar generator — unique dinosaur-inspired faces from any string.**

[![npm version](https://img.shields.io/npm/v/avataurus.svg)](https://www.npmjs.com/package/avataurus)
[![bundle size](https://img.shields.io/bundlephobia/minzip/avataurus)](https://bundlephobia.com/package/avataurus)
[![license](https://img.shields.io/npm/l/avataurus.svg)](./LICENSE)
[![CI](https://github.com/ruzicic/avataurus/actions/workflows/ci.yml/badge.svg)](https://github.com/ruzicic/avataurus/actions/workflows/ci.yml)

**1.7B+ unique combinations · Zero dependencies · 4KB gzipped**

[**Try it live →**](https://avataurus.com)

</div>

---

## Install

```bash
npm i avataurus
```

## Usage

### Image URL (Cloudflare Worker)

```html
<img src="https://avataurus.com/avatar/your-username" width="64" height="64" />
```

Supports query params: `?size=128&variant=gradient&showInitial=true`

### Web Component

```html
<script type="module">
  import 'avataurus/element'
</script>

<avatar-us name="jane" size="64"></avatar-us>
<avatar-us name="john" size="64" variant="solid" show-initial></avatar-us>
```

### JavaScript API

```js
import { generateAvatar } from 'avataurus'

const svg = generateAvatar('jane', { size: 128 })
document.getElementById('avatar').innerHTML = svg
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `number` | `128` | Avatar size in pixels |
| `variant` | `'gradient' \| 'solid'` | `'gradient'` | Fill style for the head |
| `showInitial` | `boolean` | `false` | Overlay first letter of the name |
| `colors` | `[string, string, string, string]` | auto | Custom color palette `[main, secondary, light, bg]` |

### Web Component Attributes

| Attribute | Description |
|-----------|-------------|
| `name` | String to generate avatar from |
| `size` | Pixel size (default: `48`) |
| `variant` | `gradient` or `solid` |
| `show-initial` | Show first letter overlay |
| `colors` | JSON array of 4 hex colors |
| `no-hover` | Disable hover animation |

## How It Works

Avataurus hashes the input string using FNV-1a, DJB2, and SDBM to extract bits that deterministically select from 13 independent feature layers: head shape, spikes, eyes, eyebrows, mouth, nose, cheeks, ears, face markings, accessories, belly patch, tail, and background pattern.

Same input → same avatar. Always.

## Compatibility

- **Browser:** Any modern browser (ES2020+)
- **Node.js:** 18+
- **Edge:** Cloudflare Workers, Deno, Bun

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](./LICENSE) © mladen

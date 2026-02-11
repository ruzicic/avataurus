# 🦕 Avataurus

[![npm version](https://img.shields.io/npm/v/avataurus)](https://www.npmjs.com/package/avataurus)
[![license](https://img.shields.io/npm/l/avataurus)](LICENSE)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)]()

**Deterministic avatar generator** — unique, dinosaur-inspired faces from any string. Same input = same face. **1.7 billion+** unique combinations across 13 feature layers.

🔗 **[Live Demo →](https://avataurus.workers.dev)**

![Gallery](https://avataurus.workers.dev/alice?size=80) ![Gallery](https://avataurus.workers.dev/bob?size=80) ![Gallery](https://avataurus.workers.dev/charlie?size=80) ![Gallery](https://avataurus.workers.dev/diana?size=80) ![Gallery](https://avataurus.workers.dev/elena?size=80) ![Gallery](https://avataurus.workers.dev/frank?size=80)

## Features

- 🎯 **Deterministic** — same input always gives the same avatar
- 🦕 **13 feature layers** — head, spikes, eyes, eyebrows, mouth, nose, cheeks, ears, face markings, accessories, belly patch, tail, background
- 📦 **Zero dependencies** — pure vanilla JavaScript
- ⚡ **Blazing fast** — SVG generated in <2ms
- 🔌 **Web Component** — `<avataurus>` custom element with hover animations
- ☁️ **Cloudflare Worker** — image URL API on the edge
- 🎨 **16 color palettes** with gradient and solid variants

## Install

```bash
npm install avataurus
```

Or use the CDN:

```html
<script type="module" src="https://unpkg.com/avataurus/src/element.js"></script>
```

## Usage

### Image URL (Cloudflare Worker)

```html
<img src="https://avataurus.workers.dev/john" width="48" height="48" />
<img src="https://avataurus.workers.dev/john?size=128&variant=solid&initial=true" />
```

### Web Component

```html
<script type="module" src="https://unpkg.com/avataurus/src/element.js"></script>

<avataurus name="john" size="48"></avataurus>
<avataurus name="jane" size="64" variant="solid"></avataurus>
<avataurus name="bob" size="48" show-initial></avataurus>
<avataurus name="static" size="48" no-hover></avataurus>
```

### JavaScript API

```js
import { generateAvatar } from 'avataurus';

const svg = generateAvatar('john', {
  size: 128,
  variant: 'gradient',
  showInitial: true,
});

document.getElementById('avatar').innerHTML = svg;
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | number | 128 | Avatar size in pixels |
| `variant` | `'gradient'` \| `'solid'` | `'gradient'` | Color fill style |
| `showInitial` | boolean | false | Show first letter overlay |
| `colors` | string[4] | auto | Custom color palette `[main, secondary, light, bg]` |

## Web Component Attributes

| Attribute | Description |
|-----------|-------------|
| `name` | String to generate avatar from |
| `size` | Pixel size (default: 48) |
| `variant` | `gradient` or `solid` |
| `show-initial` | Show first letter overlay |
| `colors` | JSON array of 4 hex colors |
| `no-hover` | Disable hover animation |

## Self-Hosting

Avataurus runs as a Cloudflare Worker:

```bash
git clone https://github.com/ruzicic/avataurus
cd avataurus
npm install
npm run dev      # local dev server
npm run deploy   # deploy to Cloudflare
```

## License

[MIT](LICENSE) © mladen

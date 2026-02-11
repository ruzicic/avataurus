<div align="center">

# Avataurus

**Minimal face avatars from pure math**

[![npm version](https://img.shields.io/npm/v/avataurus.svg)](https://www.npmjs.com/package/avataurus)
[![bundle size](https://img.shields.io/bundlephobia/minzip/avataurus)](https://bundlephobia.com/package/avataurus)
[![license](https://img.shields.io/npm/l/avataurus.svg)](./LICENSE)
[![CI](https://github.com/ruzicic/avataurus/actions/workflows/ci.yml/badge.svg)](https://github.com/ruzicic/avataurus/actions/workflows/ci.yml)

**Deterministic · Zero Dependencies · 4KB gzipped**

[**Try it live →**](https://avataurus.com)

</div>

---

Feed it any string, get back a unique minimal face avatar. Same input, same face — forever. Pure SVG generated from deterministic math, no network requests, no database.

## Install

```bash
npm i avataurus
```

## Usage

### Image URL — point an `<img>` at the service

```html
<img src="https://avataurus.com/your-username" width="64" height="64" alt="Avatar" />
```

Query params: `?size=128&variant=initial`

### Web Component — drop in an `<avataurus>`

```html
<script type="module">
  import 'avataurus/element'
</script>

<avataurus seed="jane" size="64"></avataurus>
<avataurus seed="john" size="48" variant="initial"></avataurus>
<avataurus seed="team" size="32" no-hover></avataurus>
```

### JavaScript API — generate in code

```js
import { generateAvatar } from 'avataurus'

const svg = generateAvatar('jane', { size: 128, variant: 'initial' })
document.getElementById('avatar').innerHTML = svg
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `number` | `128` | Avatar size in pixels |
| `variant` | `'face' \| 'initial'` | `'face'` | Eyes + mouth or eyes + letter |
| `colors` | `string[]` | auto | Custom color palette |

### Variants

- **`face`** (default): Eyes + mouth expressions on colored backgrounds
- **`initial`**: Eyes + first letter of the input string in monospace font

### Web Component Attributes

| Attribute | Description |
|-----------|-------------|
| `seed` | String to generate avatar from (required) |
| `size` | Pixel size (default: `48`) |
| `variant` | `face` or `initial` |
| `colors` | Comma-separated color values |
| `no-hover` | Disable hover animation |

## How It Works

Avataurus runs your string through hash functions and extracts bits to deterministically select:

- **Background color** from a curated 30-color palette
- **Eye shape** from 8 types (dots, ovals, arcs, lines, diamonds, crosses, half-moons, rectangles)
- **Eye spacing** and **vertical position** for natural variation
- **Mouth shape** from 4 expressions (smile, line, circle, frown) or **initial letter**

The result is a unique avatar from millions of possible combinations. No API calls, no storage, no randomness — the string *is* the identity.

## Features

- **Deterministic**: Same input always produces the same output
- **Zero dependencies**: No external libraries or fonts required
- **Scalable**: Pure SVG that looks crisp at any size
- **Lightweight**: 4KB gzipped, loads instantly
- **Edge-native**: Runs on Cloudflare Workers worldwide
- **Accessible**: Proper alt text and keyboard navigation support

## Runs Everywhere

- **Browser**: Any modern browser (ES2020+)
- **Node.js**: 18+
- **Edge**: Cloudflare Workers, Deno, Bun

## Examples

```js
// Basic face avatar
generateAvatar('alice')

// Initial variant
generateAvatar('bob', { variant: 'initial' })

// Custom size
generateAvatar('charlie', { size: 256 })

// Custom colors
generateAvatar('diana', { colors: ['#FF6B6B', '#4ECDC4'] })
```

## TypeScript

Full TypeScript support included:

```ts
import { generateAvatar, type AvatarOptions } from 'avataurus'

const options: AvatarOptions = {
  size: 128,
  variant: 'initial',
  colors: ['#264653']
}

const svg: string = generateAvatar('user123', options)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](./LICENSE) © mladen
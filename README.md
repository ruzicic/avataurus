<div align="center">

# 🦕 Avataurus

**Every string hatches a different dino.**

[![npm version](https://img.shields.io/npm/v/avataurus.svg)](https://www.npmjs.com/package/avataurus)
[![bundle size](https://img.shields.io/bundlephobia/minzip/avataurus)](https://bundlephobia.com/package/avataurus)
[![license](https://img.shields.io/npm/l/avataurus.svg)](./LICENSE)
[![CI](https://github.com/ruzicic/avataurus/actions/workflows/ci.yml/badge.svg)](https://github.com/ruzicic/avataurus/actions/workflows/ci.yml)

**1.7B+ unique phenotypes · Self-contained · 4KB gzipped**

[**Dig site →**](https://avataurus.com)

</div>

---

Feed it a string, get back a one-of-a-kind dinosaur face. Same string, same dino — today, tomorrow, heat death of the universe. Pure SVG, no network requests, no database. Just math and reptiles.

## Install

```bash
npm i avataurus
```

## Usage

### Image URL — point an `<img>` at the dig site

```html
<img src="https://avataurus.com/your-username" width="64" height="64" />
```

Query params: `?size=128&variant=solid&initial=true&mood=happy&species=rex`

### Web Component — drop in an `<avataurus-el>`

```html
<script type="module">
  import 'avataurus/element'
</script>

<avataurus-el name="jane" size="64"></avataurus-el>
<avataurus-el name="john" size="48" variant="solid" show-initial></avataurus-el>
<avataurus-el name="angry-rex" mood="angry" species="rex"></avataurus-el>
<avataurus-el name="chill-bronto" mood="chill" species="bronto"></avataurus-el>
```

### JavaScript API — hatch one in code

```js
import { generateAvatar } from 'avataurus'

const svg = generateAvatar('jane', { size: 128, mood: 'happy', species: 'stego' })
document.getElementById('avatar').innerHTML = svg
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `number` | `128` | Avatar size in pixels |
| `variant` | `'gradient' \| 'solid'` | `'gradient'` | Fill style for the head |
| `showInitial` | `boolean` | `false` | Overlay first letter of the name |
| `colors` | `[string, string, string, string]` | auto | Custom palette `[main, secondary, light, bg]` |
| `mood` | `string` | auto | Temperament: `happy` `angry` `sleepy` `surprised` `chill` |
| `species` | `string` | auto | Clade: `rex` `triceratops` `stego` `raptor` `bronto` |

When `mood` or `species` are omitted, the hash determines them — fully deterministic, no dice rolls.

### Web Component Attributes

| Attribute | Description |
|-----------|-------------|
| `name` | String to hatch a dino from |
| `size` | Pixel size (default: `48`) |
| `variant` | `gradient` or `solid` |
| `show-initial` | Show first letter overlay |
| `colors` | JSON array of 4 hex colors |
| `mood` | `happy` `angry` `sleepy` `surprised` `chill` |
| `species` | `rex` `triceratops` `stego` `raptor` `bronto` |
| `no-hover` | Disable hover animation |

## How It Works

Avataurus runs your string through three hash functions (FNV-1a, DJB2, SDBM) and extracts bits to select from 13 independent trait layers: head shape, spikes, eyes, eyebrows, mouth, nose, cheeks, ears, face markings, accessories, belly patch, tail, and background pattern.

The result is a unique phenotype from a genome of 1.7 billion+ combinations. No API calls, no storage, no randomness — the string *is* the identity.

## Runs Everywhere

- **Browser:** Any modern browser (ES2020+)
- **Node.js:** 18+
- **Edge:** Cloudflare Workers, Deno, Bun

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](./LICENSE) © mladen

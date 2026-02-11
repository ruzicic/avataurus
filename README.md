# 🦕 Avataurus

Deterministic avatar generator — unique, dinosaur-inspired faces from any string. Same input = same face.

## Usage

### Image URL (Cloudflare Worker)

```html
<img src="https://avataurus.workers.dev/john" width="48" height="48" />
<img src="https://avataurus.workers.dev/john?size=128&variant=solid" />
```

### Web Component

```html
<script type="module" src="https://unpkg.com/avataurus/src/element.js"></script>

<avatar-us name="john" size="48"></avatar-us>
<avatar-us name="jane" size="64" variant="solid" show-initial></avatar-us>
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

## License

MIT

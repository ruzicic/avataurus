/**
 * Avataurus — Deterministic avatar generator
 * Generates unique dinosaur-themed avatar faces from any string.
 * Same input = same face. No dependencies, no external assets.
 */

// --- Hash Function (FNV-1a) ---
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

// Extract N bits from hash starting at offset
function bits(hash, offset, count) {
  return (hash >>> offset) & ((1 << count) - 1);
}

// Generate a second hash for more entropy
function hash2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// --- Color Palettes ---
const PALETTES = [
  // Warm sunset
  ['#FF6B6B', '#FF8E72', '#FFD93D', '#FFF3B0'],
  // Ocean breeze
  ['#4ECDC4', '#45B7D1', '#96E6A1', '#DDF5DD'],
  // Berry fields
  ['#A855F7', '#C084FC', '#E879F9', '#FAE8FF'],
  // Forest moss
  ['#22C55E', '#4ADE80', '#86EFAC', '#DCFCE7'],
  // Amber glow
  ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'],
  // Coral reef
  ['#FB7185', '#FDA4AF', '#FECDD3', '#FFF1F2'],
  // Arctic blue
  ['#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE'],
  // Lavender dream
  ['#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'],
  // Mint fresh
  ['#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  // Peach blossom
  ['#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'],
  // Steel blue
  ['#6366F1', '#818CF8', '#A5B4FC', '#E0E7FF'],
  // Rose gold
  ['#E11D48', '#F43F5E', '#FB7185', '#FFE4E6'],
  // Teal depths
  ['#14B8A6', '#2DD4BF', '#5EEAD4', '#CCFBF1'],
  // Plum
  ['#9333EA', '#A855F7', '#C084FC', '#F3E8FF'],
  // Lime zest
  ['#84CC16', '#A3E635', '#BEF264', '#ECFCCB'],
  // Dino green
  ['#15803D', '#22C55E', '#4ADE80', '#BBF7D0'],
];

// --- Head Shapes (SVG paths for dino-ish heads) ---
function headShape(idx, size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const shapes = [
    // Round
    () => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`,
    // Slightly squashed
    () => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.9}"/>`,
    // Wider
    () => `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.05}" ry="${r * 0.88}"/>`,
    // Rounded rect
    () => {
      const w = r * 1.8, h = r * 1.7;
      return `<rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" rx="${r * 0.45}"/>`;
    },
    // Egg shape (taller)
    () => `<ellipse cx="${cx}" cy="${cy * 1.02}" rx="${r * 0.9}" ry="${r * 1.02}"/>`,
    // Diamond-ish rounded
    () => {
      const s = r * 0.95;
      return `<rect x="${cx - s}" y="${cy - s}" width="${s*2}" height="${s*2}" rx="${s * 0.4}" transform="rotate(45 ${cx} ${cy})"/>`;
    },
  ];
  return shapes[idx % shapes.length]();
}

// --- Spikes/Horns (dino theme!) ---
function spikes(idx, size, color) {
  const cx = size / 2;
  const r = size * 0.38;
  const top = cx - r;
  const variants = [
    // Three top spikes
    () => {
      const s = size * 0.08;
      return [
        `<polygon points="${cx - s*2},${top + s*0.5} ${cx - s},${top - s*2} ${cx},${top + s*0.5}"/>`,
        `<polygon points="${cx - s*0.5},${top - s*0.2} ${cx},${top - s*3} ${cx + s*0.5},${top - s*0.2}"/>`,
        `<polygon points="${cx},${top + s*0.5} ${cx + s},${top - s*2} ${cx + s*2},${top + s*0.5}"/>`,
      ].join('');
    },
    // Two horns
    () => {
      const s = size * 0.07;
      return [
        `<polygon points="${cx - r*0.4 - s},${top + s*2} ${cx - r*0.4},${top - s*2.5} ${cx - r*0.4 + s},${top + s*2}"/>`,
        `<polygon points="${cx + r*0.4 - s},${top + s*2} ${cx + r*0.4},${top - s*2.5} ${cx + r*0.4 + s},${top + s*2}"/>`,
      ].join('');
    },
    // Single horn (unicorn-dino)
    () => {
      const s = size * 0.06;
      return `<polygon points="${cx - s},${top + s} ${cx},${top - s*4} ${cx + s},${top + s}"/>`;
    },
    // Side frills
    () => {
      const s = size * 0.06;
      const left = cx - r;
      const right = cx + r;
      return [
        `<circle cx="${left}" cy="${cx - s*2}" r="${s*1.3}"/>`,
        `<circle cx="${left - s*0.5}" cy="${cx + s}" r="${s}"/>`,
        `<circle cx="${right}" cy="${cx - s*2}" r="${s*1.3}"/>`,
        `<circle cx="${right + s*0.5}" cy="${cx + s}" r="${s}"/>`,
      ].join('');
    },
    // Crown spikes (5)
    () => {
      const s = size * 0.055;
      const pts = [];
      for (let i = -2; i <= 2; i++) {
        const x = cx + i * s * 1.5;
        const h = i === 0 ? s * 3 : s * 2;
        pts.push(`<polygon points="${x - s*0.5},${top + s} ${x},${top - h} ${x + s*0.5},${top + s}"/>`);
      }
      return pts.join('');
    },
    // No spikes (friendly)
    () => '',
  ];
  const svg = variants[idx % variants.length]();
  return svg ? `<g fill="${color}" opacity="0.85">${svg}</g>` : '';
}

// --- Eyes ---
function eyes(idx, size, darkColor) {
  const cx = size / 2;
  const cy = size / 2;
  const eyeSpacing = size * 0.14;
  const eyeY = cy - size * 0.02;
  const lx = cx - eyeSpacing;
  const rx = cx + eyeSpacing;
  const s = size * 0.05;

  const variants = [
    // Round eyes with pupils
    () => [
      `<circle cx="${lx}" cy="${eyeY}" r="${s*1.3}" fill="white"/>`,
      `<circle cx="${lx + s*0.2}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/>`,
      `<circle cx="${lx + s*0.4}" cy="${eyeY - s*0.2}" r="${s*0.25}" fill="white"/>`,
      `<circle cx="${rx}" cy="${eyeY}" r="${s*1.3}" fill="white"/>`,
      `<circle cx="${rx + s*0.2}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/>`,
      `<circle cx="${rx + s*0.4}" cy="${eyeY - s*0.2}" r="${s*0.25}" fill="white"/>`,
    ].join(''),
    // Oval eyes
    () => [
      `<ellipse cx="${lx}" cy="${eyeY}" rx="${s*1.1}" ry="${s*1.4}" fill="white"/>`,
      `<circle cx="${lx}" cy="${eyeY + s*0.15}" r="${s*0.6}" fill="${darkColor}"/>`,
      `<ellipse cx="${rx}" cy="${eyeY}" rx="${s*1.1}" ry="${s*1.4}" fill="white"/>`,
      `<circle cx="${rx}" cy="${eyeY + s*0.15}" r="${s*0.6}" fill="${darkColor}"/>`,
    ].join(''),
    // Dot eyes (cute)
    () => [
      `<circle cx="${lx}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/>`,
      `<circle cx="${lx + s*0.2}" cy="${eyeY - s*0.2}" r="${s*0.2}" fill="white"/>`,
      `<circle cx="${rx}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/>`,
      `<circle cx="${rx + s*0.2}" cy="${eyeY - s*0.2}" r="${s*0.2}" fill="white"/>`,
    ].join(''),
    // Happy closed eyes
    () => [
      `<path d="M${lx - s} ${eyeY} Q${lx} ${eyeY - s*1.5} ${lx + s} ${eyeY}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
      `<path d="M${rx - s} ${eyeY} Q${rx} ${eyeY - s*1.5} ${rx + s} ${eyeY}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
    ].join(''),
    // Big round eyes
    () => [
      `<circle cx="${lx}" cy="${eyeY}" r="${s*1.5}" fill="white"/>`,
      `<circle cx="${lx + s*0.15}" cy="${eyeY + s*0.1}" r="${s*0.85}" fill="${darkColor}"/>`,
      `<circle cx="${lx + s*0.45}" cy="${eyeY - s*0.3}" r="${s*0.3}" fill="white"/>`,
      `<circle cx="${rx}" cy="${eyeY}" r="${s*1.5}" fill="white"/>`,
      `<circle cx="${rx + s*0.15}" cy="${eyeY + s*0.1}" r="${s*0.85}" fill="${darkColor}"/>`,
      `<circle cx="${rx + s*0.45}" cy="${eyeY - s*0.3}" r="${s*0.3}" fill="white"/>`,
    ].join(''),
    // Sleepy eyes
    () => [
      `<ellipse cx="${lx}" cy="${eyeY}" rx="${s*1.2}" ry="${s*0.7}" fill="white"/>`,
      `<circle cx="${lx}" cy="${eyeY + s*0.1}" r="${s*0.45}" fill="${darkColor}"/>`,
      `<ellipse cx="${rx}" cy="${eyeY}" rx="${s*1.2}" ry="${s*0.7}" fill="white"/>`,
      `<circle cx="${rx}" cy="${eyeY + s*0.1}" r="${s*0.45}" fill="${darkColor}"/>`,
    ].join(''),
    // Winking
    () => [
      `<circle cx="${lx}" cy="${eyeY}" r="${s*1.3}" fill="white"/>`,
      `<circle cx="${lx + s*0.2}" cy="${eyeY}" r="${s*0.65}" fill="${darkColor}"/>`,
      `<path d="M${rx - s} ${eyeY} Q${rx} ${eyeY - s*1.2} ${rx + s} ${eyeY}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
    ].join(''),
    // Star eyes
    () => {
      function star(x, y, r) {
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const a1 = (i * 72 - 90) * Math.PI / 180;
          const a2 = ((i * 72) + 36 - 90) * Math.PI / 180;
          pts.push(`${x + r * Math.cos(a1)},${y + r * Math.sin(a1)}`);
          pts.push(`${x + r*0.45 * Math.cos(a2)},${y + r*0.45 * Math.sin(a2)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="${darkColor}"/>`;
      }
      return star(lx, eyeY, s*1.1) + star(rx, eyeY, s*1.1);
    },
  ];
  return variants[idx % variants.length]();
}

// --- Mouth ---
function mouth(idx, size, darkColor) {
  const cx = size / 2;
  const cy = size / 2;
  const my = cy + size * 0.1;
  const s = size * 0.05;

  const variants = [
    // Smile
    () => `<path d="M${cx - s*2} ${my} Q${cx} ${my + s*2.5} ${cx + s*2} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
    // Open smile
    () => `<path d="M${cx - s*1.8} ${my} Q${cx} ${my + s*2.5} ${cx + s*1.8} ${my} Z" fill="${darkColor}" opacity="0.8"/>`,
    // Toothy grin (dino!)
    () => [
      `<path d="M${cx - s*2} ${my} Q${cx} ${my + s*2.5} ${cx + s*2} ${my} Z" fill="${darkColor}" opacity="0.7"/>`,
      `<path d="M${cx - s*1.2} ${my + s*0.2} L${cx - s*0.6} ${my + s*0.8} L${cx} ${my + s*0.2} L${cx + s*0.6} ${my + s*0.8} L${cx + s*1.2} ${my + s*0.2}" fill="white" stroke="none"/>`,
    ].join(''),
    // Small o
    () => `<ellipse cx="${cx}" cy="${my + s*0.5}" rx="${s*0.7}" ry="${s*0.9}" fill="${darkColor}" opacity="0.6"/>`,
    // Flat line
    () => `<line x1="${cx - s*1.5}" y1="${my + s*0.3}" x2="${cx + s*1.5}" y2="${my + s*0.3}" stroke="${darkColor}" stroke-width="${s*0.35}" stroke-linecap="round"/>`,
    // Tongue out
    () => [
      `<path d="M${cx - s*1.8} ${my} Q${cx} ${my + s*2} ${cx + s*1.8} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
      `<ellipse cx="${cx + s*0.3}" cy="${my + s*1.5}" rx="${s*0.6}" ry="${s*0.8}" fill="#FF6B6B" opacity="0.7"/>`,
    ].join(''),
    // Cat mouth
    () => [
      `<path d="M${cx - s*0.1} ${my + s*0.3} Q${cx - s*1.5} ${my + s*2} ${cx - s*2.5} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.35}" stroke-linecap="round"/>`,
      `<path d="M${cx + s*0.1} ${my + s*0.3} Q${cx + s*1.5} ${my + s*2} ${cx + s*2.5} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.35}" stroke-linecap="round"/>`,
    ].join(''),
    // Smirk
    () => `<path d="M${cx - s*1} ${my + s*0.5} Q${cx + s*0.5} ${my + s*2} ${cx + s*2} ${my - s*0.2}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
  ];
  return variants[idx % variants.length]();
}

// --- Nose ---
function nose(idx, size, darkColor) {
  const cx = size / 2;
  const cy = size / 2;
  const ny = cy + size * 0.03;
  const s = size * 0.025;

  const variants = [
    // Two dots
    () => [
      `<circle cx="${cx - s*1.2}" cy="${ny}" r="${s*0.8}" fill="${darkColor}" opacity="0.4"/>`,
      `<circle cx="${cx + s*1.2}" cy="${ny}" r="${s*0.8}" fill="${darkColor}" opacity="0.4"/>`,
    ].join(''),
    // Triangle
    () => `<polygon points="${cx},${ny - s} ${cx - s*1.2},${ny + s} ${cx + s*1.2},${ny + s}" fill="${darkColor}" opacity="0.3"/>`,
    // Small bump
    () => `<ellipse cx="${cx}" cy="${ny}" rx="${s*1.2}" ry="${s*0.7}" fill="${darkColor}" opacity="0.2"/>`,
    // No visible nose
    () => '',
    // Snout dots
    () => `<circle cx="${cx}" cy="${ny}" r="${s*0.6}" fill="${darkColor}" opacity="0.3"/>`,
  ];
  return variants[idx % variants.length]();
}

// --- Cheeks ---
function cheeks(idx, size, color) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const s = size * 0.06;

  if (idx % 3 === 0) return ''; // no cheeks

  return [
    `<circle cx="${cx - r * 0.6}" cy="${cy + size*0.05}" r="${s}" fill="${color}" opacity="0.3"/>`,
    `<circle cx="${cx + r * 0.6}" cy="${cy + size*0.05}" r="${s}" fill="${color}" opacity="0.3"/>`,
  ].join('');
}

// --- Background pattern ---
function bgPattern(idx, size, color) {
  const variants = [
    // Subtle dots
    () => {
      let dots = '';
      const step = size / 6;
      for (let x = step; x < size; x += step) {
        for (let y = step; y < size; y += step) {
          dots += `<circle cx="${x}" cy="${y}" r="${size*0.008}" fill="${color}" opacity="0.15"/>`;
        }
      }
      return dots;
    },
    // Nothing
    () => '',
    // Corner accent
    () => `<circle cx="0" cy="0" r="${size*0.15}" fill="${color}" opacity="0.1"/>`,
    // Nothing
    () => '',
  ];
  return variants[idx % variants.length]();
}

// --- Main Generator ---
function generateAvatar(name, options = {}) {
  const {
    size = 128,
    colors = null,
    showInitial = false,
    variant = 'gradient', // 'gradient' or 'solid'
  } = options;

  const h1 = fnv1a(name || 'anonymous');
  const h2 = hash2(name || 'anonymous');

  // Pick palette
  const paletteIdx = h1 % PALETTES.length;
  const palette = colors || PALETTES[paletteIdx];
  const mainColor = palette[0];
  const secondColor = palette[1];
  const lightColor = palette[2];
  const bgLight = palette[3];

  // Dark color for features
  const darkColor = '#2D3436';

  // Feature indices from hash bits
  const headIdx = bits(h1, 0, 3);
  const eyeIdx = bits(h1, 3, 3);
  const mouthIdx = bits(h1, 6, 3);
  const noseIdx = bits(h1, 9, 3);
  const spikeIdx = bits(h1, 12, 3);
  const cheekIdx = bits(h2, 0, 2);
  const bgIdx = bits(h2, 2, 2);
  const rotateSpikes = bits(h2, 4, 1);

  // Build SVG
  const gradientId = `grad_${h1}`;
  const bgGradId = `bg_${h1}`;

  let defs = '';
  if (variant === 'gradient') {
    const angle = (bits(h2, 5, 3) / 7) * 360;
    const rad = angle * Math.PI / 180;
    const x1 = 50 + Math.cos(rad) * 50;
    const y1 = 50 + Math.sin(rad) * 50;
    const x2 = 50 - Math.cos(rad) * 50;
    const y2 = 50 - Math.sin(rad) * 50;
    defs = `
      <defs>
        <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${mainColor}"/>
          <stop offset="100%" stop-color="${secondColor}"/>
        </linearGradient>
        <linearGradient id="${bgGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgLight}"/>
          <stop offset="100%" stop-color="${lightColor}" stop-opacity="0.5"/>
        </linearGradient>
      </defs>`;
  } else {
    defs = `
      <defs>
        <linearGradient id="${bgGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgLight}"/>
          <stop offset="100%" stop-color="${lightColor}" stop-opacity="0.5"/>
        </linearGradient>
      </defs>`;
  }

  const headFill = variant === 'gradient' ? `url(#${gradientId})` : mainColor;

  // Background
  const bgSvg = `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#${bgGradId})"/>`;
  const bgPatternSvg = bgPattern(bgIdx, size, mainColor);

  // Head
  const headSvg = `<g fill="${headFill}">${headShape(headIdx, size)}</g>`;

  // Spikes
  const spikesSvg = spikes(spikeIdx, size, secondColor);

  // Face features
  const eyesSvg = eyes(eyeIdx, size, darkColor);
  const noseSvg = nose(noseIdx, size, darkColor);
  const mouthSvg = mouth(mouthIdx, size, darkColor);
  const cheeksSvg = cheeks(cheekIdx, size, lightColor);

  // Initial letter
  let initialSvg = '';
  if (showInitial && name) {
    const letter = name.charAt(0).toUpperCase();
    const fontSize = size * 0.14;
    initialSvg = `<text x="${size/2}" y="${size - size*0.08}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="${darkColor}" opacity="0.5">${letter}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${defs}
${bgSvg}
${bgPatternSvg}
${spikesSvg}
${headSvg}
${eyesSvg}
${noseSvg}
${mouthSvg}
${cheeksSvg}
${initialSvg}
</svg>`;
}

// ESM export
export { generateAvatar, fnv1a };
export default generateAvatar;

#!/usr/bin/env node
/**
 * Proposal C-v2: "Minimal Face" improved
 * Modern muted palette, better proportions, more variety, cheek blush.
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seeds = ['alice', 'bob', 'charlie', 'dave', 'eve', 'frank', 'grace', 'heidi', 'ivan', 'judy'];

function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}
function hash2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}
function bits(hash, offset, count) {
  return (hash >>> offset) & ((1 << count) - 1);
}

// Modern muted backgrounds — slate, stone, zinc, sage, dusty rose, taupe
const PALETTES = [
  { bg: '#64748b', blush: '#c4a6a0' }, // slate-500
  { bg: '#78716c', blush: '#d4a9a0' }, // stone-500
  { bg: '#71717a', blush: '#c9a0a8' }, // zinc-500
  { bg: '#6b8f71', blush: '#c9b5a0' }, // sage
  { bg: '#8b7e74', blush: '#d4a8a0' }, // warm taupe
  { bg: '#7c8594', blush: '#c9a5a5' }, // cool gray-blue
  { bg: '#8b6f6f', blush: '#d4b0a0' }, // dusty rose
  { bg: '#6b7c6b', blush: '#c4afa0' }, // muted green
  { bg: '#7a7589', blush: '#c9a5b5' }, // muted purple
  { bg: '#8c8278', blush: '#d4aea0' }, // warm gray
  { bg: '#5f7a8a', blush: '#c0a8a8' }, // steel blue
  { bg: '#7a6b5d', blush: '#d4b5a5' }, // brown-taupe
];

function generate(seed, colors) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);

  const palette = colors || PALETTES[h1 % PALETTES.length];
  const bg = palette.bg;
  const blushColor = palette.blush;
  const faceColor = '#f5f0eb';
  const featureColor = '#2d2a27';
  const cx = 64, cy = 64;

  // Face shapes — all clearly face-shaped
  const faceIdx = bits(h1, 4, 3) % 5;
  const faceShapes = [
    `<circle cx="${cx}" cy="${cy + 4}" r="36" fill="${faceColor}"/>`,
    `<ellipse cx="${cx}" cy="${cy + 4}" rx="32" ry="38" fill="${faceColor}"/>`,
    `<ellipse cx="${cx}" cy="${cy + 4}" rx="38" ry="34" fill="${faceColor}"/>`,
    `<rect x="30" y="28" width="68" height="74" rx="28" fill="${faceColor}"/>`,
    `<rect x="28" y="30" width="72" height="70" rx="30" fill="${faceColor}"/>`,
  ];

  // Cheek blush
  const blushOpacity = 0.25 + (bits(h2, 10, 3) / 7) * 0.2;
  const blush = `<circle cx="${cx - 20}" cy="${cy + 12}" r="9" fill="${blushColor}" opacity="${blushOpacity.toFixed(2)}"/>
    <circle cx="${cx + 20}" cy="${cy + 12}" r="9" fill="${blushColor}" opacity="${blushOpacity.toFixed(2)}"/>`;

  // Eyes
  const eyeType = bits(h1, 7, 3) % 6;
  const eyeSpacing = 13 + bits(h2, 0, 2) * 2;
  const lx = cx - eyeSpacing, rx2 = cx + eyeSpacing;
  const ey = cy - 2;

  const eyeSets = [
    // Round dots
    `<circle cx="${lx}" cy="${ey}" r="4" fill="${featureColor}"/>
     <circle cx="${rx2}" cy="${ey}" r="4" fill="${featureColor}"/>`,
    // Dots with highlight
    `<circle cx="${lx}" cy="${ey}" r="4.5" fill="${featureColor}"/>
     <circle cx="${lx + 1}" cy="${ey - 1}" r="1.5" fill="white" opacity="0.6"/>
     <circle cx="${rx2}" cy="${ey}" r="4.5" fill="${featureColor}"/>
     <circle cx="${rx2 + 1}" cy="${ey - 1}" r="1.5" fill="white" opacity="0.6"/>`,
    // Open circles with pupils
    `<circle cx="${lx}" cy="${ey}" r="6" fill="white" stroke="${featureColor}" stroke-width="1.5"/>
     <circle cx="${lx + 1}" cy="${ey + 0.5}" r="3" fill="${featureColor}"/>
     <circle cx="${rx2}" cy="${ey}" r="6" fill="white" stroke="${featureColor}" stroke-width="1.5"/>
     <circle cx="${rx2 + 1}" cy="${ey + 0.5}" r="3" fill="${featureColor}"/>`,
    // Happy closed (arcs)
    `<path d="M${lx - 5} ${ey} A5 5 0 0 0 ${lx + 5} ${ey}" fill="none" stroke="${featureColor}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M${rx2 - 5} ${ey} A5 5 0 0 0 ${rx2 + 5} ${ey}" fill="none" stroke="${featureColor}" stroke-width="2.5" stroke-linecap="round"/>`,
    // Oval eyes
    `<ellipse cx="${lx}" cy="${ey}" rx="5" ry="4" fill="${featureColor}"/>
     <circle cx="${lx + 1}" cy="${ey}" r="1.5" fill="white" opacity="0.5"/>
     <ellipse cx="${rx2}" cy="${ey}" rx="5" ry="4" fill="${featureColor}"/>
     <circle cx="${rx2 + 1}" cy="${ey}" r="1.5" fill="white" opacity="0.5"/>`,
    // Small dots (subtle)
    `<circle cx="${lx}" cy="${ey}" r="3" fill="${featureColor}"/>
     <circle cx="${rx2}" cy="${ey}" r="3" fill="${featureColor}"/>`,
  ];

  // Nose — subtle
  const noseType = bits(h1, 10, 2);
  const ny = cy + 8;
  const noses = [
    '',
    `<line x1="${cx}" y1="${ny - 3}" x2="${cx}" y2="${ny + 3}" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>`,
    `<circle cx="${cx}" cy="${ny}" r="2" fill="${featureColor}" opacity="0.3"/>`,
    `<path d="M${cx - 2} ${ny + 2} Q${cx} ${ny - 2} ${cx + 2} ${ny + 2}" fill="none" stroke="${featureColor}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>`,
  ];

  // Mouth
  const mouthType = bits(h1, 12, 3) % 6;
  const my = cy + 18;
  const mouths = [
    // Gentle smile
    `<path d="M${cx - 10} ${my} Q${cx} ${my + 8} ${cx + 10} ${my}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Straight line
    `<line x1="${cx - 7}" y1="${my + 1}" x2="${cx + 7}" y2="${my + 1}" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Small O
    `<ellipse cx="${cx}" cy="${my + 2}" rx="4" ry="3.5" fill="none" stroke="${featureColor}" stroke-width="1.5"/>`,
    // Wide smile
    `<path d="M${cx - 12} ${my - 1} Q${cx} ${my + 10} ${cx + 12} ${my - 1}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Tiny smile
    `<path d="M${cx - 5} ${my + 1} Q${cx} ${my + 5} ${cx + 5} ${my + 1}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Slight smirk
    `<path d="M${cx - 8} ${my + 2} Q${cx + 2} ${my + 7} ${cx + 8} ${my}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
  ];

  // Eyebrows (50% chance)
  const browType = bits(h2, 3, 2);
  const by = ey - 9;
  const brows = [
    '',
    '',
    `<line x1="${lx - 4}" y1="${by}" x2="${lx + 4}" y2="${by - 1}" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
     <line x1="${rx2 - 4}" y1="${by - 1}" x2="${rx2 + 4}" y2="${by}" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`,
    `<path d="M${lx - 5} ${by + 1} Q${lx} ${by - 3} ${lx + 5} ${by}" fill="none" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
     <path d="M${rx2 - 5} ${by} Q${rx2} ${by - 3} ${rx2 + 5} ${by + 1}" fill="none" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`,
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" fill="${bg}" rx="0"/>
${faceShapes[faceIdx]}
${blush}
${brows[browType]}
${eyeSets[eyeType]}
${noses[noseType]}
${mouths[mouthType]}
</svg>`;
}

for (const seed of seeds) {
  const svg = generate(seed);
  writeFileSync(join(__dirname, `c-v2-minimal-face-${seed}.svg`), svg);
  console.log(`  → c-v2-minimal-face-${seed}.svg`);
}

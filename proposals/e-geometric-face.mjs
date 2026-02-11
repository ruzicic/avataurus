#!/usr/bin/env node
/**
 * Proposal E: "Geometric Face"
 * Bauhaus-inspired faces with angular/geometric features.
 * Still clearly recognizable as faces.
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

const BG_COLORS = [
  '#475569', '#57534e', '#52525b', '#5b7a5e', '#6b6058',
  '#5a6b7a', '#6b5a5a', '#5a6b5a', '#645a6b', '#6b6560',
  '#4a6670', '#5e5548',
];

function generate(seed) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);

  const bg = BG_COLORS[h1 % BG_COLORS.length];
  const faceColor = '#ede8e3';
  const feat = '#2a2725';
  const accent = '#9a8f85'; // mid-tone for secondary features
  const cx = 64, cy = 64;

  // Face — geometric shapes that still read as faces
  const faceIdx = bits(h1, 3, 3) % 5;
  const faces = [
    // Rounded square
    `<rect x="28" y="26" width="72" height="78" rx="24" fill="${faceColor}"/>`,
    // Circle
    `<circle cx="${cx}" cy="${cy + 4}" r="38" fill="${faceColor}"/>`,
    // Hexagon-ish
    `<path d="M44 26 L84 26 L100 64 L84 102 L44 102 L28 64 Z" fill="${faceColor}"/>`,
    // Rounded trapezoid (wider at top)
    `<path d="M30 36 Q30 26 40 26 L88 26 Q98 26 98 36 L94 96 Q94 106 84 106 L44 106 Q34 106 34 96 Z" fill="${faceColor}"/>`,
    // Egg shape
    `<ellipse cx="${cx}" cy="${cy + 6}" rx="34" ry="40" fill="${faceColor}"/>`,
  ];

  // Eyes — geometric: diamonds, squares, triangles
  const eyeType = bits(h1, 6, 3) % 6;
  const esp = 14 + bits(h2, 0, 2) * 2;
  const lx = cx - esp, rx = cx + esp;
  const ey = cy - 2;

  const eyeOptions = [
    // Diamond eyes
    `<polygon points="${lx},${ey - 5} ${lx + 5},${ey} ${lx},${ey + 5} ${lx - 5},${ey}" fill="${feat}"/>
     <polygon points="${rx},${ey - 5} ${rx + 5},${ey} ${rx},${ey + 5} ${rx - 5},${ey}" fill="${feat}"/>`,
    // Square eyes
    `<rect x="${lx - 4}" y="${ey - 4}" width="8" height="8" fill="${feat}"/>
     <rect x="${rx - 4}" y="${ey - 4}" width="8" height="8" fill="${feat}"/>`,
    // Triangle eyes (pointing down)
    `<polygon points="${lx - 5},${ey - 3} ${lx + 5},${ey - 3} ${lx},${ey + 4}" fill="${feat}"/>
     <polygon points="${rx - 5},${ey - 3} ${rx + 5},${ey - 3} ${rx},${ey + 4}" fill="${feat}"/>`,
    // Circle with square pupil
    `<circle cx="${lx}" cy="${ey}" r="6" fill="white" stroke="${feat}" stroke-width="1.5"/>
     <rect x="${lx - 2}" y="${ey - 2}" width="4" height="4" fill="${feat}"/>
     <circle cx="${rx}" cy="${ey}" r="6" fill="white" stroke="${feat}" stroke-width="1.5"/>
     <rect x="${rx - 2}" y="${ey - 2}" width="4" height="4" fill="${feat}"/>`,
    // Horizontal rectangles
    `<rect x="${lx - 6}" y="${ey - 2}" width="12" height="5" rx="1" fill="${feat}"/>
     <rect x="${rx - 6}" y="${ey - 2}" width="12" height="5" rx="1" fill="${feat}"/>`,
    // Small diamonds
    `<polygon points="${lx},${ey - 4} ${lx + 4},${ey} ${lx},${ey + 4} ${lx - 4},${ey}" fill="${feat}"/>
     <circle cx="${lx}" cy="${ey}" r="1.5" fill="white" opacity="0.5"/>
     <polygon points="${rx},${ey - 4} ${rx + 4},${ey} ${rx},${ey + 4} ${rx - 4},${ey}" fill="${feat}"/>
     <circle cx="${rx}" cy="${ey}" r="1.5" fill="white" opacity="0.5"/>`,
  ];

  // Nose — angular/geometric
  const noseType = bits(h1, 9, 2);
  const ny = cy + 8;
  const noses = [
    `<polygon points="${cx},${ny - 4} ${cx + 3},${ny + 3} ${cx - 3},${ny + 3}" fill="${feat}" opacity="0.35"/>`,
    `<line x1="${cx}" y1="${ny - 4}" x2="${cx}" y2="${ny + 3}" stroke="${feat}" stroke-width="2" stroke-linecap="square" opacity="0.35"/>`,
    `<rect x="${cx - 1.5}" y="${ny - 2}" width="3" height="5" fill="${feat}" opacity="0.3"/>`,
    '',
  ];

  // Mouth — geometric arcs and lines
  const mouthType = bits(h1, 11, 3) % 5;
  const my = cy + 19;
  const mouths = [
    // Arc smile
    `<path d="M${cx - 10} ${my} Q${cx} ${my + 8} ${cx + 10} ${my}" fill="none" stroke="${feat}" stroke-width="2" stroke-linecap="round"/>`,
    // Straight line
    `<line x1="${cx - 8}" y1="${my + 1}" x2="${cx + 8}" y2="${my + 1}" stroke="${feat}" stroke-width="2" stroke-linecap="square"/>`,
    // Angular smile (V-shape)
    `<polyline points="${cx - 9},${my} ${cx},${my + 6} ${cx + 9},${my}" fill="none" stroke="${feat}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`,
    // Small rectangle mouth
    `<rect x="${cx - 6}" y="${my}" width="12" height="5" rx="1" fill="${feat}" opacity="0.7"/>`,
    // Zigzag
    `<polyline points="${cx - 8},${my + 2} ${cx - 3},${my - 1} ${cx + 3},${my + 4} ${cx + 8},${my + 1}" fill="none" stroke="${feat}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  ];

  // Geometric brows
  const browType = bits(h2, 2, 2);
  const by = ey - 10;
  const brows = [
    '',
    `<line x1="${lx - 5}" y1="${by}" x2="${lx + 5}" y2="${by - 2}" stroke="${feat}" stroke-width="2" stroke-linecap="square" opacity="0.5"/>
     <line x1="${rx - 5}" y1="${by - 2}" x2="${rx + 5}" y2="${by}" stroke="${feat}" stroke-width="2" stroke-linecap="square" opacity="0.5"/>`,
    `<rect x="${lx - 5}" y="${by - 1}" width="10" height="2" fill="${feat}" opacity="0.5"/>
     <rect x="${rx - 5}" y="${by - 1}" width="10" height="2" fill="${feat}" opacity="0.5"/>`,
    '',
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" fill="${bg}"/>
${faces[faceIdx]}
${brows[browType]}
${eyeOptions[eyeType]}
${noses[noseType]}
${mouths[mouthType]}
</svg>`;
}

for (const seed of seeds) {
  const svg = generate(seed);
  writeFileSync(join(__dirname, `e-geometric-face-${seed}.svg`), svg);
  console.log(`  → e-geometric-face-${seed}.svg`);
}

#!/usr/bin/env node
// Proposal G: "Eyes Only" - closest to facehash.dev
// Colored square bg + eyes only + radial gradient for depth

import { writeFileSync } from 'fs';

const SEEDS = ['alice','bob','charlie','dave','eve','frank','grace','heidi','ivan','judy'];

const PALETTE = [
  '#264653','#2A9D8F','#E9C46A','#F4A261','#E76F51',
  '#606C38','#283618','#FEFAE0','#DDA15E','#BC6C25',
  '#003049','#D62828','#F77F00','#FCBF49','#EAE2B7',
  '#5F0F40','#9A031E','#FB8B24','#E36414','#0F4C5C',
  '#335C67','#FFF3B0','#E09F3E','#9E2A2B','#540B0E',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick(h, n, arr) { return arr[(h * n + 7) % arr.length]; }
function range(h, n, min, max) { return min + ((h * n + 13) % 97) / 96 * (max - min); }

// Eye types: each returns SVG for both eyes
const eyeTypes = [
  // 0: round dots
  (cx, cy, spacing, size, color) => {
    const r = size * 0.5;
    return `<circle cx="${cx - spacing}" cy="${cy}" r="${r}" fill="${color}"/>
            <circle cx="${cx + spacing}" cy="${cy}" r="${r}" fill="${color}"/>`;
  },
  // 1: oval/ellipse
  (cx, cy, spacing, size, color) => {
    const rx = size * 0.55, ry = size * 0.35;
    return `<ellipse cx="${cx - spacing}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}"/>
            <ellipse cx="${cx + spacing}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}"/>`;
  },
  // 2: half-moon (happy) - curved arcs
  (cx, cy, spacing, size, color) => {
    const r = size * 0.45;
    return `<path d="M${cx-spacing-r},${cy} A${r},${r} 0 0,1 ${cx-spacing+r},${cy}" fill="none" stroke="${color}" stroke-width="${size*0.22}" stroke-linecap="round"/>
            <path d="M${cx+spacing-r},${cy} A${r},${r} 0 0,1 ${cx+spacing+r},${cy}" fill="none" stroke="${color}" stroke-width="${size*0.22}" stroke-linecap="round"/>`;
  },
  // 3: line eyes (horizontal dashes)
  (cx, cy, spacing, size, color) => {
    const w = size * 0.55;
    return `<line x1="${cx-spacing-w}" y1="${cy}" x2="${cx-spacing+w}" y2="${cy}" stroke="${color}" stroke-width="${size*0.25}" stroke-linecap="round"/>
            <line x1="${cx+spacing-w}" y1="${cy}" x2="${cx+spacing+w}" y2="${cy}" stroke="${color}" stroke-width="${size*0.25}" stroke-linecap="round"/>`;
  },
  // 4: diamond eyes
  (cx, cy, spacing, size, color) => {
    const s = size * 0.45;
    const diamond = (x, y) => `<polygon points="${x},${y-s} ${x+s},${y} ${x},${y+s} ${x-s},${y}" fill="${color}"/>`;
    return diamond(cx - spacing, cy) + diamond(cx + spacing, cy);
  },
  // 5: cross/X eyes
  (cx, cy, spacing, size, color) => {
    const s = size * 0.4, sw = size * 0.2;
    const cross = (x, y) => `<line x1="${x-s}" y1="${y-s}" x2="${x+s}" y2="${y+s}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <line x1="${x+s}" y1="${y-s}" x2="${x-s}" y2="${y+s}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
    return cross(cx - spacing, cy) + cross(cx + spacing, cy);
  },
  // 6: sleepy (downward arcs)
  (cx, cy, spacing, size, color) => {
    const r = size * 0.45;
    return `<path d="M${cx-spacing-r},${cy} A${r},${r} 0 0,0 ${cx-spacing+r},${cy}" fill="none" stroke="${color}" stroke-width="${size*0.22}" stroke-linecap="round"/>
            <path d="M${cx+spacing-r},${cy} A${r},${r} 0 0,0 ${cx+spacing+r},${cy}" fill="none" stroke="${color}" stroke-width="${size*0.22}" stroke-linecap="round"/>`;
  },
  // 7: small dots (beady eyes)
  (cx, cy, spacing, size, color) => {
    const r = size * 0.25;
    return `<circle cx="${cx - spacing}" cy="${cy}" r="${r}" fill="${color}"/>
            <circle cx="${cx + spacing}" cy="${cy}" r="${r}" fill="${color}"/>`;
  },
];

function generate(seed) {
  const h = hash(seed);
  const bg = PALETTE[h % PALETTE.length];
  const featureColor = '#1a1a2e';

  const eyeType = h % eyeTypes.length;
  const eyeSize = range(h, 3, 10, 18);
  const eyeSpacing = range(h, 5, 14, 24);
  const eyeY = range(h, 7, 50, 68);
  const cx = 64;

  const eyes = eyeTypes[eyeType](cx, eyeY, eyeSpacing, eyeSize, featureColor);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="${bg}"/>
  <radialGradient id="g${h}" cx="40%" cy="35%" r="60%">
    <stop offset="0%" stop-color="white" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.1"/>
  </radialGradient>
  <rect width="128" height="128" fill="url(#g${h})"/>
  ${eyes}
</svg>`;
}

const prefix = process.argv[2] || 'g-eyes-only';
for (const seed of SEEDS) {
  const svg = generate(seed);
  writeFileSync(`proposals/${prefix}-${seed}.svg`, svg);
}
console.log(`Generated ${SEEDS.length} SVGs for proposal G`);

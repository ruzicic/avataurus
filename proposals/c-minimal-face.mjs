#!/usr/bin/env node
/**
 * Proposal C: "Minimal Face"
 * Similar to facehash.dev. Simple face on colored background.
 * Eyes, mouth, nose as geometric shapes. Variation from shape combos, not colors.
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seeds = ['alice', 'bob', 'charlie', 'dave', 'eve'];

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

// Single accent colors for the background — warm, saturated
const BG_COLORS = [
  '#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653',
  '#D62828', '#457B9D', '#6D6875', '#B5838D', '#E5989B',
  '#6A994E', '#BC4749', '#A7C957', '#7209B7', '#4361EE',
];

function generate(seed) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);
  
  const bg = BG_COLORS[h1 % BG_COLORS.length];
  const faceColor = '#F5F0EB'; // Warm off-white for the face
  const featureColor = '#2D2D2D'; // Near-black for features
  
  const cx = 64, cy = 64;
  
  // Face shape
  const faceType = bits(h1, 4, 2);
  const faces = [
    `<circle cx="${cx}" cy="${cy+2}" r="38" fill="${faceColor}"/>`,
    `<ellipse cx="${cx}" cy="${cy+2}" rx="34" ry="40" fill="${faceColor}"/>`,
    `<rect x="28" y="26" width="72" height="76" rx="20" fill="${faceColor}"/>`,
    `<rect x="26" y="28" width="76" height="72" rx="22" fill="${faceColor}"/>`,
  ];
  
  // Subtle face shadow for 3D effect
  const shadowId = `sh_${h1}`;
  const shadow = `<defs><radialGradient id="${shadowId}" cx="40%" cy="35%"><stop offset="0%" stop-color="white" stop-opacity="0.3"/><stop offset="100%" stop-color="black" stop-opacity="0.08"/></radialGradient></defs>`;
  const faceOverlay = faceType < 2
    ? `<circle cx="${cx}" cy="${cy+2}" r="38" fill="url(#${shadowId})"/>`
    : `<rect x="${faceType===2?28:26}" y="${faceType===2?26:28}" width="${faceType===2?72:76}" height="${faceType===2?76:72}" rx="${faceType===2?20:22}" fill="url(#${shadowId})"/>`;
  
  // Eyes — the key differentiator
  const eyeType = bits(h1, 6, 3);
  const eyeSpacing = 12 + bits(h2, 0, 2) * 2; // 12-18
  const lx = cx - eyeSpacing, rx = cx + eyeSpacing;
  const ey = cy - 4;
  
  const eyeSets = [
    // Simple dots
    () => `<circle cx="${lx}" cy="${ey}" r="4" fill="${featureColor}"/>
           <circle cx="${rx}" cy="${ey}" r="4" fill="${featureColor}"/>`,
    // Small circles with pupils
    () => `<circle cx="${lx}" cy="${ey}" r="6" fill="white" stroke="${featureColor}" stroke-width="1.5"/>
           <circle cx="${lx+1}" cy="${ey}" r="2.5" fill="${featureColor}"/>
           <circle cx="${rx}" cy="${ey}" r="6" fill="white" stroke="${featureColor}" stroke-width="1.5"/>
           <circle cx="${rx+1}" cy="${ey}" r="2.5" fill="${featureColor}"/>`,
    // Horizontal lines (closed/happy)
    () => `<line x1="${lx-5}" y1="${ey}" x2="${lx+5}" y2="${ey}" stroke="${featureColor}" stroke-width="2.5" stroke-linecap="round"/>
           <line x1="${rx-5}" y1="${ey}" x2="${rx+5}" y2="${ey}" stroke="${featureColor}" stroke-width="2.5" stroke-linecap="round"/>`,
    // Tall ovals (surprised)
    () => `<ellipse cx="${lx}" cy="${ey}" rx="4" ry="6" fill="${featureColor}"/>
           <ellipse cx="${rx}" cy="${ey}" rx="4" ry="6" fill="${featureColor}"/>`,
    // Half circles (sleepy)
    () => `<path d="M${lx-5} ${ey} A5 5 0 0 1 ${lx+5} ${ey}" fill="${featureColor}"/>
           <path d="M${rx-5} ${ey} A5 5 0 0 1 ${rx+5} ${ey}" fill="${featureColor}"/>`,
    // Crosses
    () => `<line x1="${lx-3}" y1="${ey-3}" x2="${lx+3}" y2="${ey+3}" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>
           <line x1="${lx+3}" y1="${ey-3}" x2="${lx-3}" y2="${ey+3}" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>
           <line x1="${rx-3}" y1="${ey-3}" x2="${rx+3}" y2="${ey+3}" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>
           <line x1="${rx+3}" y1="${ey-3}" x2="${rx-3}" y2="${ey+3}" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Wide dots (different sizes)
    () => `<circle cx="${lx}" cy="${ey}" r="3" fill="${featureColor}"/>
           <circle cx="${rx}" cy="${ey}" r="5" fill="${featureColor}"/>`,
    // Rectangles
    () => `<rect x="${lx-4}" y="${ey-3}" width="8" height="6" rx="1" fill="${featureColor}"/>
           <rect x="${rx-4}" y="${ey-3}" width="8" height="6" rx="1" fill="${featureColor}"/>`,
  ];
  
  // Nose
  const noseType = bits(h1, 9, 2);
  const ny = cy + 6;
  const noses = [
    '', // No nose
    `<line x1="${cx}" y1="${ny-3}" x2="${cx}" y2="${ny+3}" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round"/>`,
    `<circle cx="${cx}" cy="${ny}" r="2" fill="${featureColor}" opacity="0.5"/>`,
    `<polygon points="${cx},${ny-2} ${cx+3},${ny+2} ${cx-3},${ny+2}" fill="${featureColor}" opacity="0.4"/>`,
  ];
  
  // Mouth
  const mouthType = bits(h1, 11, 3);
  const my = cy + 16;
  const mouthSets = [
    // Simple arc smile
    () => `<path d="M${cx-10} ${my} Q${cx} ${my+10} ${cx+10} ${my}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Straight line
    () => `<line x1="${cx-8}" y1="${my+2}" x2="${cx+8}" y2="${my+2}" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Small O
    () => `<circle cx="${cx}" cy="${my+2}" r="4" fill="none" stroke="${featureColor}" stroke-width="1.5"/>`,
    // Slight frown
    () => `<path d="M${cx-8} ${my+6} Q${cx} ${my-2} ${cx+8} ${my+6}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Wide grin
    () => `<path d="M${cx-14} ${my} Q${cx} ${my+14} ${cx+14} ${my}" fill="none" stroke="${featureColor}" stroke-width="2" stroke-linecap="round"/>`,
    // Tiny dash
    () => `<line x1="${cx-3}" y1="${my+2}" x2="${cx+3}" y2="${my+2}" stroke="${featureColor}" stroke-width="2.5" stroke-linecap="round"/>`,
    // Wavy
    () => `<path d="M${cx-10} ${my+2} Q${cx-5} ${my-3} ${cx} ${my+2} Q${cx+5} ${my+7} ${cx+10} ${my+2}" fill="none" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round"/>`,
    // D-shape open mouth
    () => `<path d="M${cx-7} ${my} Q${cx-7} ${my+10} ${cx} ${my+10} Q${cx+7} ${my+10} ${cx+7} ${my} Z" fill="${featureColor}" opacity="0.7"/>`,
  ];
  
  // Optional: eyebrows
  const browType = bits(h2, 2, 2);
  const by = ey - 9;
  const brows = [
    '', // None
    `<line x1="${lx-4}" y1="${by}" x2="${lx+4}" y2="${by}" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="${rx-4}" y1="${by}" x2="${rx+4}" y2="${by}" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round"/>`,
    `<path d="M${lx-5} ${by+2} Q${lx} ${by-3} ${lx+5} ${by+2}" fill="none" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M${rx-5} ${by+2} Q${rx} ${by-3} ${rx+5} ${by+2}" fill="none" stroke="${featureColor}" stroke-width="1.5" stroke-linecap="round"/>`,
    '', // None
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${shadow}
<rect width="${size}" height="${size}" fill="${bg}"/>
${faces[faceType]}
${faceOverlay}
${brows[browType]}
${eyeSets[eyeType % eyeSets.length]()}
${noses[noseType]}
${mouthSets[mouthType % mouthSets.length]()}
</svg>`;
  
  return svg;
}

for (const seed of seeds) {
  const svg = generate(seed);
  writeFileSync(join(__dirname, `c-minimal-face-${seed}.svg`), svg);
  console.log(`  → c-minimal-face-${seed}.svg`);
}

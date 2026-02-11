#!/usr/bin/env node
/**
 * Proposal F: "Soft Face"
 * Rounded, friendly faces like Slack/Notion defaults.
 * Expressive eyes, subtle gradients, warm and approachable.
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

const BG_PALETTES = [
  { bg: '#94a3b8', bgDark: '#7c8fa5' }, // slate
  { bg: '#a8a29e', bgDark: '#918b85' }, // stone
  { bg: '#a1a1aa', bgDark: '#8a8a93' }, // zinc
  { bg: '#86a88e', bgDark: '#728f7a' }, // sage
  { bg: '#a39585', bgDark: '#8c7f71' }, // taupe
  { bg: '#8e99a4', bgDark: '#78838e' }, // cool gray
  { bg: '#a18a8a', bgDark: '#8a7575' }, // dusty rose
  { bg: '#8a9a8a', bgDark: '#758575' }, // muted green
  { bg: '#9590a0', bgDark: '#7f7a8a' }, // muted lavender
  { bg: '#a09888', bgDark: '#8a8272' }, // warm sand
  { bg: '#7d9baa', bgDark: '#698592' }, // steel
  { bg: '#a08878', bgDark: '#8a7464' }, // clay
];

function generate(seed) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);

  const pal = BG_PALETTES[h1 % BG_PALETTES.length];
  const faceLight = '#f7f3ee';
  const faceDark = '#ede5db';
  const feat = '#35302b';
  const cx = 64, cy = 64;
  const uid = `s${h1 & 0xffff}`;

  // Gradient defs for face and background
  const defs = `<defs>
    <linearGradient id="bg_${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${pal.bg}"/>
      <stop offset="100%" stop-color="${pal.bgDark}"/>
    </linearGradient>
    <radialGradient id="face_${uid}" cx="45%" cy="38%">
      <stop offset="0%" stop-color="${faceLight}"/>
      <stop offset="100%" stop-color="${faceDark}"/>
    </radialGradient>
  </defs>`;

  // Face — all round/soft shapes
  const faceIdx = bits(h1, 3, 2);
  const faces = [
    `<circle cx="${cx}" cy="${cy + 4}" r="38" fill="url(#face_${uid})"/>`,
    `<ellipse cx="${cx}" cy="${cy + 4}" rx="34" ry="39" fill="url(#face_${uid})"/>`,
    `<ellipse cx="${cx}" cy="${cy + 4}" rx="38" ry="36" fill="url(#face_${uid})"/>`,
    `<rect x="28" y="27" width="72" height="76" rx="32" fill="url(#face_${uid})"/>`,
  ];

  // Cheeks — always present, soft blush
  const blushColor = bits(h2, 8, 2) === 0 ? '#d4a8a0' : bits(h2, 8, 2) === 1 ? '#c9a5a5' : bits(h2, 8, 2) === 2 ? '#d4b0a0' : '#c4a6a0';
  const cheeks = `<circle cx="${cx - 20}" cy="${cy + 12}" r="8" fill="${blushColor}" opacity="0.3"/>
    <circle cx="${cx + 20}" cy="${cy + 12}" r="8" fill="${blushColor}" opacity="0.3"/>`;

  // Eyes — emphasis on being expressive
  const eyeType = bits(h1, 5, 3) % 7;
  const esp = 13 + bits(h2, 0, 2) * 2;
  const lx = cx - esp, rx = cx + esp;
  const ey = cy - 1;

  // Eye whites for expressive eyes
  const eyeWhite = (x) => `<circle cx="${x}" cy="${ey}" r="7" fill="white" opacity="0.9"/>`;
  // Pupil positions vary slightly
  const px = bits(h2, 4, 2) - 1; // -1 to 2
  const py = bits(h2, 6, 1); // 0 or 1

  const eyeOptions = [
    // Big expressive with pupils
    `${eyeWhite(lx)}${eyeWhite(rx)}
     <circle cx="${lx + px}" cy="${ey + py}" r="4" fill="${feat}"/>
     <circle cx="${lx + px + 1}" cy="${ey + py - 1}" r="1.5" fill="white"/>
     <circle cx="${rx + px}" cy="${ey + py}" r="4" fill="${feat}"/>
     <circle cx="${rx + px + 1}" cy="${ey + py - 1}" r="1.5" fill="white"/>`,
    // Soft dots
    `<circle cx="${lx}" cy="${ey}" r="4.5" fill="${feat}"/>
     <circle cx="${lx + 1}" cy="${ey - 1}" r="1.5" fill="white" opacity="0.6"/>
     <circle cx="${rx}" cy="${ey}" r="4.5" fill="${feat}"/>
     <circle cx="${rx + 1}" cy="${ey - 1}" r="1.5" fill="white" opacity="0.6"/>`,
    // Happy closed eyes (U-shapes)
    `<path d="M${lx - 5} ${ey - 1} Q${lx} ${ey + 5} ${lx + 5} ${ey - 1}" fill="none" stroke="${feat}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M${rx - 5} ${ey - 1} Q${rx} ${ey + 5} ${rx + 5} ${ey - 1}" fill="none" stroke="${feat}" stroke-width="2.5" stroke-linecap="round"/>`,
    // Big round eyes
    `${eyeWhite(lx)}${eyeWhite(rx)}
     <circle cx="${lx}" cy="${ey}" r="3.5" fill="${feat}"/>
     <circle cx="${rx}" cy="${ey}" r="3.5" fill="${feat}"/>`,
    // Sleepy/relaxed
    `<path d="M${lx - 5} ${ey} A5 4 0 0 0 ${lx + 5} ${ey}" fill="none" stroke="${feat}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M${rx - 5} ${ey} A5 4 0 0 0 ${rx + 5} ${ey}" fill="none" stroke="${feat}" stroke-width="2.5" stroke-linecap="round"/>`,
    // Wide open surprised
    `${eyeWhite(lx)}${eyeWhite(rx)}
     <circle cx="${lx}" cy="${ey}" r="5" fill="${feat}"/>
     <circle cx="${lx + 1}" cy="${ey - 1}" r="2" fill="white"/>
     <circle cx="${rx}" cy="${ey}" r="5" fill="${feat}"/>
     <circle cx="${rx + 1}" cy="${ey - 1}" r="2" fill="white"/>`,
    // Oval relaxed
    `<ellipse cx="${lx}" cy="${ey}" rx="5" ry="3.5" fill="${feat}"/>
     <circle cx="${lx + 1}" cy="${ey - 0.5}" r="1" fill="white" opacity="0.5"/>
     <ellipse cx="${rx}" cy="${ey}" rx="5" ry="3.5" fill="${feat}"/>
     <circle cx="${rx + 1}" cy="${ey - 0.5}" r="1" fill="white" opacity="0.5"/>`,
  ];

  // Nose — very subtle
  const noseType = bits(h1, 8, 2);
  const ny = cy + 8;
  const noses = [
    '',
    `<circle cx="${cx}" cy="${ny}" r="1.5" fill="${feat}" opacity="0.25"/>`,
    `<path d="M${cx} ${ny - 2} L${cx} ${ny + 2}" stroke="${feat}" stroke-width="1.5" stroke-linecap="round" opacity="0.25"/>`,
    `<path d="M${cx - 2} ${ny + 1} Q${cx} ${ny - 1} ${cx + 2} ${ny + 1}" fill="none" stroke="${feat}" stroke-width="1" opacity="0.3"/>`,
  ];

  // Mouth — soft, rounded
  const mouthType = bits(h1, 10, 3) % 6;
  const my = cy + 18;
  const mouths = [
    // Warm smile
    `<path d="M${cx - 9} ${my} Q${cx} ${my + 8} ${cx + 9} ${my}" fill="none" stroke="${feat}" stroke-width="2" stroke-linecap="round"/>`,
    // Small gentle smile
    `<path d="M${cx - 5} ${my + 1} Q${cx} ${my + 5} ${cx + 5} ${my + 1}" fill="none" stroke="${feat}" stroke-width="2" stroke-linecap="round"/>`,
    // Soft O
    `<ellipse cx="${cx}" cy="${my + 2}" rx="4" ry="3" fill="${feat}" opacity="0.15"/>
     <ellipse cx="${cx}" cy="${my + 2}" rx="4" ry="3" fill="none" stroke="${feat}" stroke-width="1.5"/>`,
    // Flat gentle
    `<line x1="${cx - 6}" y1="${my + 2}" x2="${cx + 6}" y2="${my + 2}" stroke="${feat}" stroke-width="2" stroke-linecap="round"/>`,
    // Big happy smile (filled)
    `<path d="M${cx - 10} ${my} Q${cx} ${my + 12} ${cx + 10} ${my}" fill="${feat}" opacity="0.12"/>
     <path d="M${cx - 10} ${my} Q${cx} ${my + 12} ${cx + 10} ${my}" fill="none" stroke="${feat}" stroke-width="1.5" stroke-linecap="round"/>`,
    // Cat mouth
    `<path d="M${cx} ${my + 2} Q${cx - 4} ${my + 6} ${cx - 10} ${my + 2}" fill="none" stroke="${feat}" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M${cx} ${my + 2} Q${cx + 4} ${my + 6} ${cx + 10} ${my + 2}" fill="none" stroke="${feat}" stroke-width="1.5" stroke-linecap="round"/>`,
  ];

  // Eyebrows — soft arcs
  const browType = bits(h2, 2, 2);
  const by = ey - 10;
  const brows = [
    '',
    `<path d="M${lx - 5} ${by + 1} Q${lx} ${by - 2} ${lx + 5} ${by}" fill="none" stroke="${feat}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
     <path d="M${rx - 5} ${by} Q${rx} ${by - 2} ${rx + 5} ${by + 1}" fill="none" stroke="${feat}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>`,
    '',
    `<path d="M${lx - 4} ${by} Q${lx} ${by - 3} ${lx + 4}" fill="none" stroke="${feat}" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>
     <path d="M${rx - 4} ${by} Q${rx} ${by - 3} ${rx + 4} ${by}" fill="none" stroke="${feat}" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>`,
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${defs}
<rect width="${size}" height="${size}" fill="url(#bg_${uid})"/>
${faces[faceIdx]}
${cheeks}
${brows[browType]}
${eyeOptions[eyeType]}
${noses[noseType]}
${mouths[mouthType]}
</svg>`;
}

for (const seed of seeds) {
  const svg = generate(seed);
  writeFileSync(join(__dirname, `f-soft-face-${seed}.svg`), svg);
  console.log(`  → f-soft-face-${seed}.svg`);
}

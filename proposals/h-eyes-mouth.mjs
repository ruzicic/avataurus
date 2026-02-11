#!/usr/bin/env node
// Proposal H: "Eyes + Mouth" - one step more than facehash
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
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function range(h, n, min, max) { return min + ((h * n + 13) % 97) / 96 * (max - min); }

const eyeTypes = [
  (cx, cy, sp, sz, c) => `<circle cx="${cx-sp}" cy="${cy}" r="${sz*.5}" fill="${c}"/><circle cx="${cx+sp}" cy="${cy}" r="${sz*.5}" fill="${c}"/>`,
  (cx, cy, sp, sz, c) => `<ellipse cx="${cx-sp}" cy="${cy}" rx="${sz*.55}" ry="${sz*.35}" fill="${c}"/><ellipse cx="${cx+sp}" cy="${cy}" rx="${sz*.55}" ry="${sz*.35}" fill="${c}"/>`,
  (cx, cy, sp, sz, c) => { const r=sz*.45; return `<path d="M${cx-sp-r},${cy} A${r},${r} 0 0,1 ${cx-sp+r},${cy}" fill="none" stroke="${c}" stroke-width="${sz*.22}" stroke-linecap="round"/><path d="M${cx+sp-r},${cy} A${r},${r} 0 0,1 ${cx+sp+r},${cy}" fill="none" stroke="${c}" stroke-width="${sz*.22}" stroke-linecap="round"/>`; },
  (cx, cy, sp, sz, c) => { const w=sz*.55; return `<line x1="${cx-sp-w}" y1="${cy}" x2="${cx-sp+w}" y2="${cy}" stroke="${c}" stroke-width="${sz*.25}" stroke-linecap="round"/><line x1="${cx+sp-w}" y1="${cy}" x2="${cx+sp+w}" y2="${cy}" stroke="${c}" stroke-width="${sz*.25}" stroke-linecap="round"/>`; },
  (cx, cy, sp, sz, c) => { const s=sz*.45; const d=(x,y)=>`<polygon points="${x},${y-s} ${x+s},${y} ${x},${y+s} ${x-s},${y}" fill="${c}"/>`; return d(cx-sp,cy)+d(cx+sp,cy); },
  (cx, cy, sp, sz, c) => { const s=sz*.4,sw=sz*.2; const x1=cx-sp,x2=cx+sp; return `<line x1="${x1-s}" y1="${cy-s}" x2="${x1+s}" y2="${cy+s}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><line x1="${x1+s}" y1="${cy-s}" x2="${x1-s}" y2="${cy+s}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><line x1="${x2-s}" y1="${cy-s}" x2="${x2+s}" y2="${cy+s}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><line x1="${x2+s}" y1="${cy-s}" x2="${x2-s}" y2="${cy+s}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`; },
  (cx, cy, sp, sz, c) => { const r=sz*.45; return `<path d="M${cx-sp-r},${cy} A${r},${r} 0 0,0 ${cx-sp+r},${cy}" fill="none" stroke="${c}" stroke-width="${sz*.22}" stroke-linecap="round"/><path d="M${cx+sp-r},${cy} A${r},${r} 0 0,0 ${cx+sp+r},${cy}" fill="none" stroke="${c}" stroke-width="${sz*.22}" stroke-linecap="round"/>`; },
  (cx, cy, sp, sz, c) => `<circle cx="${cx-sp}" cy="${cy}" r="${sz*.25}" fill="${c}"/><circle cx="${cx+sp}" cy="${cy}" r="${sz*.25}" fill="${c}"/>`,
];

const mouthTypes = [
  // 0: arc smile
  (cx, cy, c) => `<path d="M${cx-10},${cy} Q${cx},${cy+8} ${cx+10},${cy}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`,
  // 1: straight line
  (cx, cy, c) => `<line x1="${cx-8}" y1="${cy}" x2="${cx+8}" y2="${cy}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`,
  // 2: small circle (surprised)
  (cx, cy, c) => `<circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="${c}" stroke-width="2"/>`,
  // 3: slight frown
  (cx, cy, c) => `<path d="M${cx-9},${cy+3} Q${cx},${cy-5} ${cx+9},${cy+3}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`,
];

function generate(seed) {
  const h = hash(seed);
  const bg = PALETTE[h % PALETTE.length];
  const fc = '#1a1a2e';
  const et = h % eyeTypes.length;
  const mt = (h >> 3) % mouthTypes.length;
  const eyeSize = range(h, 3, 10, 17);
  const eyeSpacing = range(h, 5, 14, 23);
  const eyeY = range(h, 7, 46, 58);
  const mouthY = range(h, 11, 78, 90);
  const cx = 64;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="${bg}"/>
  <radialGradient id="g${h}" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="white" stop-opacity="0.15"/><stop offset="100%" stop-color="black" stop-opacity="0.1"/></radialGradient>
  <rect width="128" height="128" fill="url(#g${h})"/>
  ${eyeTypes[et](cx, eyeY, eyeSpacing, eyeSize, fc)}
  ${mouthTypes[mt](cx, mouthY, fc)}
</svg>`;
}

const prefix = process.argv[2] || 'h-eyes-mouth';
for (const seed of SEEDS) writeFileSync(`proposals/${prefix}-${seed}.svg`, generate(seed));
console.log(`Generated ${SEEDS.length} SVGs for proposal H`);

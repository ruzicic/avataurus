#!/usr/bin/env node
/**
 * Proposal A: "Geometric Dino"
 * Keep dino theme but angular/low-poly. Flat colors, sharp edges.
 * Static light gray bg. Square output.
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

// Muted, earthy dino palette — fewer colors per avatar
const PALETTES = [
  ['#3D7C47', '#2D5A34'], // Forest green
  ['#5B8C5A', '#3E6B48'], // Sage
  ['#8B6914', '#6B4F10'], // Amber/brown
  ['#4A7B9D', '#345B73'], // Steel blue
  ['#7D5A50', '#5C3D33'], // Brown
  ['#6B5B95', '#4A3D6B'], // Muted purple
  ['#C75B39', '#9A4429'], // Terracotta
  ['#2B8A7E', '#1D6B62'], // Teal
];

function generate(seed) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);
  
  const palette = PALETTES[h1 % PALETTES.length];
  const main = palette[0], dark = palette[1];
  const bg = '#F0EEEB';
  
  const headType = bits(h1, 3, 2);
  const eyeType = bits(h1, 5, 3);
  const mouthType = bits(h1, 8, 2);
  const spikeType = bits(h1, 10, 2);
  const hornType = bits(h2, 0, 2);
  const scaleType = bits(h2, 2, 2);
  
  const cx = 64, cy = 68, r = 42;
  
  // Angular head shapes — polygons, not ellipses
  const heads = [
    // Pentagon-ish head
    () => {
      const pts = [[cx, cy-r], [cx+r*0.9, cy-r*0.3], [cx+r*0.7, cy+r*0.7], [cx-r*0.7, cy+r*0.7], [cx-r*0.9, cy-r*0.3]];
      return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${main}"/>`;
    },
    // Hexagonal
    () => {
      const pts = [[cx, cy-r], [cx+r*0.85, cy-r*0.45], [cx+r*0.85, cy+r*0.45], [cx, cy+r*0.75], [cx-r*0.85, cy+r*0.45], [cx-r*0.85, cy-r*0.45]];
      return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${main}"/>`;
    },
    // Squared diamond
    () => {
      const pts = [[cx, cy-r*0.95], [cx+r*0.8, cy-r*0.1], [cx+r*0.65, cy+r*0.7], [cx-r*0.65, cy+r*0.7], [cx-r*0.8, cy-r*0.1]];
      return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${main}"/>`;
    },
    // Shield shape
    () => {
      const pts = [[cx-r*0.75, cy-r*0.7], [cx+r*0.75, cy-r*0.7], [cx+r*0.85, cy+r*0.2], [cx, cy+r*0.8], [cx-r*0.85, cy+r*0.2]];
      return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${main}"/>`;
    },
  ];
  
  // Angular spikes
  const spikeSets = [
    // Three sharp triangles
    () => `<polygon points="${cx-12},${cy-r+5} ${cx-8},${cy-r-18} ${cx-4},${cy-r+5}" fill="${dark}"/>
           <polygon points="${cx-3},${cy-r+2} ${cx},${cy-r-24} ${cx+3},${cy-r+2}" fill="${dark}"/>
           <polygon points="${cx+4},${cy-r+5} ${cx+8},${cy-r-18} ${cx+12},${cy-r+5}" fill="${dark}"/>`,
    // Two horns
    () => `<polygon points="${cx-18},${cy-r+8} ${cx-14},${cy-r-20} ${cx-10},${cy-r+8}" fill="${dark}"/>
           <polygon points="${cx+10},${cy-r+8} ${cx+14},${cy-r-20} ${cx+18},${cy-r+8}" fill="${dark}"/>`,
    // Single large horn
    () => `<polygon points="${cx-5},${cy-r+4} ${cx},${cy-r-28} ${cx+5},${cy-r+4}" fill="${dark}"/>`,
    // Ridge of 5 small spikes
    () => {
      let s = '';
      for (let i = -2; i <= 2; i++) {
        const x = cx + i * 8;
        s += `<polygon points="${x-3},${cy-r+4} ${x},${cy-r-10} ${x+3},${cy-r+4}" fill="${dark}"/>`;
      }
      return s;
    },
  ];
  
  // Geometric eyes
  const eyeL = cx - 14, eyeR = cx + 14, eyeY = cy - 4;
  const eyeSets = [
    // Diamond eyes
    () => `<polygon points="${eyeL},${eyeY-5} ${eyeL+5},${eyeY} ${eyeL},${eyeY+5} ${eyeL-5},${eyeY}" fill="white"/>
           <polygon points="${eyeL},${eyeY-2} ${eyeL+2},${eyeY} ${eyeL},${eyeY+2} ${eyeL-2},${eyeY}" fill="#1a1a1a"/>
           <polygon points="${eyeR},${eyeY-5} ${eyeR+5},${eyeY} ${eyeR},${eyeY+5} ${eyeR-5},${eyeY}" fill="white"/>
           <polygon points="${eyeR},${eyeY-2} ${eyeR+2},${eyeY} ${eyeR},${eyeY+2} ${eyeR-2},${eyeY}" fill="#1a1a1a"/>`,
    // Square eyes
    () => `<rect x="${eyeL-5}" y="${eyeY-4}" width="10" height="8" fill="white"/>
           <rect x="${eyeL-2}" y="${eyeY-2}" width="5" height="5" fill="#1a1a1a"/>
           <rect x="${eyeR-5}" y="${eyeY-4}" width="10" height="8" fill="white"/>
           <rect x="${eyeR-2}" y="${eyeY-2}" width="5" height="5" fill="#1a1a1a"/>`,
    // Triangular eyes
    () => `<polygon points="${eyeL-6},${eyeY+3} ${eyeL},${eyeY-5} ${eyeL+6},${eyeY+3}" fill="white"/>
           <circle cx="${eyeL}" cy="${eyeY+1}" r="2.5" fill="#1a1a1a"/>
           <polygon points="${eyeR-6},${eyeY+3} ${eyeR},${eyeY-5} ${eyeR+6},${eyeY+3}" fill="white"/>
           <circle cx="${eyeR}" cy="${eyeY+1}" r="2.5" fill="#1a1a1a"/>`,
    // Slit eyes (reptilian)
    () => `<ellipse cx="${eyeL}" cy="${eyeY}" rx="6" ry="4" fill="#E8E4D9"/>
           <ellipse cx="${eyeL}" cy="${eyeY}" rx="1.5" ry="3.5" fill="#1a1a1a"/>
           <ellipse cx="${eyeR}" cy="${eyeY}" rx="6" ry="4" fill="#E8E4D9"/>
           <ellipse cx="${eyeR}" cy="${eyeY}" rx="1.5" ry="3.5" fill="#1a1a1a"/>`,
    // Dot eyes
    () => `<circle cx="${eyeL}" cy="${eyeY}" r="3.5" fill="#1a1a1a"/>
           <circle cx="${eyeR}" cy="${eyeY}" r="3.5" fill="#1a1a1a"/>`,
    // Angular half-closed
    () => `<polygon points="${eyeL-6},${eyeY} ${eyeL},${eyeY-4} ${eyeL+6},${eyeY}" fill="white"/>
           <circle cx="${eyeL}" cy="${eyeY-1}" r="2" fill="#1a1a1a"/>
           <polygon points="${eyeR-6},${eyeY} ${eyeR},${eyeY-4} ${eyeR+6},${eyeY}" fill="white"/>
           <circle cx="${eyeR}" cy="${eyeY-1}" r="2" fill="#1a1a1a"/>`,
  ];
  
  // Angular mouths
  const my = cy + 14;
  const mouths = [
    // Zigzag teeth grin
    () => `<path d="M${cx-12} ${my} L${cx-8} ${my+4} L${cx-4} ${my} L${cx} ${my+4} L${cx+4} ${my} L${cx+8} ${my+4} L${cx+12} ${my}" fill="none" stroke="#1a1a1a" stroke-width="1.5"/>`,
    // Simple line
    () => `<line x1="${cx-10}" y1="${my+2}" x2="${cx+10}" y2="${my+2}" stroke="#1a1a1a" stroke-width="2" stroke-linecap="square"/>`,
    // Angular smile
    () => `<polyline points="${cx-10},${my} ${cx-4},${my+6} ${cx+4},${my+6} ${cx+10},${my}" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="miter"/>`,
    // Small triangle mouth
    () => `<polygon points="${cx-5},${my+1} ${cx},${my+7} ${cx+5},${my+1}" fill="#1a1a1a" opacity="0.7"/>`,
  ];
  
  // Optional scales pattern on head
  const scales = [
    () => '',
    () => {
      let s = '';
      const positions = [[cx-8, cy+8], [cx+6, cy+6], [cx-2, cy+12], [cx+12, cy-2], [cx-14, cy+2]];
      for (const [x, y] of positions.slice(0, 3 + (h2 % 2))) {
        s += `<polygon points="${x},${y-3} ${x+3},${y} ${x},${y+3} ${x-3},${y}" fill="${dark}" opacity="0.3"/>`;
      }
      return s;
    },
    () => {
      let s = '';
      for (let i = 0; i < 3; i++) {
        const y = cy + 4 + i * 6;
        s += `<line x1="${cx-16+i*4}" y1="${y}" x2="${cx+16-i*4}" y2="${y}" stroke="${dark}" stroke-width="0.8" opacity="0.2"/>`;
      }
      return s;
    },
    () => '',
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" fill="${bg}"/>
${spikeType < 4 ? spikeSets[spikeType % spikeSets.length]() : ''}
${heads[headType % heads.length]()}
${scales[scaleType % scales.length]()}
${eyeSets[eyeType % eyeSets.length]()}
${mouths[mouthType % mouths.length]()}
</svg>`;
  
  return svg;
}

for (const seed of seeds) {
  const svg = generate(seed);
  const path = join(__dirname, `a-geometric-dino-${seed}.svg`);
  writeFileSync(path, svg);
  console.log(`  → ${path}`);
}

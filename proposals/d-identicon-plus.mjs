#!/usr/bin/env node
/**
 * Proposal D: "Identicon+"
 * Grid-based symmetrical patterns. Single color on white.
 * Ultra lightweight. Like minidenticons but with more personality.
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

const COLORS = [
  '#E76F51', '#2A9D8F', '#264653', '#D62828', '#457B9D',
  '#6D6875', '#6A994E', '#7209B7', '#4361EE', '#C75B39',
  '#3D7C47', '#BC4749', '#5B8C5A', '#8B6914', '#6B5B95',
];

function generate(seed) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);
  
  const color = COLORS[h1 % COLORS.length];
  const grid = 7; // 7x7 grid, mirror horizontally
  const cellSize = size / (grid + 2); // padding
  const pad = cellSize;
  
  // Generate half + center column, mirror for symmetry
  // We need ceil(7/2) = 4 columns of data
  const halfCols = Math.ceil(grid / 2); // 4
  
  let cells = '';
  const shapeType = h1 % 3; // 0=squares, 1=circles, 2=diamonds
  
  for (let col = 0; col < halfCols; col++) {
    for (let row = 0; row < grid; row++) {
      // Use hash bits to determine if cell is filled
      const bitIdx = col * grid + row;
      const hashVal = bitIdx < 16 ? h1 : h2;
      const bit = (hashVal >>> (bitIdx % 32)) & 1;
      
      if (!bit) continue;
      
      const x1 = pad + col * cellSize;
      const y = pad + row * cellSize;
      const x2 = pad + (grid - 1 - col) * cellSize; // Mirror
      
      const drawCell = (x, y) => {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const r = cellSize * 0.42;
        switch (shapeType) {
          case 0: // Rounded squares
            return `<rect x="${x + 1}" y="${y + 1}" width="${cellSize - 2}" height="${cellSize - 2}" rx="2" fill="${color}"/>`;
          case 1: // Circles
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
          case 2: // Diamonds
            return `<polygon points="${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}" fill="${color}"/>`;
        }
      };
      
      cells += drawCell(x1, y);
      if (col !== grid - 1 - col) { // Don't double-draw center column
        cells += drawCell(x2, y);
      }
    }
  }
  
  // Optional: add a subtle border/frame pattern
  const hasBorder = (h2 >>> 20) & 1;
  let border = '';
  if (hasBorder) {
    border = `<rect x="4" y="4" width="${size-8}" height="${size-8}" fill="none" stroke="${color}" stroke-width="1.5" rx="4" opacity="0.2"/>`;
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" fill="#FAFAFA"/>
${border}
${cells}
</svg>`;
  
  return svg;
}

for (const seed of seeds) {
  const svg = generate(seed);
  writeFileSync(join(__dirname, `d-identicon-plus-${seed}.svg`), svg);
  console.log(`  → d-identicon-plus-${seed}.svg`);
}

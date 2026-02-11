#!/usr/bin/env node
/**
 * Proposal B: "Abstract Shapes"
 * Drop dino theme. Geometric shapes composed together.
 * Subtle 3D shading via gradients. Professional, boring-avatars-inspired.
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
function hash3(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = str.charCodeAt(i) + (h << 6) + (h << 16) - h; h = h >>> 0; }
  return h;
}
function bits(hash, offset, count) {
  return (hash >>> offset) & ((1 << count) - 1);
}

// 5-color palettes (inspired by boring-avatars)
const PALETTES = [
  ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
  ['#606C38', '#283618', '#FEFAE0', '#DDA15E', '#BC6C25'],
  ['#003049', '#D62828', '#F77F00', '#FCBF49', '#EAE2B7'],
  ['#0B132B', '#1C2541', '#3A506B', '#5BC0BE', '#6FFFE9'],
  ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D80032'],
  ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#ADB5BD', '#495057'],
  ['#10002B', '#240046', '#3C096C', '#7B2CBF', '#C77DFF'],
  ['#582F0E', '#7F4F24', '#936639', '#A68A64', '#B6AD90'],
];

function generate(seed) {
  const size = 128;
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);
  const h3 = hash3(seed);
  
  const palette = PALETTES[h1 % PALETTES.length];
  const bgColor = palette[bits(h1, 4, 2) % palette.length];
  const numShapes = 3 + bits(h1, 6, 2); // 3-6 shapes
  const rotation = bits(h2, 0, 4) * 22.5; // 0-337.5 degrees
  
  const uid = `s${h1}`;
  
  let defs = `<defs>`;
  let shapes = '';
  
  for (let i = 0; i < numShapes; i++) {
    const sh = (h1 + i * 7919) >>> 0;
    const sh2 = (h2 + i * 6151) >>> 0;
    const color = palette[(bits(sh, 0, 3) + i) % palette.length];
    const shapeType = bits(sh, 3, 2);
    const x = 16 + (bits(sh, 5, 4) / 15) * 96;
    const y = 16 + (bits(sh, 9, 4) / 15) * 96;
    const sz = 16 + bits(sh, 13, 3) * 6;
    const rot = bits(sh2, 0, 4) * 22.5;
    const opacity = 0.6 + (bits(sh2, 4, 2) / 3) * 0.4;
    
    // Gradient for 3D effect
    const gid = `g${uid}_${i}`;
    defs += `<radialGradient id="${gid}" cx="35%" cy="35%"><stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="100%" stop-color="${color}" stop-opacity="${opacity * 0.5}"/></radialGradient>`;
    
    switch (shapeType) {
      case 0: // Circle
        shapes += `<circle cx="${x}" cy="${y}" r="${sz * 0.5}" fill="url(#${gid})"/>`;
        break;
      case 1: // Rectangle
        shapes += `<rect x="${x - sz*0.4}" y="${y - sz*0.4}" width="${sz*0.8}" height="${sz*0.8}" rx="3" fill="url(#${gid})" transform="rotate(${rot} ${x} ${y})"/>`;
        break;
      case 2: // Triangle
        const s2 = sz * 0.5;
        shapes += `<polygon points="${x},${y-s2} ${x+s2*0.87},${y+s2*0.5} ${x-s2*0.87},${y+s2*0.5}" fill="url(#${gid})" transform="rotate(${rot} ${x} ${y})"/>`;
        break;
      case 3: // Diamond
        const d = sz * 0.45;
        shapes += `<polygon points="${x},${y-d} ${x+d},${y} ${x},${y+d} ${x-d},${y}" fill="url(#${gid})" transform="rotate(${rot} ${x} ${y})"/>`;
        break;
    }
  }
  
  defs += `</defs>`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${defs}
<rect width="${size}" height="${size}" fill="${bgColor}"/>
<g transform="rotate(${rotation} 64 64)">
${shapes}
</g>
</svg>`;
  
  return svg;
}

for (const seed of seeds) {
  const svg = generate(seed);
  writeFileSync(join(__dirname, `b-abstract-shapes-${seed}.svg`), svg);
  console.log(`  → b-abstract-shapes-${seed}.svg`);
}

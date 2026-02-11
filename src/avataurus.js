/**
 * Avataurus — Deterministic avatar generator
 * Generates unique dinosaur-themed avatar faces from any string.
 * Same input = same face. No dependencies, no external assets.
 *
 * Feature layers: head, spikes, eyes, eyebrows, mouth, nose, cheeks,
 * ears, face markings, head accessories, belly patch, tail, bg pattern.
 * Total combinations: 6×6×8×6×8×5×3×5×6×6×4×4×4 ≈ 1.7 billion+
 */

// --- Hash Functions ---

/** FNV-1a 32-bit hash */
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/** DJB2 hash — second source of entropy */
function hash2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** SDBM hash — third source of entropy for new features */
function hash3(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + (h << 6) + (h << 16) - h;
    h = h >>> 0;
  }
  return h;
}

/** Extract N bits from hash starting at offset */
function bits(hash, offset, count) {
  return (hash >>> offset) & ((1 << count) - 1);
}

// --- Color Palettes ---
const PALETTES = [
  ['#FF6B6B', '#FF8E72', '#FFD93D', '#FFF3B0'],   // Warm sunset
  ['#4ECDC4', '#45B7D1', '#96E6A1', '#DDF5DD'],   // Ocean breeze
  ['#A855F7', '#C084FC', '#E879F9', '#FAE8FF'],   // Berry fields
  ['#22C55E', '#4ADE80', '#86EFAC', '#DCFCE7'],   // Forest moss
  ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'],   // Amber glow
  ['#FB7185', '#FDA4AF', '#FECDD3', '#FFF1F2'],   // Coral reef
  ['#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE'],   // Arctic blue
  ['#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'],   // Lavender dream
  ['#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],   // Mint fresh
  ['#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'],   // Peach blossom
  ['#6366F1', '#818CF8', '#A5B4FC', '#E0E7FF'],   // Steel blue
  ['#E11D48', '#F43F5E', '#FB7185', '#FFE4E6'],   // Rose gold
  ['#14B8A6', '#2DD4BF', '#5EEAD4', '#CCFBF1'],   // Teal depths
  ['#9333EA', '#A855F7', '#C084FC', '#F3E8FF'],   // Plum
  ['#84CC16', '#A3E635', '#BEF264', '#ECFCCB'],   // Lime zest
  ['#15803D', '#22C55E', '#4ADE80', '#BBF7D0'],   // Dino green
];

// --- Head Shapes ---
function headShape(idx, size) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const shapes = [
    () => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`,
    () => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.9}"/>`,
    () => `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.05}" ry="${r * 0.88}"/>`,
    () => { const w = r * 1.8, h = r * 1.7; return `<rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" rx="${r * 0.45}"/>`; },
    () => `<ellipse cx="${cx}" cy="${cy * 1.02}" rx="${r * 0.9}" ry="${r * 1.02}"/>`,
    () => { const s = r * 0.95; return `<rect x="${cx - s}" y="${cy - s}" width="${s*2}" height="${s*2}" rx="${s * 0.4}" transform="rotate(45 ${cx} ${cy})"/>`; },
  ];
  return shapes[idx % shapes.length]();
}

// --- Spikes/Horns ---
function spikes(idx, size, color) {
  const cx = size / 2, r = size * 0.38, top = cx - r;
  const variants = [
    // Three top spikes
    () => { const s = size * 0.08; return `<polygon points="${cx-s*2},${top+s*0.5} ${cx-s},${top-s*2} ${cx},${top+s*0.5}"/><polygon points="${cx-s*0.5},${top-s*0.2} ${cx},${top-s*3} ${cx+s*0.5},${top-s*0.2}"/><polygon points="${cx},${top+s*0.5} ${cx+s},${top-s*2} ${cx+s*2},${top+s*0.5}"/>`; },
    // Two horns
    () => { const s = size * 0.07; return `<polygon points="${cx-r*0.4-s},${top+s*2} ${cx-r*0.4},${top-s*2.5} ${cx-r*0.4+s},${top+s*2}"/><polygon points="${cx+r*0.4-s},${top+s*2} ${cx+r*0.4},${top-s*2.5} ${cx+r*0.4+s},${top+s*2}"/>`; },
    // Single horn
    () => { const s = size * 0.06; return `<polygon points="${cx-s},${top+s} ${cx},${top-s*4} ${cx+s},${top+s}"/>`; },
    // Side frills
    () => { const s = size * 0.06; const l = cx - r, ri = cx + r; return `<circle cx="${l}" cy="${cx-s*2}" r="${s*1.3}"/><circle cx="${l-s*0.5}" cy="${cx+s}" r="${s}"/><circle cx="${ri}" cy="${cx-s*2}" r="${s*1.3}"/><circle cx="${ri+s*0.5}" cy="${cx+s}" r="${s}"/>`; },
    // Crown spikes (5)
    () => { const s = size * 0.055; let p = ''; for (let i = -2; i <= 2; i++) { const x = cx + i * s * 1.5, h = i === 0 ? s * 3 : s * 2; p += `<polygon points="${x-s*0.5},${top+s} ${x},${top-h} ${x+s*0.5},${top+s}"/>`; } return p; },
    // No spikes
    () => '',
  ];
  const svg = variants[idx % variants.length]();
  return svg ? `<g fill="${color}" opacity="0.85">${svg}</g>` : '';
}

// --- Eyes ---
function eyes(idx, size, darkColor) {
  const cx = size / 2, cy = size / 2;
  const sp = size * 0.14, eyeY = cy - size * 0.02;
  const lx = cx - sp, rx = cx + sp, s = size * 0.05;
  const variants = [
    () => `<circle cx="${lx}" cy="${eyeY}" r="${s*1.3}" fill="white"/><circle cx="${lx+s*0.2}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/><circle cx="${lx+s*0.4}" cy="${eyeY-s*0.2}" r="${s*0.25}" fill="white"/><circle cx="${rx}" cy="${eyeY}" r="${s*1.3}" fill="white"/><circle cx="${rx+s*0.2}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/><circle cx="${rx+s*0.4}" cy="${eyeY-s*0.2}" r="${s*0.25}" fill="white"/>`,
    () => `<ellipse cx="${lx}" cy="${eyeY}" rx="${s*1.1}" ry="${s*1.4}" fill="white"/><circle cx="${lx}" cy="${eyeY+s*0.15}" r="${s*0.6}" fill="${darkColor}"/><ellipse cx="${rx}" cy="${eyeY}" rx="${s*1.1}" ry="${s*1.4}" fill="white"/><circle cx="${rx}" cy="${eyeY+s*0.15}" r="${s*0.6}" fill="${darkColor}"/>`,
    () => `<circle cx="${lx}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/><circle cx="${lx+s*0.2}" cy="${eyeY-s*0.2}" r="${s*0.2}" fill="white"/><circle cx="${rx}" cy="${eyeY}" r="${s*0.7}" fill="${darkColor}"/><circle cx="${rx+s*0.2}" cy="${eyeY-s*0.2}" r="${s*0.2}" fill="white"/>`,
    () => `<path d="M${lx-s} ${eyeY} Q${lx} ${eyeY-s*1.5} ${lx+s} ${eyeY}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/><path d="M${rx-s} ${eyeY} Q${rx} ${eyeY-s*1.5} ${rx+s} ${eyeY}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
    () => `<circle cx="${lx}" cy="${eyeY}" r="${s*1.5}" fill="white"/><circle cx="${lx+s*0.15}" cy="${eyeY+s*0.1}" r="${s*0.85}" fill="${darkColor}"/><circle cx="${lx+s*0.45}" cy="${eyeY-s*0.3}" r="${s*0.3}" fill="white"/><circle cx="${rx}" cy="${eyeY}" r="${s*1.5}" fill="white"/><circle cx="${rx+s*0.15}" cy="${eyeY+s*0.1}" r="${s*0.85}" fill="${darkColor}"/><circle cx="${rx+s*0.45}" cy="${eyeY-s*0.3}" r="${s*0.3}" fill="white"/>`,
    () => `<ellipse cx="${lx}" cy="${eyeY}" rx="${s*1.2}" ry="${s*0.7}" fill="white"/><circle cx="${lx}" cy="${eyeY+s*0.1}" r="${s*0.45}" fill="${darkColor}"/><ellipse cx="${rx}" cy="${eyeY}" rx="${s*1.2}" ry="${s*0.7}" fill="white"/><circle cx="${rx}" cy="${eyeY+s*0.1}" r="${s*0.45}" fill="${darkColor}"/>`,
    () => `<circle cx="${lx}" cy="${eyeY}" r="${s*1.3}" fill="white"/><circle cx="${lx+s*0.2}" cy="${eyeY}" r="${s*0.65}" fill="${darkColor}"/><path d="M${rx-s} ${eyeY} Q${rx} ${eyeY-s*1.2} ${rx+s} ${eyeY}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
    () => { function star(x, y, r) { const pts = []; for (let i = 0; i < 5; i++) { const a1 = (i*72-90)*Math.PI/180, a2 = (i*72+36-90)*Math.PI/180; pts.push(`${x+r*Math.cos(a1)},${y+r*Math.sin(a1)}`); pts.push(`${x+r*0.45*Math.cos(a2)},${y+r*0.45*Math.sin(a2)}`); } return `<polygon points="${pts.join(' ')}" fill="${darkColor}"/>`; } return star(lx, eyeY, s*1.1) + star(rx, eyeY, s*1.1); },
  ];
  return variants[idx % variants.length]();
}

// --- Eyebrows (NEW) ---
function eyebrows(idx, size, darkColor) {
  const cx = size / 2, cy = size / 2;
  const sp = size * 0.14, browY = cy - size * 0.09;
  const lx = cx - sp, rx = cx + sp, s = size * 0.05;
  const sw = s * 0.35;
  const variants = [
    // Thick straight
    () => `<line x1="${lx-s}" y1="${browY}" x2="${lx+s}" y2="${browY}" stroke="${darkColor}" stroke-width="${sw*1.8}" stroke-linecap="round" opacity="0.6"/><line x1="${rx-s}" y1="${browY}" x2="${rx+s}" y2="${browY}" stroke="${darkColor}" stroke-width="${sw*1.8}" stroke-linecap="round" opacity="0.6"/>`,
    // Thin arched
    () => `<path d="M${lx-s*1.1} ${browY+s*0.3} Q${lx} ${browY-s*0.8} ${lx+s*1.1} ${browY+s*0.3}" fill="none" stroke="${darkColor}" stroke-width="${sw}" stroke-linecap="round" opacity="0.5"/><path d="M${rx-s*1.1} ${browY+s*0.3} Q${rx} ${browY-s*0.8} ${rx+s*1.1} ${browY+s*0.3}" fill="none" stroke="${darkColor}" stroke-width="${sw}" stroke-linecap="round" opacity="0.5"/>`,
    // Angry (V shape, inner high)
    () => `<line x1="${lx-s}" y1="${browY+s*0.2}" x2="${lx+s}" y2="${browY-s*0.5}" stroke="${darkColor}" stroke-width="${sw*1.4}" stroke-linecap="round" opacity="0.6"/><line x1="${rx-s}" y1="${browY-s*0.5}" x2="${rx+s}" y2="${browY+s*0.2}" stroke="${darkColor}" stroke-width="${sw*1.4}" stroke-linecap="round" opacity="0.6"/>`,
    // Surprised (high arches)
    () => `<path d="M${lx-s*1.2} ${browY+s*0.5} Q${lx} ${browY-s*1.5} ${lx+s*1.2} ${browY+s*0.5}" fill="none" stroke="${darkColor}" stroke-width="${sw*1.2}" stroke-linecap="round" opacity="0.5"/><path d="M${rx-s*1.2} ${browY+s*0.5} Q${rx} ${browY-s*1.5} ${rx+s*1.2} ${browY+s*0.5}" fill="none" stroke="${darkColor}" stroke-width="${sw*1.2}" stroke-linecap="round" opacity="0.5"/>`,
    // Bushy (thick arched)
    () => `<path d="M${lx-s*1.3} ${browY+s*0.2} Q${lx} ${browY-s*0.6} ${lx+s*1.3} ${browY+s*0.2}" fill="none" stroke="${darkColor}" stroke-width="${sw*2.5}" stroke-linecap="round" opacity="0.45"/><path d="M${rx-s*1.3} ${browY+s*0.2} Q${rx} ${browY-s*0.6} ${rx+s*1.3} ${browY+s*0.2}" fill="none" stroke="${darkColor}" stroke-width="${sw*2.5}" stroke-linecap="round" opacity="0.45"/>`,
    // None
    () => '',
  ];
  return variants[idx % variants.length]();
}

// --- Ears/Side Features (NEW) ---
function ears(idx, size, color) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const leftX = cx - r, rightX = cx + r;
  const earY = cy - size * 0.05;
  const s = size * 0.06;
  const variants = [
    // Small round
    () => `<circle cx="${leftX-s*0.3}" cy="${earY}" r="${s}" fill="${color}" opacity="0.7"/><circle cx="${rightX+s*0.3}" cy="${earY}" r="${s}" fill="${color}" opacity="0.7"/>`,
    // Pointy
    () => `<polygon points="${leftX},${earY-s*1.5} ${leftX-s*1.5},${earY} ${leftX},${earY+s*0.5}" fill="${color}" opacity="0.7"/><polygon points="${rightX},${earY-s*1.5} ${rightX+s*1.5},${earY} ${rightX},${earY+s*0.5}" fill="${color}" opacity="0.7"/>`,
    // Dino fins (multiple small triangles)
    () => { let out = ''; for (let i = 0; i < 3; i++) { const y = earY - s + i * s; out += `<polygon points="${leftX},${y} ${leftX-s*0.9},${y+s*0.4} ${leftX},${y+s*0.8}" fill="${color}" opacity="0.6"/>`; out += `<polygon points="${rightX},${y} ${rightX+s*0.9},${y+s*0.4} ${rightX},${y+s*0.8}" fill="${color}" opacity="0.6"/>`; } return out; },
    // None
    () => '',
    // Large round
    () => `<ellipse cx="${leftX-s*0.2}" cy="${earY}" rx="${s*1.3}" ry="${s*1.6}" fill="${color}" opacity="0.6"/><ellipse cx="${rightX+s*0.2}" cy="${earY}" rx="${s*1.3}" ry="${s*1.6}" fill="${color}" opacity="0.6"/>`,
  ];
  return variants[idx % variants.length]();
}

// --- Face Markings (NEW) ---
function faceMarkings(idx, size, color) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38, s = size * 0.02;
  const variants = [
    // Spots
    () => { const spots = [[cx-r*0.3, cy-r*0.2, s*1.2], [cx+r*0.25, cy-r*0.1, s*0.9], [cx-r*0.15, cy+r*0.2, s*1.0], [cx+r*0.35, cy+r*0.15, s*0.7]]; return spots.map(([x,y,sr]) => `<circle cx="${x}" cy="${y}" r="${sr}" fill="${color}" opacity="0.2"/>`).join(''); },
    // Stripes (horizontal lines across face)
    () => { let out = ''; for (let i = -1; i <= 1; i++) { const y = cy + i * r * 0.25; out += `<line x1="${cx-r*0.5}" y1="${y}" x2="${cx+r*0.5}" y2="${y}" stroke="${color}" stroke-width="${s*0.8}" stroke-linecap="round" opacity="0.15"/>`; } return out; },
    // Freckles (small dots around nose/cheeks)
    () => { const pts = [[cx-r*0.25,cy+s*2],[cx-r*0.15,cy-s],[cx-r*0.3,cy+s*5],[cx+r*0.25,cy+s*2],[cx+r*0.15,cy-s],[cx+r*0.3,cy+s*5]]; return pts.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="${s*0.6}" fill="${color}" opacity="0.25"/>`).join(''); },
    // Blush patches (rosy cheeks, different from regular cheeks)
    () => `<ellipse cx="${cx-r*0.55}" cy="${cy+size*0.04}" rx="${size*0.05}" ry="${size*0.035}" fill="#FF6B6B" opacity="0.2"/><ellipse cx="${cx+r*0.55}" cy="${cy+size*0.04}" rx="${size*0.05}" ry="${size*0.035}" fill="#FF6B6B" opacity="0.2"/>`,
    // Scar (diagonal line)
    () => `<line x1="${cx+r*0.1}" y1="${cy-r*0.3}" x2="${cx+r*0.35}" y2="${cy+r*0.1}" stroke="${color}" stroke-width="${s*1.2}" stroke-linecap="round" opacity="0.25"/><line x1="${cx+r*0.15}" y1="${cy-r*0.15}" x2="${cx+r*0.3}" y2="${cy-r*0.15}" stroke="${color}" stroke-width="${s*0.8}" stroke-linecap="round" opacity="0.2"/>`,
    // None
    () => '',
  ];
  return variants[idx % variants.length]();
}

// --- Head Accessories (NEW) ---
function headAccessory(idx, size, color, accentColor) {
  const cx = size / 2, r = size * 0.38, top = cx - r;
  const s = size * 0.04;
  const variants = [
    // Tiny crown
    () => { const y = top - s * 0.5; const w = s * 3; return `<rect x="${cx-w/2}" y="${y}" width="${w}" height="${s*1.5}" rx="${s*0.2}" fill="#FFD700" opacity="0.8"/><polygon points="${cx-w/2},${y} ${cx-w/3},${y-s*1.5} ${cx-w/6},${y}" fill="#FFD700" opacity="0.8"/><polygon points="${cx-w/6},${y} ${cx},${y-s*2} ${cx+w/6},${y}" fill="#FFD700" opacity="0.8"/><polygon points="${cx+w/6},${y} ${cx+w/3},${y-s*1.5} ${cx+w/2},${y}" fill="#FFD700" opacity="0.8"/>`; },
    // Headband
    () => { const y = top + r * 0.15; return `<ellipse cx="${cx}" cy="${y}" rx="${r*0.85}" ry="${s*1.2}" fill="none" stroke="${accentColor}" stroke-width="${s*0.8}" opacity="0.6"/>`; },
    // Bow
    () => { const bx = cx + r * 0.35, by = top + s; return `<ellipse cx="${bx-s*1.2}" cy="${by}" rx="${s*1.2}" ry="${s*0.8}" fill="${accentColor}" opacity="0.7"/><ellipse cx="${bx+s*1.2}" cy="${by}" rx="${s*1.2}" ry="${s*0.8}" fill="${accentColor}" opacity="0.7"/><circle cx="${bx}" cy="${by}" r="${s*0.5}" fill="${accentColor}" opacity="0.9"/>`; },
    // Leaf
    () => { const lx = cx - r * 0.1, ly = top - s; return `<ellipse cx="${lx}" cy="${ly}" rx="${s*0.6}" ry="${s*1.5}" fill="#22C55E" opacity="0.7" transform="rotate(-20 ${lx} ${ly})"/><line x1="${lx}" y1="${ly-s*1.5}" x2="${lx}" y2="${ly+s*1.5}" stroke="#15803D" stroke-width="${s*0.2}" opacity="0.5"/>`; },
    // None
    () => '',
    // Horn ring (small ring around horn area)
    () => { const ry = top + s * 0.5; return `<circle cx="${cx}" cy="${ry}" r="${s*1.8}" fill="none" stroke="${accentColor}" stroke-width="${s*0.5}" opacity="0.4"/>`; },
  ];
  return variants[idx % variants.length]();
}

// --- Belly/Chest Patch (NEW) ---
function bellyPatch(idx, size, color) {
  const cx = size / 2, cy = size / 2 + size * 0.06;
  const s = size * 0.08;
  const variants = [
    // Lighter oval
    () => `<ellipse cx="${cx}" cy="${cy}" rx="${s*1.2}" ry="${s*1.5}" fill="${color}" opacity="0.2"/>`,
    // Diamond
    () => `<polygon points="${cx},${cy-s*1.2} ${cx+s*0.8},${cy} ${cx},${cy+s*1.2} ${cx-s*0.8},${cy}" fill="${color}" opacity="0.18"/>`,
    // Heart shape
    () => { const hs = s * 0.5; return `<path d="M${cx} ${cy+hs*1.8} C${cx-hs*2.5} ${cy-hs*0.5} ${cx-hs*1.5} ${cy-hs*2} ${cx} ${cy-hs*0.5} C${cx+hs*1.5} ${cy-hs*2} ${cx+hs*2.5} ${cy-hs*0.5} ${cx} ${cy+hs*1.8}Z" fill="${color}" opacity="0.15"/>`; },
    // None
    () => '',
  ];
  return variants[idx % variants.length]();
}

// --- Tail (NEW) ---
function tail(idx, size, color) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const tx = cx + r - size * 0.02, ty = cy + r * 0.4;
  const s = size * 0.06;
  const variants = [
    // Curly tail
    () => `<path d="M${tx} ${ty} Q${tx+s*2} ${ty-s} ${tx+s*2.5} ${ty+s} Q${tx+s*3} ${ty+s*2.5} ${tx+s*1.5} ${ty+s*2}" fill="none" stroke="${color}" stroke-width="${s*0.7}" stroke-linecap="round" opacity="0.7"/>`,
    // Spiky tail
    () => `<path d="M${tx} ${ty} L${tx+s*2} ${ty+s*0.3}" stroke="${color}" stroke-width="${s*0.8}" stroke-linecap="round" opacity="0.7"/><polygon points="${tx+s*1.5},${ty} ${tx+s*2.8},${ty-s*0.5} ${tx+s*2},${ty+s*0.8}" fill="${color}" opacity="0.6"/>`,
    // Long smooth tail
    () => `<path d="M${tx} ${ty} Q${tx+s*1.5} ${ty+s*0.5} ${tx+s*3} ${ty+s*1.5}" fill="none" stroke="${color}" stroke-width="${s*0.6}" stroke-linecap="round" opacity="0.6"/>`,
    // None
    () => '',
  ];
  return variants[idx % variants.length]();
}

// --- Mouth ---
function mouth(idx, size, darkColor) {
  const cx = size / 2, cy = size / 2, my = cy + size * 0.1, s = size * 0.05;
  const variants = [
    () => `<path d="M${cx-s*2} ${my} Q${cx} ${my+s*2.5} ${cx+s*2} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
    () => `<path d="M${cx-s*1.8} ${my} Q${cx} ${my+s*2.5} ${cx+s*1.8} ${my} Z" fill="${darkColor}" opacity="0.8"/>`,
    () => `<path d="M${cx-s*2} ${my} Q${cx} ${my+s*2.5} ${cx+s*2} ${my} Z" fill="${darkColor}" opacity="0.7"/><path d="M${cx-s*1.2} ${my+s*0.2} L${cx-s*0.6} ${my+s*0.8} L${cx} ${my+s*0.2} L${cx+s*0.6} ${my+s*0.8} L${cx+s*1.2} ${my+s*0.2}" fill="white" stroke="none"/>`,
    () => `<ellipse cx="${cx}" cy="${my+s*0.5}" rx="${s*0.7}" ry="${s*0.9}" fill="${darkColor}" opacity="0.6"/>`,
    () => `<line x1="${cx-s*1.5}" y1="${my+s*0.3}" x2="${cx+s*1.5}" y2="${my+s*0.3}" stroke="${darkColor}" stroke-width="${s*0.35}" stroke-linecap="round"/>`,
    () => `<path d="M${cx-s*1.8} ${my} Q${cx} ${my+s*2} ${cx+s*1.8} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/><ellipse cx="${cx+s*0.3}" cy="${my+s*1.5}" rx="${s*0.6}" ry="${s*0.8}" fill="#FF6B6B" opacity="0.7"/>`,
    () => `<path d="M${cx-s*0.1} ${my+s*0.3} Q${cx-s*1.5} ${my+s*2} ${cx-s*2.5} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.35}" stroke-linecap="round"/><path d="M${cx+s*0.1} ${my+s*0.3} Q${cx+s*1.5} ${my+s*2} ${cx+s*2.5} ${my}" fill="none" stroke="${darkColor}" stroke-width="${s*0.35}" stroke-linecap="round"/>`,
    () => `<path d="M${cx-s} ${my+s*0.5} Q${cx+s*0.5} ${my+s*2} ${cx+s*2} ${my-s*0.2}" fill="none" stroke="${darkColor}" stroke-width="${s*0.4}" stroke-linecap="round"/>`,
  ];
  return variants[idx % variants.length]();
}

// --- Nose ---
function nose(idx, size, darkColor) {
  const cx = size / 2, cy = size / 2, ny = cy + size * 0.03, s = size * 0.025;
  const variants = [
    () => `<circle cx="${cx-s*1.2}" cy="${ny}" r="${s*0.8}" fill="${darkColor}" opacity="0.4"/><circle cx="${cx+s*1.2}" cy="${ny}" r="${s*0.8}" fill="${darkColor}" opacity="0.4"/>`,
    () => `<polygon points="${cx},${ny-s} ${cx-s*1.2},${ny+s} ${cx+s*1.2},${ny+s}" fill="${darkColor}" opacity="0.3"/>`,
    () => `<ellipse cx="${cx}" cy="${ny}" rx="${s*1.2}" ry="${s*0.7}" fill="${darkColor}" opacity="0.2"/>`,
    () => '',
    () => `<circle cx="${cx}" cy="${ny}" r="${s*0.6}" fill="${darkColor}" opacity="0.3"/>`,
  ];
  return variants[idx % variants.length]();
}

// --- Cheeks ---
function cheeks(idx, size, color) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, s = size * 0.06;
  if (idx % 3 === 0) return '';
  return `<circle cx="${cx-r*0.6}" cy="${cy+size*0.05}" r="${s}" fill="${color}" opacity="0.3"/><circle cx="${cx+r*0.6}" cy="${cy+size*0.05}" r="${s}" fill="${color}" opacity="0.3"/>`;
}

// --- Background Pattern ---
function bgPattern(idx, size, color) {
  const variants = [
    () => { let d = ''; const step = size / 6; for (let x = step; x < size; x += step) for (let y = step; y < size; y += step) d += `<circle cx="${x}" cy="${y}" r="${size*0.008}" fill="${color}" opacity="0.15"/>`; return d; },
    () => '',
    () => `<circle cx="0" cy="0" r="${size*0.15}" fill="${color}" opacity="0.1"/>`,
    () => '',
  ];
  return variants[idx % variants.length]();
}

// --- Main Generator ---
// --- Mood presets (override eye + mouth combos) ---
const MOODS = {
  happy:     { eyeIdx: 3, mouthIdx: 0 },  // closed happy eyes + smile
  angry:     { eyeIdx: 0, mouthIdx: 4, browIdx: 2 },  // round eyes + flat line + angry brows
  sleepy:    { eyeIdx: 5, mouthIdx: 3 },  // sleepy eyes + small o
  surprised: { eyeIdx: 4, mouthIdx: 3 },  // big round eyes + small o
  chill:     { eyeIdx: 6, mouthIdx: 7 },  // winking + smirk
};

// --- Species presets (override spike + ear + tail combos) ---
const SPECIES = {
  rex:          { spikeIdx: 0, earIdx: 3, tailIdx: 1 },  // three spikes + dino fins + spiky tail
  triceratops:  { spikeIdx: 1, earIdx: 2, tailIdx: 2 },  // two horns + dino fins + long tail
  stego:        { spikeIdx: 4, earIdx: 0, tailIdx: 1 },  // crown spikes + small round + spiky tail
  raptor:       { spikeIdx: 2, earIdx: 1, tailIdx: 0 },  // single horn + pointy ears + curly tail
  bronto:       { spikeIdx: 5, earIdx: 4, tailIdx: 2 },  // no spikes + large ears + long tail
};

function generateAvatar(name, options = {}) {
  const { size = 128, colors = null, showInitial = false, variant = 'gradient', mood = null, species = null } = options;

  const h1 = fnv1a(name || 'anonymous');
  const h2 = hash2(name || 'anonymous');
  const h3 = hash3(name || 'anonymous');

  // Pick palette
  const paletteIdx = h1 % PALETTES.length;
  const palette = colors || PALETTES[paletteIdx];
  const mainColor = palette[0], secondColor = palette[1], lightColor = palette[2], bgLight = palette[3];
  const darkColor = '#2D3436';

  // Feature indices from hash bits (carefully distributed)
  // h1: head(3), eyes(3), mouth(3), nose(3), spikes(3) = 15 bits
  const headIdx    = bits(h1, 0, 3);
  let eyeIdx       = bits(h1, 3, 3);
  let mouthIdx     = bits(h1, 6, 3);
  const noseIdx    = bits(h1, 9, 3);
  let spikeIdx     = bits(h1, 12, 3);

  // h2: cheeks(2), bg(2), eyebrows(3), ears(3), markings(3) = 13 bits
  const cheekIdx   = bits(h2, 0, 2);
  const bgIdx      = bits(h2, 2, 2);
  let browIdx      = bits(h2, 4, 3);
  let earIdx       = bits(h2, 7, 3);
  const markIdx    = bits(h2, 10, 3);

  // h3: accessory(3), belly(2), tail(2), gradient angle(3) = 10 bits
  let accIdx     = bits(h3, 0, 3);
  let bellyIdx   = bits(h3, 3, 2);
  let tailIdx    = bits(h3, 5, 2);
  const angleIdx = bits(h3, 7, 3);

  // Apply mood override (eyes + mouth + optionally brows)
  if (mood && MOODS[mood]) {
    const m = MOODS[mood];
    if (m.eyeIdx != null) eyeIdx = m.eyeIdx;
    if (m.mouthIdx != null) mouthIdx = m.mouthIdx;
    if (m.browIdx != null) browIdx = m.browIdx;
  }

  // Apply species override (spikes + ears + tail)
  if (species && SPECIES[species]) {
    const s = SPECIES[species];
    if (s.spikeIdx != null) spikeIdx = s.spikeIdx;
    if (s.earIdx != null) earIdx = s.earIdx;
    if (s.tailIdx != null) tailIdx = s.tailIdx;
  }

  // Build SVG defs
  const gradientId = `grad_${h1}`;
  const bgGradId = `bg_${h1}`;
  let defs = '';

  if (variant === 'gradient') {
    const angle = (angleIdx / 7) * 360;
    const rad = angle * Math.PI / 180;
    const x1 = 50 + Math.cos(rad) * 50, y1 = 50 + Math.sin(rad) * 50;
    const x2 = 50 - Math.cos(rad) * 50, y2 = 50 - Math.sin(rad) * 50;
    defs = `<defs><linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${mainColor}"/><stop offset="100%" stop-color="${secondColor}"/></linearGradient><linearGradient id="${bgGradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bgLight}"/><stop offset="100%" stop-color="${lightColor}" stop-opacity="0.5"/></linearGradient></defs>`;
  } else {
    defs = `<defs><linearGradient id="${bgGradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bgLight}"/><stop offset="100%" stop-color="${lightColor}" stop-opacity="0.5"/></linearGradient></defs>`;
  }

  const headFill = variant === 'gradient' ? `url(#${gradientId})` : mainColor;

  // Initial letter overlay
  let initialSvg = '';
  if (showInitial && name) {
    const letter = name.charAt(0).toUpperCase();
    const fontSize = size * 0.14;
    initialSvg = `<text x="${size/2}" y="${size-size*0.08}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="${fontSize}" font-weight="700" fill="${darkColor}" opacity="0.5">${letter}</text>`;
  }

  // Assemble layers (order matters for z-stacking)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${defs}
<rect width="${size}" height="${size}" rx="${size*0.18}" fill="url(#${bgGradId})"/>
${bgPattern(bgIdx, size, mainColor)}
${tail(tailIdx, size, secondColor)}
${ears(earIdx, size, secondColor)}
${spikes(spikeIdx, size, secondColor)}
<g fill="${headFill}">${headShape(headIdx, size)}</g>
${bellyPatch(bellyIdx, size, lightColor)}
${faceMarkings(markIdx, size, darkColor)}
${headAccessory(accIdx, size, mainColor, secondColor)}
${eyebrows(browIdx, size, darkColor)}
${eyes(eyeIdx, size, darkColor)}
${nose(noseIdx, size, darkColor)}
${mouth(mouthIdx, size, darkColor)}
${cheeks(cheekIdx, size, lightColor)}
${initialSvg}
</svg>`;
}

export { generateAvatar, fnv1a };
export default generateAvatar;

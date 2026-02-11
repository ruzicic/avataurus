/**
 * Avataurus - Deterministic avatar generator
 * Generates unique minimal face avatars from any string.
 * Same input = same face. No dependencies, no external assets.
 */

// Hash functions
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
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function bits(hash, offset, count) {
  return (hash >>> offset) & ((1 << count) - 1);
}

// Color palette
const COLORS = [
  '#CC5E3D', // Flame Pea - warm terracotta
  '#F4CB43', // Bright Sun - golden yellow
  '#89BFD2', // Half Baked - soft blue
  '#56A6C3', // Fountain Blue - medium blue
  '#B54A32', // Muted rust
  '#D4836A', // Dusty terracotta
  '#A3725A', // Clay brown
  '#8B5E3C', // Warm umber
  '#6B98A8', // Dusty teal
  '#4E8A9E', // Deep teal
  '#3D7A8F', // Slate blue
  '#9AABB4', // Pewter blue
  '#8C8578', // Warm taupe
  '#A69E91', // Sand
  '#7A8B6E', // Sage olive
  '#C4956A', // Warm tan
  '#C48B7A', // Dusty rose
  '#D4A87C', // Warm sand
  '#E8C49A', // Muted gold
  '#6B7B6E', // Muted sage
];

const FEATURE_COLOR = '#1a1a2e';

// Eye shapes
function renderEyes(eyeType, size, spacing, eyeSize, verticalPos) {
  const cx = size / 2;
  const cy = size / 2 + verticalPos;
  const leftX = cx - spacing;
  const rightX = cx + spacing;
  
  const shapes = [
    // Dots
    () => `<circle cx="${leftX}" cy="${cy}" r="${eyeSize * 0.5}" fill="${FEATURE_COLOR}"/><circle cx="${rightX}" cy="${cy}" r="${eyeSize * 0.5}" fill="${FEATURE_COLOR}"/>`,
    
    // Ovals
    () => `<ellipse cx="${leftX}" cy="${cy}" rx="${eyeSize * 0.6}" ry="${eyeSize * 0.8}" fill="${FEATURE_COLOR}"/><ellipse cx="${rightX}" cy="${cy}" rx="${eyeSize * 0.6}" ry="${eyeSize * 0.8}" fill="${FEATURE_COLOR}"/>`,
    
    // Arcs
    () => `<path d="M${leftX - eyeSize * 0.6} ${cy} Q${leftX} ${cy - eyeSize * 0.8} ${leftX + eyeSize * 0.6} ${cy}" fill="none" stroke="${FEATURE_COLOR}" stroke-width="${eyeSize * 0.3}" stroke-linecap="round"/><path d="M${rightX - eyeSize * 0.6} ${cy} Q${rightX} ${cy - eyeSize * 0.8} ${rightX + eyeSize * 0.6} ${cy}" fill="none" stroke="${FEATURE_COLOR}" stroke-width="${eyeSize * 0.3}" stroke-linecap="round"/>`,
    
    // Lines
    () => `<line x1="${leftX - eyeSize * 0.5}" y1="${cy}" x2="${leftX + eyeSize * 0.5}" y2="${cy}" stroke="${FEATURE_COLOR}" stroke-width="${eyeSize * 0.3}" stroke-linecap="round"/><line x1="${rightX - eyeSize * 0.5}" y1="${cy}" x2="${rightX + eyeSize * 0.5}" y2="${cy}" stroke="${FEATURE_COLOR}" stroke-width="${eyeSize * 0.3}" stroke-linecap="round"/>`,
    
    // Diamonds
    () => `<polygon points="${leftX},${cy - eyeSize * 0.5} ${leftX + eyeSize * 0.4},${cy} ${leftX},${cy + eyeSize * 0.5} ${leftX - eyeSize * 0.4},${cy}" fill="${FEATURE_COLOR}"/><polygon points="${rightX},${cy - eyeSize * 0.5} ${rightX + eyeSize * 0.4},${cy} ${rightX},${cy + eyeSize * 0.5} ${rightX - eyeSize * 0.4},${cy}" fill="${FEATURE_COLOR}"/>`,
    
    // Crosses
    () => `<g stroke="${FEATURE_COLOR}" stroke-width="${eyeSize * 0.25}" stroke-linecap="round"><line x1="${leftX - eyeSize * 0.4}" y1="${cy - eyeSize * 0.4}" x2="${leftX + eyeSize * 0.4}" y2="${cy + eyeSize * 0.4}"/><line x1="${leftX - eyeSize * 0.4}" y1="${cy + eyeSize * 0.4}" x2="${leftX + eyeSize * 0.4}" y2="${cy - eyeSize * 0.4}"/><line x1="${rightX - eyeSize * 0.4}" y1="${cy - eyeSize * 0.4}" x2="${rightX + eyeSize * 0.4}" y2="${cy + eyeSize * 0.4}"/><line x1="${rightX - eyeSize * 0.4}" y1="${cy + eyeSize * 0.4}" x2="${rightX + eyeSize * 0.4}" y2="${cy - eyeSize * 0.4}"/></g>`,
    
    // Half-moons
    () => `<path d="M${leftX - eyeSize * 0.5} ${cy} A${eyeSize * 0.5} ${eyeSize * 0.5} 0 0 0 ${leftX + eyeSize * 0.5} ${cy}" fill="${FEATURE_COLOR}"/><path d="M${rightX - eyeSize * 0.5} ${cy} A${eyeSize * 0.5} ${eyeSize * 0.5} 0 0 0 ${rightX + eyeSize * 0.5} ${cy}" fill="${FEATURE_COLOR}"/>`,
    
    // Rectangles
    () => `<rect x="${leftX - eyeSize * 0.4}" y="${cy - eyeSize * 0.3}" width="${eyeSize * 0.8}" height="${eyeSize * 0.6}" fill="${FEATURE_COLOR}"/><rect x="${rightX - eyeSize * 0.4}" y="${cy - eyeSize * 0.3}" width="${eyeSize * 0.8}" height="${eyeSize * 0.6}" fill="${FEATURE_COLOR}"/>`
  ];
  
  return shapes[eyeType % shapes.length]();
}

// Mouth shapes
function renderMouth(mouthType, size, mouthY) {
  const cx = size / 2;
  const mouthSize = size * 0.08;
  
  const shapes = [
    // Arc smile
    () => `<path d="M${cx - mouthSize} ${mouthY} Q${cx} ${mouthY + mouthSize * 0.8} ${cx + mouthSize} ${mouthY}" fill="none" stroke="${FEATURE_COLOR}" stroke-width="${mouthSize * 0.3}" stroke-linecap="round"/>`,
    
    // Straight line
    () => `<line x1="${cx - mouthSize * 0.8}" y1="${mouthY}" x2="${cx + mouthSize * 0.8}" y2="${mouthY}" stroke="${FEATURE_COLOR}" stroke-width="${mouthSize * 0.25}" stroke-linecap="round"/>`,
    
    // Small circle
    () => `<circle cx="${cx}" cy="${mouthY}" r="${mouthSize * 0.4}" fill="${FEATURE_COLOR}"/>`,
    
    // Slight frown
    () => `<path d="M${cx - mouthSize} ${mouthY} Q${cx} ${mouthY - mouthSize * 0.5} ${cx + mouthSize} ${mouthY}" fill="none" stroke="${FEATURE_COLOR}" stroke-width="${mouthSize * 0.3}" stroke-linecap="round"/>`
  ];
  
  return shapes[mouthType % shapes.length]();
}

// Letter rendering
function renderLetter(letter, size, letterY) {
  const cx = size / 2;
  const fontSize = size * 0.19;
  const fontFamily = "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Liberation Mono', Menlo, monospace";
  
  return `<text x="${cx}" y="${letterY}" text-anchor="middle" dominant-baseline="middle" font-family="${fontFamily}" font-size="${fontSize}" font-weight="500" fill="${FEATURE_COLOR}">${letter.toUpperCase()}</text>`;
}

// Background gradient
function renderBackground(size, color, seed) {
  const gradientId = `bg-grad-${fnv1a(seed).toString(36)}`;
  
  return `<defs><radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${color}" stop-opacity="1"/><stop offset="100%" stop-color="${color}" stop-opacity="0.85"/></radialGradient></defs><rect width="${size}" height="${size}" fill="url(#${gradientId})"/>`;
}

// Main generator function
function generateAvatar(seed, options = {}) {
  const { size = 128, variant = 'face', colors = null } = options;
  
  if (!seed) seed = 'anonymous';
  
  const h1 = fnv1a(seed);
  const h2 = hash2(seed);
  
  const colorIdx = h1 % COLORS.length;
  const bgColor = colors ? (colors[0] || COLORS[colorIdx]) : COLORS[colorIdx];
  
  const eyeType = bits(h1, 0, 3);
  const eyeSpacing = size * (0.12 + (bits(h1, 3, 2) / 3) * 0.06);
  const eyeSize = size * (0.08 + (bits(h1, 5, 2) / 3) * 0.04);
  const verticalPos = size * (-0.08 + (bits(h1, 7, 3) / 7) * 0.16);
  
  const mouthType = bits(h2, 0, 2);
  const mouthY = size * 0.5 + size * 0.15;
  
  const background = renderBackground(size, bgColor, seed);
  const eyes = renderEyes(eyeType, size, eyeSpacing, eyeSize, verticalPos);
  
  let feature;
  if (variant === 'initial') {
    const firstLetter = seed.charAt(0);
    feature = renderLetter(firstLetter, size, mouthY);
  } else {
    feature = renderMouth(mouthType, size, mouthY);
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${background}${eyes}${feature}</svg>`;
}

export { generateAvatar, fnv1a };
export default generateAvatar;
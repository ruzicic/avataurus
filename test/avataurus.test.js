import { describe, expect, it } from 'vitest';
import { generateAvatar } from '../src/avataurus.js';

describe('generateAvatar', () => {
  it('returns valid SVG', () => {
    const svg = generateAvatar('test');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('is deterministic — same input produces same output', () => {
    const a = generateAvatar('hello');
    const b = generateAvatar('hello');
    expect(a).toBe(b);
  });

  it('different inputs produce different outputs', () => {
    const a = generateAvatar('alice');
    const b = generateAvatar('bob');
    expect(a).not.toBe(b);
  });

  it('respects size option', () => {
    const svg = generateAvatar('test', { size: 256 });
    expect(svg).toContain('width="256"');
    expect(svg).toContain('height="256"');
    expect(svg).toContain('viewBox="0 0 256 256"');
  });

  it('respects variant option - face variant', () => {
    const face = generateAvatar('test', { variant: 'face' });
    expect(face).toContain('<svg');
    // Face variant should not contain text elements (just visual elements)
    expect(face).not.toContain('<text');
  });

  it('respects variant option - initial variant', () => {
    const initial = generateAvatar('Alice', { variant: 'initial' });
    expect(initial).toContain('<text');
    expect(initial).toContain('>A</text>');
    expect(initial).toContain('monospace');
  });

  it('different variants produce different outputs', () => {
    const face = generateAvatar('test', { variant: 'face' });
    const initial = generateAvatar('test', { variant: 'initial' });
    expect(face).not.toBe(initial);
  });

  it('respects custom colors', () => {
    const colors = ['#FF0000'];
    const svg = generateAvatar('test', { colors });
    expect(svg).toContain('#FF0000');
  });

  it('handles empty string', () => {
    const svg = generateAvatar('');
    expect(svg).toContain('<svg');
  });

  it('handles null/undefined seed', () => {
    const svg1 = generateAvatar(null);
    const svg2 = generateAvatar(undefined);
    expect(svg1).toContain('<svg');
    expect(svg2).toContain('<svg');
    expect(svg1).toBe(svg2); // Both should default to 'anonymous'
  });

  it('handles very long string', () => {
    const long = 'a'.repeat(10000);
    const svg = generateAvatar(long);
    expect(svg).toContain('<svg');
  });

  it('handles unicode characters', () => {
    const svg = generateAvatar('日本語テスト🦕');
    expect(svg).toContain('<svg');
  });

  it('handles special characters', () => {
    const svg = generateAvatar('<script>alert("xss")</script>');
    expect(svg).toContain('<svg');
    // Should not contain raw script content in SVG
    expect(svg).not.toContain('<script>');
  });

  it('unicode inputs are deterministic', () => {
    const a = generateAvatar('🦕🦖');
    const b = generateAvatar('🦕🦖');
    expect(a).toBe(b);
  });

  it('default size is 128', () => {
    const svg = generateAvatar('test');
    expect(svg).toContain('width="128"');
    expect(svg).toContain('height="128"');
  });

  it('default variant is face', () => {
    const svg = generateAvatar('test');
    expect(svg).not.toContain('<text'); // face variant has no text
  });

  it('produces different eyes for different inputs', () => {
    // Generate multiple avatars and ensure they're different
    const avatars = ['alice', 'bob', 'charlie', 'diana', 'elena'].map((name) =>
      generateAvatar(name, { variant: 'face' }),
    );

    // All should be different
    for (let i = 0; i < avatars.length; i++) {
      for (let j = i + 1; j < avatars.length; j++) {
        expect(avatars[i]).not.toBe(avatars[j]);
      }
    }
  });

  it('initial variant shows first character in uppercase', () => {
    const svg = generateAvatar('hello', { variant: 'initial' });
    expect(svg).toContain('>H</text>');

    const svg2 = generateAvatar('world', { variant: 'initial' });
    expect(svg2).toContain('>W</text>');
  });

  it('contains background gradient', () => {
    const svg = generateAvatar('test');
    expect(svg).toContain('radialGradient');
    expect(svg).toContain('<defs>');
  });

  it('contains feature color for eyes and elements', () => {
    const svg = generateAvatar('test');
    expect(svg).toContain('#1a1a2e'); // FEATURE_COLOR
  });
});

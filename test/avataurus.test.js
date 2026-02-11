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
  });

  it('respects variant option', () => {
    const gradient = generateAvatar('test', { variant: 'gradient' });
    const solid = generateAvatar('test', { variant: 'solid' });
    expect(gradient).not.toBe(solid);
    expect(gradient).toContain('linearGradient');
  });

  it('respects showInitial option', () => {
    const withInitial = generateAvatar('Alice', { showInitial: true });
    const without = generateAvatar('Alice', { showInitial: false });
    expect(withInitial).toContain('<text');
    expect(withInitial).toContain('>A</text>');
    expect(without).not.toContain('<text');
  });

  it('respects custom colors', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF'];
    const svg = generateAvatar('test', { colors });
    expect(svg).toContain('#FF0000');
    expect(svg).toContain('#00FF00');
  });

  it('handles empty string', () => {
    const svg = generateAvatar('');
    expect(svg).toContain('<svg');
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
});

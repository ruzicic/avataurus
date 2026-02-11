/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import '../src/element.js';

describe('Avataurus web component', () => {
  it('is registered as a custom element', () => {
    expect(customElements.get('avataurus-el')).toBeDefined();
  });

  it('renders SVG in shadow DOM', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    document.body.appendChild(el);
    const svg = el.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
    document.body.removeChild(el);
  });

  it('updates when seed attribute changes', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'alice');
    document.body.appendChild(el);
    const svg1 = el.shadowRoot.innerHTML;
    el.setAttribute('seed', 'bob');
    const svg2 = el.shadowRoot.innerHTML;
    expect(svg1).not.toBe(svg2);
    document.body.removeChild(el);
  });

  it('respects size attribute', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    el.setAttribute('size', '96');
    document.body.appendChild(el);
    const svg = el.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('96');
    document.body.removeChild(el);
  });

  it('respects variant attribute', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    el.setAttribute('variant', 'initial');
    document.body.appendChild(el);
    const shadowContent = el.shadowRoot.innerHTML;
    expect(shadowContent).toContain('<text');
    document.body.removeChild(el);
  });

  it('defaults to face variant', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    document.body.appendChild(el);
    const shadowContent = el.shadowRoot.innerHTML;
    expect(shadowContent).not.toContain('<text');
    document.body.removeChild(el);
  });

  it('respects colors attribute', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    el.setAttribute('colors', '#FF0000, #00FF00, #0000FF');
    document.body.appendChild(el);
    const shadowContent = el.shadowRoot.innerHTML;
    expect(shadowContent).toContain('#FF0000');
    document.body.removeChild(el);
  });

  it('has default size of 48', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    document.body.appendChild(el);
    const style = el.shadowRoot.querySelector('style');
    expect(style.textContent).toContain('width: 48px');
    expect(style.textContent).toContain('height: 48px');
    document.body.removeChild(el);
  });

  it('can disable hover animation', () => {
    const el = document.createElement('avataurus-el');
    el.setAttribute('seed', 'test');
    el.setAttribute('no-hover', '');
    document.body.appendChild(el);
    const style = el.shadowRoot.querySelector('style');
    expect(style.textContent).not.toContain('hover');
    document.body.removeChild(el);
  });

  it('defaults seed to anonymous', () => {
    const el = document.createElement('avataurus-el');
    document.body.appendChild(el);
    const svg = el.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
    document.body.removeChild(el);
  });
});

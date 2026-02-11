/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import '../src/element.js';

describe('AvatarUs web component', () => {
  it('is registered as a custom element', () => {
    expect(customElements.get('avatar-us')).toBeDefined();
  });

  it('renders SVG in shadow DOM', () => {
    const el = document.createElement('avatar-us');
    el.setAttribute('name', 'test');
    document.body.appendChild(el);
    const svg = el.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
    document.body.removeChild(el);
  });

  it('updates when name attribute changes', () => {
    const el = document.createElement('avatar-us');
    el.setAttribute('name', 'alice');
    document.body.appendChild(el);
    const svg1 = el.shadowRoot.innerHTML;
    el.setAttribute('name', 'bob');
    const svg2 = el.shadowRoot.innerHTML;
    expect(svg1).not.toBe(svg2);
    document.body.removeChild(el);
  });

  it('respects size attribute', () => {
    const el = document.createElement('avatar-us');
    el.setAttribute('name', 'test');
    el.setAttribute('size', '96');
    document.body.appendChild(el);
    const svg = el.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('96');
    document.body.removeChild(el);
  });
});

/**
 * Avataurus Web Component
 * <avataurus name="john" size="48" variant="gradient" show-initial></avataurus>
 *
 * Attributes:
 *   name       - String to generate avatar from
 *   size       - Pixel size (default: 48)
 *   variant    - 'gradient' or 'solid'
 *   show-initial - Show first letter overlay
 *   colors     - JSON array of 4 colors
 *   no-hover   - Disable hover animation
 */

import { generateAvatar } from './avataurus.js';

class Avataurus extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'size', 'colors', 'variant', 'show-initial', 'no-hover'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute('name') || 'anonymous';
    const size = parseInt(this.getAttribute('size') || '48', 10);
    const variant = this.getAttribute('variant') || 'gradient';
    const showInitial = this.hasAttribute('show-initial');
    const noHover = this.hasAttribute('no-hover');
    const colorsAttr = this.getAttribute('colors');
    let colors = null;
    if (colorsAttr) {
      try { colors = JSON.parse(colorsAttr); } catch(e) { /* ignore */ }
    }

    const svg = generateAvatar(name, { size, colors, showInitial, variant });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          line-height: 0;
          width: ${size}px;
          height: ${size}px;
        }
        .avatar-wrap {
          display: inline-block;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        ${noHover ? '' : `.avatar-wrap:hover {
          transform: scale(1.05) rotate(1.5deg);
        }`}
        svg {
          border-radius: 20%;
          display: block;
        }
      </style>
      <div class="avatar-wrap">${svg}</div>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('avataurus')) {
  customElements.define('avataurus', Avataurus);
}

export { Avataurus };
export default Avataurus;

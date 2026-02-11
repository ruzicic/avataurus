/**
 * Avataurus Web Component
 * <avataurus seed="john" size="48" variant="face"></avataurus>
 *
 * Attributes:
 *   seed       - String to generate avatar from (required)
 *   size       - Pixel size (default: 48)
 *   variant    - 'face' (default) or 'initial'
 *   colors     - Comma-separated color values
 *   no-hover   - Disable hover animation
 */

import { generateAvatar } from './avataurus.js';

class AvataurusEl extends HTMLElement {
  static get observedAttributes() {
    return ['seed', 'size', 'variant', 'colors', 'no-hover'];
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
    const seed = this.getAttribute('seed') || 'anonymous';
    const size = parseInt(this.getAttribute('size') || '48', 10);
    const variant = this.getAttribute('variant') || 'face';
    const noHover = this.hasAttribute('no-hover');
    
    // Parse colors from comma-separated string
    const colorsAttr = this.getAttribute('colors');
    let colors = null;
    if (colorsAttr) {
      colors = colorsAttr.split(',').map(c => c.trim()).filter(Boolean);
    }

    const svg = generateAvatar(seed, { size, variant, colors });

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
        ${
          noHover
            ? ''
            : `.avatar-wrap:hover {
          transform: scale(1.05) rotate(1.5deg);
        }`
        }
        svg {
          border-radius: 20%;
          display: block;
        }
      </style>
      <div class="avatar-wrap">${svg}</div>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('avataurus-el')) {
  customElements.define('avataurus-el', AvataurusEl);
}

export { AvataurusEl };
export default AvataurusEl;
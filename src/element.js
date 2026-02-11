/**
 * Avataurus Web Component
 * <avatar-us name="john" size="48" variant="gradient" show-initial></avatar-us>
 */

import { generateAvatar } from './avataurus.js';

class AvatarUs extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'size', 'colors', 'variant', 'show-initial'];
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
        svg {
          border-radius: 20%;
        }
      </style>
      ${svg}
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('avatar-us')) {
  customElements.define('avatar-us', AvatarUs);
}

export { AvatarUs };
export default AvatarUs;

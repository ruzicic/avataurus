import { generateAvatar } from '../src/avataurus.js';
import { landingPage } from './landing.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    // Landing page
    if (path === '/' || path === '') {
      return new Response(landingPage(generateAvatar), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Favicon - use actual avataurus instead of emoji
    if (path === '/favicon.ico') {
      const svg = generateAvatar('avataurus', { size: 32, variant: 'initial' });
      return new Response(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Handle .svg extension
    let seed = path.slice(1);
    if (seed.endsWith('.svg')) {
      seed = seed.slice(0, -4);
    }

    if (!seed) {
      return new Response('Seed required', { status: 400 });
    }

    const size = parseInt(url.searchParams.get('size') || '128', 10);
    const variant = url.searchParams.get('variant') || 'face';
    const clampedSize = Math.min(Math.max(size, 16), 512);

    // Validate variant
    if (!['face', 'initial'].includes(variant)) {
      return new Response('Invalid variant. Use "face" or "initial".', { status: 400 });
    }

    const svg = generateAvatar(seed, {
      size: clampedSize,
      variant,
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        Vary: 'Accept',
      },
    });
  },
};

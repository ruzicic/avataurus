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

    // Favicon
    if (path === '/favicon.ico') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🦕</text></svg>`;
      return new Response(svg, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' },
      });
    }

    // Avatar route: /:name
    const name = path.slice(1); // remove leading /
    if (!name) {
      return new Response('Name required', { status: 400 });
    }

    const size = parseInt(url.searchParams.get('size') || '128', 10);
    const variant = url.searchParams.get('variant') || 'gradient';
    const showInitial = url.searchParams.get('initial') === 'true';
    const mood = url.searchParams.get('mood') || null;
    const species = url.searchParams.get('species') || null;
    const clampedSize = Math.min(Math.max(size, 16), 512);

    const svg = generateAvatar(name, {
      size: clampedSize,
      variant,
      showInitial,
      mood,
      species,
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept',
      },
    });
  },
};

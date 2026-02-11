import { generateAvatar } from '../src/avataurus.js';
import { landingPage } from './landing.js';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    // robots.txt
    if (path === '/robots.txt') {
      return new Response('User-agent: *\nAllow: /\nSitemap: https://avataurus.com/sitemap.xml\n', {
        headers: { 'Content-Type': 'text/plain', ...SECURITY_HEADERS },
      });
    }

    // sitemap.xml
    if (path === '/sitemap.xml') {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://avataurus.com/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>`,
        {
          headers: { 'Content-Type': 'application/xml', ...SECURITY_HEADERS },
        },
      );
    }

    // Landing page
    if (path === '/' || path === '') {
      return new Response(landingPage(generateAvatar), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          ...SECURITY_HEADERS,
        },
      });
    }

    // Favicon
    if (path === '/favicon.ico') {
      const svg = generateAvatar('avataurus', { size: 32, variant: 'initial' });
      return new Response(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
          ...SECURITY_HEADERS,
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
        ...SECURITY_HEADERS,
      },
    });
  },
};

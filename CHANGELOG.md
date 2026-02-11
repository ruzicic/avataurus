# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-11

### Added
- Minimal face avatar generation from any string — deterministic, pure math, zero dependencies
- Two variants: **face** (eyes + mouth) and **initial** (eyes + first letter)
- Curated 30-color palette for vibrant, accessible backgrounds
- 8 eye shapes, 4 mouth expressions, variable spacing for millions of unique combinations
- Web component `<avataurus>` with Shadow DOM isolation and optional hover animation
- JavaScript API: `generateAvatar(seed, options)` returns SVG string
- Cloudflare Worker for URL-based avatar service (`https://avataurus.com/<seed>`)
- Query params: `?size=`, `?variant=`, custom colors
- TypeScript type definitions included
- Sub-millisecond generation, ~4KB gzipped
- Works in browsers (ES2020+), Node.js 18+, and edge runtimes (Workers, Deno, Bun)

[1.0.0]: https://github.com/ruzicic/avataurus/releases/tag/v1.0.0

export function landingPage(generateAvatar) {
  // Generate example avatars for gallery
  const examples = [
    'alice', 'bob', 'charlie', 'diana', 'elena', 'frank', 'grace', 'hiro',
    'ivan', 'julia', 'kai', 'luna', 'marco', 'nina', 'oscar', 'petra'
  ];
  
  const exampleSvgs = examples.map((name) => ({
    name,
    svg64: btoa(generateAvatar(name, { size: 80, variant: 'face' })),
  }));

  const sizeDemos = [32, 48, 64, 96, 128].map((size) => ({
    size,
    svg64: btoa(generateAvatar('demo', { size, variant: 'face' })),
  }));

  // Generate variant comparison examples
  const variantExamples = ['alex', 'sam', 'taylor', 'river'].map((name) => ({
    name,
    face: btoa(generateAvatar(name, { size: 64, variant: 'face' })),
    initial: btoa(generateAvatar(name, { size: 64, variant: 'initial' })),
  }));

  // Decorative avatars for hero
  const heroAvatars = ['cosmos', 'nebula', 'orbit', 'stellar', 'quantum'].map((name) => ({
    name,
    svg64: btoa(generateAvatar(name, { size: 48, variant: 'face' })),
  }));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Avataurus — Deterministic Minimal Face Avatars</title>
<meta name="description" content="Generate unique minimal face avatars from any string. Same input, same face — forever. Zero dependencies, pure SVG math."/>
<link rel="icon" href="data:image/svg+xml;base64,${btoa(generateAvatar('avataurus', { size: 32, variant: 'initial' }))}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}

:root{
  --bg:#FEFEFE;--bg-subtle:#F8F9FA;--fg:#1A1D21;--muted:#6B7280;
  --card:#FFFFFF;--border:#E5E7EB;--accent:#F59E0B;--accent2:#E76F51;
  --primary:#2A9D8F;--code-bg:#0D1117;--code-fg:#E6EDF3;
  --shadow:0 1px 3px rgba(0,0,0,0.05),0 1px 2px rgba(0,0,0,0.1);
  --shadow-lg:0 4px 6px rgba(0,0,0,0.05),0 10px 15px rgba(0,0,0,0.1);
  --radius:12px;
  --font-display:'Space Grotesk',system-ui,sans-serif;
  --font-body:'Space Grotesk',system-ui,sans-serif;
  --font-mono:'JetBrains Mono','SF Mono',Consolas,monospace;
  --code-comment:#8B949E;--code-keyword:#FF7B72;--code-string:#A5D6FF;
  --code-func:#D2A8FF;--code-tag:#7EE787;--code-attr:#79C0FF;
}

.dark{
  --bg:#0A0A0A;--bg-subtle:#111111;--fg:#F4F4F5;--muted:#9CA3AF;
  --card:#161616;--border:#262626;--accent:#F59E0B;--accent2:#E76F51;
  --primary:#2A9D8F;--shadow:0 1px 3px rgba(0,0,0,0.3),0 1px 2px rgba(0,0,0,0.4);
  --shadow-lg:0 4px 6px rgba(0,0,0,0.3),0 10px 15px rgba(0,0,0,0.4);
}

html{scroll-behavior:smooth}
::selection{background:#F4A261;color:#1A1D21}
::-moz-selection{background:#F4A261;color:#1A1D21}
body{
  font-family:var(--font-body);
  background:var(--bg);color:var(--fg);line-height:1.6;
  transition:background 0.3s,color 0.3s;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
}

a{color:var(--primary);text-decoration:none;transition:color 0.2s,opacity 0.2s}
a:hover{color:var(--accent)}

.container{max-width:1200px;margin:0 auto;padding:0 24px}

/* Header */
header{
  display:flex;align-items:center;justify-content:space-between;
  padding:24px 0;
}
.logo{
  display:flex;align-items:center;gap:12px;font-weight:700;
  font-size:1.25rem;color:var(--fg);letter-spacing:-0.02em;
  font-family:var(--font-display);
}
.logo-avatar{border-radius:8px}
.logo-badge{
  background:var(--primary);color:#fff;padding:2px 8px;
  border-radius:6px;font-size:0.7rem;font-weight:600;
  font-family:var(--font-mono);
}

.nav{display:flex;align-items:center;gap:24px}
.nav a{color:var(--muted);font-weight:500;font-size:0.9rem}
.nav a:hover{color:var(--fg)}

.theme-toggle{
  background:var(--card);border:1px solid var(--border);
  border-radius:8px;padding:8px 12px;cursor:pointer;
  transition:all 0.2s;color:var(--muted);display:flex;align-items:center;
}
.theme-toggle:hover{border-color:var(--accent);color:var(--fg);transform:scale(1.05)}
.theme-toggle svg{width:18px;height:18px}

/* Hero */
.hero{
  text-align:center;padding:100px 0 60px;max-width:900px;margin:0 auto;
  position:relative;
}
.hero-statement{
  font-family:var(--font-display);
  font-size:clamp(3rem,7vw,5.5rem);font-weight:700;
  line-height:1.05;margin-bottom:32px;letter-spacing:-0.04em;
}
.hero-statement .line-muted{
  color:var(--muted);
}
.hero-statement .line-accent{
  background:linear-gradient(135deg,var(--primary),var(--accent));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero p{
  font-size:1.25rem;color:var(--muted);margin-bottom:0;
  line-height:1.6;max-width:560px;margin-left:auto;margin-right:auto;
}
.hero-avatars{
  display:flex;justify-content:center;gap:12px;margin-bottom:48px;
}
.hero-avatars img{
  border-radius:20%;opacity:0.7;transition:all 0.3s;
}
.hero-avatars img:hover{opacity:1;transform:scale(1.15) rotate(2deg)}

/* Live Demo */
.demo-section{
  background:var(--card);border:1px solid var(--border);
  border-radius:20px;padding:56px 48px;margin:64px 0;
  box-shadow:var(--shadow-lg);
}
.demo-section h2{
  font-family:var(--font-display);font-size:1.5rem;font-weight:600;
  text-align:center;margin-bottom:40px;letter-spacing:-0.02em;
  color:var(--muted);
}

.demo-main-avatar{
  display:flex;justify-content:center;margin-bottom:24px;
}
.demo-main-avatar img{
  border-radius:24%;box-shadow:var(--shadow-lg);
  transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.demo-main-avatar img:hover{transform:scale(1.04) rotate(1deg)}

.demo-variants{
  display:flex;justify-content:center;gap:32px;margin-bottom:36px;
}
.demo-variant-item{text-align:center}
.demo-variant-item img{
  border-radius:20%;box-shadow:var(--shadow);
  transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.demo-variant-item img:hover{transform:scale(1.1)}
.demo-variant-item span{
  display:block;font-size:0.75rem;color:var(--muted);
  margin-top:8px;font-weight:500;font-family:var(--font-mono);
}

.demo-input-wrap{
  display:flex;justify-content:center;
}
.demo-input{
  font-family:var(--font-body);
  font-size:1.1rem;padding:16px 24px;border:2px solid var(--border);
  border-radius:12px;background:var(--bg-subtle);color:var(--fg);
  outline:none;width:400px;max-width:100%;transition:all 0.2s;
  font-weight:500;text-align:center;
}
.demo-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(42,157,143,0.15)}

/* Variants Showcase */
.variants-showcase{margin:80px 0}
.variants-showcase h2{
  font-family:var(--font-display);
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.03em;
}

.variant-toggle{
  display:flex;justify-content:center;margin-bottom:48px;
}
.variant-toggle-pill{
  display:flex;background:var(--bg-subtle);border:1px solid var(--border);
  border-radius:999px;padding:4px;gap:2px;
}
.variant-toggle-btn{
  font-family:var(--font-mono);font-size:0.85rem;font-weight:500;
  padding:8px 24px;border-radius:999px;border:none;cursor:pointer;
  background:transparent;color:var(--muted);transition:all 0.25s ease;
}
.variant-toggle-btn:hover{color:var(--fg)}
.variant-toggle-btn.active{
  background:var(--primary);color:#fff;box-shadow:0 2px 8px rgba(42,157,143,0.3);
}

.variants-subtitle{
  text-align:center;color:var(--muted);font-size:1.1rem;margin-bottom:48px;
}

.variants-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:32px;margin-bottom:48px;
}
.variant-demo{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--radius);padding:32px;text-align:center;
  box-shadow:var(--shadow);transition:transform 0.2s,box-shadow 0.2s;
}
.variant-demo:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.variant-demo h3{font-family:var(--font-display);font-size:1.25rem;font-weight:600;margin-bottom:8px}
.variant-demo p{color:var(--muted);margin-bottom:24px;font-size:0.95rem}
.variant-examples{display:flex;justify-content:center;gap:16px;flex-wrap:wrap}
.variant-item{text-align:center}
.variant-item img{
  border-radius:20%;box-shadow:var(--shadow);
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
.variant-item img:hover{transform:scale(1.1)}
.variant-item span{
  display:block;font-size:0.75rem;color:var(--muted);
  margin-top:8px;font-weight:500;font-family:var(--font-mono);
}

/* Code Section */
.code-section{margin:80px 0}
.code-section h2{
  font-family:var(--font-display);
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.03em;
}
.code-subtitle{
  text-align:center;color:var(--muted);font-size:1.1rem;margin-bottom:48px;
}

.code-tabs{
  display:flex;gap:0;margin-bottom:-1px;justify-content:center;
  flex-wrap:wrap;
}
.code-tab{
  padding:12px 24px;border:1px solid transparent;border-bottom:none;
  border-radius:8px 8px 0 0;cursor:pointer;color:var(--muted);
  background:transparent;transition:all 0.2s;font-weight:500;
  font-size:0.85rem;font-family:var(--font-mono);
}
.code-tab:hover{color:var(--fg);background:var(--bg-subtle)}
.code-tab.active,.code-tab.active:hover{
  background:var(--code-bg);border-color:var(--border);
  color:var(--code-fg);
}

.code-block{
  background:var(--code-bg);border:1px solid var(--border);
  border-radius:0 12px 12px 12px;padding:28px 32px;
  position:relative;overflow-x:auto;margin-bottom:32px;
}
.code-block pre{margin:0;font-family:var(--font-mono);font-size:0.875rem;line-height:1.7}
.code-block code{color:var(--code-fg)}
.code-block .hl-comment{color:var(--code-comment)}
.code-block .hl-keyword{color:var(--code-keyword)}
.code-block .hl-string{color:var(--code-string)}
.code-block .hl-func{color:var(--code-func)}
.code-block .hl-tag{color:var(--code-tag)}
.code-block .hl-attr{color:var(--code-attr)}

.copy-btn{
  position:absolute;top:16px;right:16px;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
  border-radius:6px;padding:6px 14px;cursor:pointer;
  color:var(--code-comment);transition:all 0.2s;font-size:0.7rem;
  font-weight:600;text-transform:uppercase;letter-spacing:0.08em;
  font-family:var(--font-mono);
}
.copy-btn:hover{background:var(--accent);color:var(--code-bg);border-color:var(--accent)}

/* Gallery */
.gallery-section{margin:80px 0}
.gallery-section h2{
  font-family:var(--font-display);
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.03em;
}
.gallery-subtitle{
  text-align:center;color:var(--muted);font-size:1.1rem;margin-bottom:48px;
}

.gallery{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));
  gap:20px;justify-items:center;
}
.gallery-item{text-align:center;transition:transform 0.25s ease}
.gallery-item:hover{transform:scale(1.08)}
.gallery-item img{
  border-radius:20%;box-shadow:var(--shadow);
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
.gallery-item span{
  display:block;font-size:0.7rem;color:var(--muted);
  margin-top:8px;font-weight:500;font-family:var(--font-mono);
}

/* Sizes */
.sizes-section{margin:80px 0;text-align:center}
.sizes-section h2{
  font-family:var(--font-display);
  font-size:2rem;font-weight:700;margin-bottom:16px;letter-spacing:-0.03em;
}
.sizes-subtitle{
  color:var(--muted);font-size:1.1rem;margin-bottom:48px;
}

.sizes{
  display:flex;align-items:end;gap:24px;justify-content:center;
  flex-wrap:wrap;
}
.size-item{text-align:center}
.size-item img{border-radius:20%;box-shadow:var(--shadow)}
.size-item span{
  display:block;font-size:0.7rem;color:var(--muted);
  margin-top:8px;font-weight:600;font-family:var(--font-mono);
}

/* Features */
.features-section{margin:80px 0}
.features-section h2{
  font-family:var(--font-display);
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.03em;
}
.features-subtitle{
  text-align:center;color:var(--muted);font-size:1.1rem;margin-bottom:48px;
}

.features{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:24px;
}
.feature{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);
  transition:transform 0.2s,border-color 0.2s;
}
.feature:hover{transform:translateY(-2px);border-color:var(--accent);box-shadow:var(--shadow-lg)}
.feature .feature-icon{
  width:48px;height:48px;border-radius:12px;margin-bottom:16px;
}
.feature h3{font-family:var(--font-display);font-size:1.1rem;font-weight:600;margin-bottom:8px}
.feature p{color:var(--muted);font-size:0.95rem;line-height:1.5}

/* Footer */
footer{
  margin-top:100px;padding:60px 0 0;text-align:center;
  border-top:1px solid var(--border);color:var(--muted);
  overflow:hidden;
}
.footer-content{padding-bottom:48px}
.footer-attribution{
  font-size:0.95rem;margin-bottom:20px;
}
.footer-attribution a{color:var(--fg);font-weight:600}
.footer-attribution a:hover{color:var(--primary)}
.footer-links{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}
.footer-links a{color:var(--muted);font-size:0.85rem;font-family:var(--font-mono)}
.footer-links a:hover{color:var(--fg)}

.footer-giant{
  font-family:var(--font-mono);
  font-weight:700;
  letter-spacing:0.05em;
  line-height:0.85;
  color:var(--fg);
  opacity:0.04;
  user-select:none;
  padding-top:32px;
  white-space:nowrap;
  width:100vw;
  margin-left:calc(-50vw + 50%);
  text-align:center;
  margin-bottom:-0.1em;
  overflow:hidden;
  font-size:10vw;
}

@media(max-width:768px){
  .container{padding:0 16px}
  .hero{padding:60px 0 40px}
  .demo-section{padding:36px 20px;border-radius:16px}
  .demo-input{width:100%}
  .demo-variants{gap:20px}
  .variants-grid{grid-template-columns:1fr}
  .gallery{grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:16px}
  .sizes{gap:16px}
  .code-block{padding:20px 16px}
}
</style>
</head>
<body>
<div class="container">
  <header>
    <div class="logo">
      <img src="data:image/svg+xml;base64,${btoa(generateAvatar('avataurus', { size: 32, variant: 'initial' }))}" 
           width="32" height="32" class="logo-avatar" alt="Avataurus"/>
      Avataurus
      <span class="logo-badge">v2.0</span>
    </div>
    <nav class="nav">
      <a href="https://github.com/ruzicic/avataurus">GitHub</a>
      <a href="https://www.npmjs.com/package/avataurus">npm</a>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
        <svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </nav>
  </header>

  <section class="hero">
    <div class="hero-avatars">
      ${heroAvatars.map(a => `<img src="data:image/svg+xml;base64,${a.svg64}" width="48" height="48" alt="" />`).join('')}
    </div>
    <div class="hero-statement">
      <span class="line-muted">Every string</span><br/>
      <span class="line-muted">deserves</span> <span class="line-accent">a face</span>
    </div>
    <p>
      Deterministic SVG avatars from pure math. Same input, same face — forever. Zero dependencies, sub-millisecond, edge-native.
    </p>
  </section>

  <div class="demo-section">
    <h2>Try it</h2>
    <div class="demo-main-avatar" id="demoMain"></div>
    <div class="demo-variants" id="demoVariants"></div>
    <div class="demo-input-wrap">
      <input class="demo-input" id="demoInput" type="text" 
             placeholder="Type anything..." value="avataurus" autocomplete="off"/>
    </div>
  </div>

  <section class="variants-showcase">
    <h2>Two Variants</h2>
    <p class="variants-subtitle">Choose between expressive faces or clean initials</p>
    
    <div class="variant-toggle">
      <div class="variant-toggle-pill">
        <button class="variant-toggle-btn active" onclick="updateAllAvatars('face')">face</button>
        <button class="variant-toggle-btn" onclick="updateAllAvatars('initial')">initial</button>
      </div>
    </div>
    
    <div class="variants-grid">
      <div class="variant-demo">
        <h3>Face</h3>
        <p>Eyes + mouth expressions on colored backgrounds</p>
        <div class="variant-examples" id="variantFaceExamples">
          ${variantExamples.map(e => `
            <div class="variant-item">
              <img src="data:image/svg+xml;base64,${e.face}" width="64" height="64" alt="${e.name}"/>
              <span>${e.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="variant-demo">
        <h3>Initial</h3>
        <p>Eyes + first letter in monospace font</p>
        <div class="variant-examples" id="variantInitialExamples">
          ${variantExamples.map(e => `
            <div class="variant-item">
              <img src="data:image/svg+xml;base64,${e.initial}" width="64" height="64" alt="${e.name}"/>
              <span>${e.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="code-section">
    <h2>Usage</h2>
    <p class="code-subtitle">URL, web component, or JavaScript</p>
    
    <div class="code-tabs">
      <button class="code-tab active" onclick="showTab(0)">URL</button>
      <button class="code-tab" onclick="showTab(1)">Component</button>
      <button class="code-tab" onclick="showTab(2)">JavaScript</button>
      <button class="code-tab" onclick="showTab(3)">Install</button>
    </div>
    
    <div class="code-block">
      <button class="copy-btn" onclick="copyCode()">Copy</button>
      <pre><code id="codeContent"></code></pre>
    </div>
  </section>

  <section class="gallery-section">
    <h2>Gallery</h2>
    <p class="gallery-subtitle">Same algorithm, endless variety</p>
    
    <div class="gallery">
      ${exampleSvgs.map(e => `
        <div class="gallery-item">
          <img src="data:image/svg+xml;base64,${e.svg64}" width="80" height="80" alt="${e.name}"/>
          <span>${e.name}</span>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="sizes-section">
    <h2>Scale</h2>
    <p class="sizes-subtitle">Sharp at every size — it's vectors all the way down</p>
    
    <div class="sizes">
      ${sizeDemos.map(s => `
        <div class="size-item">
          <img src="data:image/svg+xml;base64,${s.svg64}" width="${s.size}" height="${s.size}" alt="${s.size}px"/>
          <span>${s.size}px</span>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="features-section">
    <h2>Features</h2>
    <p class="features-subtitle">Built for modern web development</p>
    
    <div class="features">
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('deterministic', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt=""/>
        <h3>Deterministic</h3>
        <p>Same input always produces the same output. No randomness, no database, no state changes over time.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('lightweight', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt=""/>
        <h3>Zero Dependencies</h3>
        <p>Pure JavaScript with no external dependencies. Ships as a single 4KB gzipped file.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('scalable', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt=""/>
        <h3>Vector Graphics</h3>
        <p>Pure SVG output scales perfectly from 16px thumbnails to high-DPI displays without quality loss.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('edge', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt=""/>
        <h3>Edge Native</h3>
        <p>Runs on Cloudflare Workers at 200+ locations worldwide. Sub-millisecond generation times.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('component', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt=""/>
        <h3>Web Component</h3>
        <p>Drop-in &lt;avataurus&gt; element with Shadow DOM isolation. Works with any framework.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('accessible', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt=""/>
        <h3>Accessible</h3>
        <p>Semantic HTML, proper alt text, keyboard navigation, and screen reader support built in.</p>
      </div>
    </div>
  </section>
</div>

<footer>
  <div class="container">
    <div class="footer-content">
      <p class="footer-attribution">A project by <a href="https://mladenruzicic.com">Mladen Ruzicic</a></p>
      <div class="footer-links">
        <a href="https://github.com/ruzicic/avataurus">Source</a>
        <a href="https://www.npmjs.com/package/avataurus">npm</a>
        <a href="https://github.com/ruzicic/avataurus/issues">Issues</a>
      </div>
    </div>
  </div>
  <div class="footer-giant" aria-hidden="true">
    <svg viewBox="0 0 1000 120" preserveAspectRatio="none" style="width:100vw;display:block;margin-left:calc(-50vw + 50%)">
      <text x="500" y="100" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-weight="700" font-size="130" letter-spacing="8" fill="currentColor">AVATAURUS</text>
    </svg>
  </div>
</footer>

<script>
// Theme management
const moonPath = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z';
const sunPath = 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42';
const sunCircle = 'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z';

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('avataurus-theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('themeIcon');
  if (isDark) {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

// Initialize theme
(function() {
  const theme = localStorage.getItem('avataurus-theme');
  if (theme === 'dark' || (theme === null && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    updateThemeIcon(true);
  }
})();

// Code examples with syntax highlighting
const codeExamples = [
{plain: \`<!-- Use as image URL -->
<img src="https://avataurus.com/john" width="48" height="48" />

<!-- With options -->
<img src="https://avataurus.com/john?size=128&variant=initial" />
<img src="https://avataurus.com/jane?size=64&variant=face" />\`,
html: \`<span class="hl-comment">&lt;!-- Use as image URL --&gt;</span>
<span class="hl-keyword">&lt;img</span> <span class="hl-attr">src</span>=<span class="hl-string">"https://avataurus.com/john"</span> <span class="hl-attr">width</span>=<span class="hl-string">"48"</span> <span class="hl-attr">height</span>=<span class="hl-string">"48"</span> <span class="hl-keyword">/&gt;</span>

<span class="hl-comment">&lt;!-- With options --&gt;</span>
<span class="hl-keyword">&lt;img</span> <span class="hl-attr">src</span>=<span class="hl-string">"https://avataurus.com/john?size=128&amp;variant=initial"</span> <span class="hl-keyword">/&gt;</span>
<span class="hl-keyword">&lt;img</span> <span class="hl-attr">src</span>=<span class="hl-string">"https://avataurus.com/jane?size=64&amp;variant=face"</span> <span class="hl-keyword">/&gt;</span>\`},

{plain: \`<!-- Load the web component -->
<script type="module" src="https://unpkg.com/avataurus/src/element.js"><\\/script>

<!-- Use it anywhere -->
<avataurus seed="john" size="48"></avataurus>
<avataurus seed="jane" size="64" variant="initial"></avataurus>
<avataurus seed="team" size="32" no-hover></avataurus>\`,
html: \`<span class="hl-comment">&lt;!-- Load the web component --&gt;</span>
<span class="hl-keyword">&lt;script</span> <span class="hl-attr">type</span>=<span class="hl-string">"module"</span> <span class="hl-attr">src</span>=<span class="hl-string">"https://unpkg.com/avataurus/src/element.js"</span><span class="hl-keyword">&gt;&lt;/script&gt;</span>

<span class="hl-comment">&lt;!-- Use it anywhere --&gt;</span>
<span class="hl-keyword">&lt;avataurus</span> <span class="hl-attr">seed</span>=<span class="hl-string">"john"</span> <span class="hl-attr">size</span>=<span class="hl-string">"48"</span><span class="hl-keyword">&gt;&lt;/avataurus&gt;</span>
<span class="hl-keyword">&lt;avataurus</span> <span class="hl-attr">seed</span>=<span class="hl-string">"jane"</span> <span class="hl-attr">size</span>=<span class="hl-string">"64"</span> <span class="hl-attr">variant</span>=<span class="hl-string">"initial"</span><span class="hl-keyword">&gt;&lt;/avataurus&gt;</span>
<span class="hl-keyword">&lt;avataurus</span> <span class="hl-attr">seed</span>=<span class="hl-string">"team"</span> <span class="hl-attr">size</span>=<span class="hl-string">"32"</span> <span class="hl-attr">no-hover</span><span class="hl-keyword">&gt;&lt;/avataurus&gt;</span>\`},

{plain: \`import { generateAvatar } from 'avataurus';

// Generate SVG string
const svg = generateAvatar('john', {
  size: 128,
  variant: 'face'
});

// Insert into DOM
document.getElementById('avatar').innerHTML = svg;

// Or use as data URL
const img = document.createElement('img');
img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);\`,
html: \`<span class="hl-keyword">import</span> { <span class="hl-func">generateAvatar</span> } <span class="hl-keyword">from</span> <span class="hl-string">'avataurus'</span>;

<span class="hl-comment">// Generate SVG string</span>
<span class="hl-keyword">const</span> svg = <span class="hl-func">generateAvatar</span>(<span class="hl-string">'john'</span>, {
  <span class="hl-attr">size</span>: <span class="hl-tag">128</span>,
  <span class="hl-attr">variant</span>: <span class="hl-string">'face'</span>
});

<span class="hl-comment">// Insert into DOM</span>
document.<span class="hl-func">getElementById</span>(<span class="hl-string">'avatar'</span>).innerHTML = svg;

<span class="hl-comment">// Or use as data URL</span>
<span class="hl-keyword">const</span> img = document.<span class="hl-func">createElement</span>(<span class="hl-string">'img'</span>);
img.src = <span class="hl-string">'data:image/svg+xml,'</span> + <span class="hl-func">encodeURIComponent</span>(svg);\`},

{plain: \`# Install via npm
npm install avataurus

# Or use CDN
https://unpkg.com/avataurus/src/avataurus.js
https://unpkg.com/avataurus/src/element.js

# TypeScript definitions included\`,
html: \`<span class="hl-comment"># Install via npm</span>
<span class="hl-func">npm</span> <span class="hl-tag">install</span> <span class="hl-string">avataurus</span>

<span class="hl-comment"># Or use CDN</span>
<span class="hl-attr">https://unpkg.com/avataurus/src/avataurus.js</span>
<span class="hl-attr">https://unpkg.com/avataurus/src/element.js</span>

<span class="hl-comment"># TypeScript definitions included</span>\`}
];

let currentTab = 0;
function showTab(index) {
  currentTab = index;
  document.querySelectorAll('.code-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
  document.getElementById('codeContent').innerHTML = codeExamples[index].html;
}

function copyCode() {
  navigator.clipboard.writeText(codeExamples[currentTab].plain);
  const btn = document.querySelector('.copy-btn');
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = 'Copy', 1500);
}

showTab(0);

// Live demo
const demoInput = document.getElementById('demoInput');
const demoMain = document.getElementById('demoMain');
const demoVariants = document.getElementById('demoVariants');

function updateDemo() {
  const seed = demoInput.value || 'anonymous';
  
  // Big main avatar
  demoMain.innerHTML = '<img src="/' + encodeURIComponent(seed) + '?size=180&variant=face" width="180" height="180" style="border-radius:24%;box-shadow:var(--shadow-lg);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" alt="Avatar for ' + seed + '"/>';
  
  // Two variants below
  demoVariants.innerHTML = ['face', 'initial'].map(function(variant) {
    return '<div class="demo-variant-item">' +
      '<img src="/' + encodeURIComponent(seed) + '?size=72&variant=' + variant + '" width="72" height="72" alt="' + seed + ' ' + variant + '"/>' +
      '<span>' + variant + '</span></div>';
  }).join('');
}

demoInput.addEventListener('input', updateDemo);
updateDemo();

// Global variant toggle
let currentVariant = 'face';
const variantNames = ['alex', 'sam', 'taylor', 'river'];
const galleryNames = ['alice', 'bob', 'charlie', 'diana', 'elena', 'frank', 'grace', 'hiro', 'ivan', 'julia', 'kai', 'luna', 'marco', 'nina', 'oscar', 'petra'];
const heroNames = ['cosmos', 'nebula', 'orbit', 'stellar', 'quantum'];

function updateAllAvatars(variant) {
  currentVariant = variant;
  
  // Update toggle buttons
  document.querySelectorAll('.variant-toggle-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.textContent.trim() === variant);
  });
  
  // Update main demo avatar
  var seed = demoInput.value || 'anonymous';
  demoMain.innerHTML = '<img src="/' + encodeURIComponent(seed) + '?size=180&variant=' + variant + '" width="180" height="180" style="border-radius:24%;box-shadow:var(--shadow-lg);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" alt="Avatar for ' + seed + '"/>';
  
  // Update demo variants (small ones below main)
  demoVariants.innerHTML = ['face', 'initial'].map(function(v) {
    return '<div class="demo-variant-item">' +
      '<img src="/' + encodeURIComponent(seed) + '?size=72&variant=' + v + '" width="72" height="72" alt="' + seed + ' ' + v + '"/>' +
      '<span>' + v + '</span></div>';
  }).join('');
  
  // Update gallery
  var gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.innerHTML = galleryNames.map(function(name) {
      return '<div class="gallery-item"><img src="/' + encodeURIComponent(name) + '?size=80&variant=' + variant + '" width="80" height="80" alt="' + name + '"/><span>' + name + '</span></div>';
    }).join('');
  }
  
  // Update hero avatars
  var heroContainer = document.querySelector('.hero-avatars');
  if (heroContainer) {
    heroContainer.innerHTML = heroNames.map(function(name) {
      return '<img src="/' + encodeURIComponent(name) + '?size=48&variant=' + variant + '" width="48" height="48" alt="" />';
    }).join('');
  }
  
  // Update variant showcase examples
  var faceExamples = document.getElementById('variantFaceExamples');
  var initialExamples = document.getElementById('variantInitialExamples');
  if (faceExamples) {
    faceExamples.innerHTML = variantNames.map(function(name) {
      return '<div class="variant-item"><img src="/' + encodeURIComponent(name) + '?size=64&variant=face" width="64" height="64" alt="' + name + '"/><span>' + name + '</span></div>';
    }).join('');
  }
  if (initialExamples) {
    initialExamples.innerHTML = variantNames.map(function(name) {
      return '<div class="variant-item"><img src="/' + encodeURIComponent(name) + '?size=64&variant=initial" width="64" height="64" alt="' + name + '"/><span>' + name + '</span></div>';
    }).join('');
  }
}

// Override updateDemo to respect current variant
var _origUpdateDemo = updateDemo;
updateDemo = function() {
  var seed = demoInput.value || 'anonymous';
  demoMain.innerHTML = '<img src="/' + encodeURIComponent(seed) + '?size=180&variant=' + currentVariant + '" width="180" height="180" style="border-radius:24%;box-shadow:var(--shadow-lg);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" alt="Avatar for ' + seed + '"/>';
  demoVariants.innerHTML = ['face', 'initial'].map(function(v) {
    return '<div class="demo-variant-item">' +
      '<img src="/' + encodeURIComponent(seed) + '?size=72&variant=' + v + '" width="72" height="72" alt="' + seed + ' ' + v + '"/>' +
      '<span>' + v + '</span></div>';
  }).join('');
};
</script>
</body>
</html>`;
}

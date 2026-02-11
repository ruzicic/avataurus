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

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Avataurus — Deterministic Minimal Face Avatars</title>
<meta name="description" content="Generate unique minimal face avatars from any string. Same input, same face — forever. Zero dependencies, pure SVG math."/>
<link rel="icon" href="data:image/svg+xml;base64,${btoa(generateAvatar('avataurus', { size: 32, variant: 'initial' }))}"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}

:root{
  --bg:#FEFEFE;--bg-subtle:#F8F9FA;--fg:#1A1D21;--muted:#6B7280;
  --card:#FFFFFF;--border:#E5E7EB;--accent:#F59E0B;--accent2:#EF4444;
  --primary:#3B82F6;--code-bg:#1E1E1E;--code-fg:#E4E4E7;
  --shadow:0 1px 3px rgba(0,0,0,0.05),0 1px 2px rgba(0,0,0,0.1);
  --shadow-lg:0 4px 6px rgba(0,0,0,0.05),0 10px 15px rgba(0,0,0,0.1);
  --radius:12px;--font-mono:'SF Mono','Fira Code','Cascadia Code',Consolas,'Liberation Mono',Menlo,monospace;
}

.dark{
  --bg:#0A0A0A;--bg-subtle:#111111;--fg:#F4F4F5;--muted:#9CA3AF;
  --card:#161616;--border:#262626;--accent:#F59E0B;--accent2:#EF4444;
  --primary:#60A5FA;--shadow:0 1px 3px rgba(0,0,0,0.3),0 1px 2px rgba(0,0,0,0.4);
  --shadow-lg:0 4px 6px rgba(0,0,0,0.3),0 10px 15px rgba(0,0,0,0.4);
}

html{scroll-behavior:smooth}
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  background:var(--bg);color:var(--fg);line-height:1.6;
  transition:background 0.3s,color 0.3s;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
}

a{color:var(--primary);text-decoration:none;transition:color 0.2s}
a:hover{color:var(--accent)}

.container{max-width:1200px;margin:0 auto;padding:0 24px}

/* Header */
header{
  display:flex;align-items:center;justify-content:space-between;
  padding:24px 0;margin-bottom:32px;
}
.logo{
  display:flex;align-items:center;gap:12px;font-weight:700;
  font-size:1.25rem;color:var(--fg);letter-spacing:-0.02em;
}
.logo-avatar{border-radius:8px}
.logo-badge{
  background:var(--primary);color:white;padding:2px 8px;
  border-radius:6px;font-size:0.75rem;font-weight:600;
}

.nav{display:flex;align-items:center;gap:24px}
.nav a{color:var(--muted);font-weight:500;font-size:0.9rem}
.nav a:hover{color:var(--fg)}

.theme-toggle{
  background:var(--card);border:1px solid var(--border);
  border-radius:8px;padding:8px 12px;cursor:pointer;
  transition:all 0.2s;color:var(--fg);font-size:0.9rem;
}
.theme-toggle:hover{border-color:var(--primary);background:var(--primary);color:white}

/* Hero */
.hero{
  text-align:center;padding:80px 0;max-width:800px;margin:0 auto;
}
.hero h1{
  font-size:clamp(2.5rem,5vw,4rem);font-weight:800;
  line-height:1.1;margin-bottom:24px;letter-spacing:-0.03em;
}
.hero h1 .gradient{
  background:linear-gradient(135deg,var(--primary),var(--accent));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero p{
  font-size:1.25rem;color:var(--muted);margin-bottom:48px;
  line-height:1.6;max-width:600px;margin-left:auto;margin-right:auto;
}

/* Live Demo */
.demo-section{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--radius);padding:48px;margin:48px 0;
  box-shadow:var(--shadow-lg);
}
.demo-input-wrap{
  display:flex;justify-content:center;margin-bottom:32px;
}
.demo-input{
  font-size:1.1rem;padding:16px 24px;border:2px solid var(--border);
  border-radius:12px;background:var(--bg-subtle);color:var(--fg);
  outline:none;width:400px;max-width:100%;transition:all 0.2s;
  font-weight:500;
}
.demo-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}

.demo-result{
  display:flex;justify-content:center;align-items:center;
  margin-bottom:32px;gap:24px;flex-wrap:wrap;
}
.demo-avatar{
  border-radius:20%;box-shadow:var(--shadow-lg);
  transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.demo-avatar:hover{transform:scale(1.05) rotate(1deg)}

/* Variants Showcase */
.variants-showcase{margin:64px 0}
.variants-showcase h2{
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.02em;
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
.variant-demo h3{font-size:1.25rem;font-weight:600;margin-bottom:8px}
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
  margin-top:8px;font-weight:500;
}

/* Code Section */
.code-section{margin:64px 0}
.code-section h2{
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.02em;
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
  font-size:0.9rem;
}
.code-tab.active{
  background:var(--code-bg);border-color:var(--border);
  color:var(--code-fg);
}

.code-block{
  background:var(--code-bg);border:1px solid var(--border);
  border-radius:0 12px 12px 12px;padding:24px;
  position:relative;overflow-x:auto;margin-bottom:32px;
}
.code-block pre{margin:0;font-family:var(--font-mono);font-size:0.9rem;line-height:1.6}
.code-block code{color:var(--code-fg)}

.copy-btn{
  position:absolute;top:16px;right:16px;
  background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
  border-radius:6px;padding:6px 12px;cursor:pointer;
  color:var(--accent);transition:all 0.2s;font-size:0.75rem;
  font-weight:600;text-transform:uppercase;letter-spacing:0.05em;
}
.copy-btn:hover{background:var(--accent);color:var(--code-bg);border-color:var(--accent)}

/* Gallery */
.gallery-section{margin:64px 0}
.gallery-section h2{
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.02em;
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
  display:block;font-size:0.75rem;color:var(--muted);
  margin-top:8px;font-weight:500;
}

/* Sizes */
.sizes-section{margin:64px 0;text-align:center}
.sizes-section h2{
  font-size:2rem;font-weight:700;margin-bottom:16px;letter-spacing:-0.02em;
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
  display:block;font-size:0.75rem;color:var(--muted);
  margin-top:8px;font-weight:600;font-family:var(--font-mono);
}

/* Features */
.features-section{margin:64px 0}
.features-section h2{
  font-size:2rem;font-weight:700;text-align:center;
  margin-bottom:16px;letter-spacing:-0.02em;
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
.feature:hover{transform:translateY(-2px);border-color:var(--primary)}
.feature .feature-icon{
  width:48px;height:48px;border-radius:12px;margin-bottom:16px;
}
.feature h3{font-size:1.1rem;font-weight:600;margin-bottom:8px}
.feature p{color:var(--muted);font-size:0.95rem;line-height:1.5}

/* Footer */
footer{
  margin-top:80px;padding:40px 0;text-align:center;
  border-top:1px solid var(--border);color:var(--muted);
}
footer p{margin-bottom:16px}
footer .links{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}
footer .links a{color:var(--muted);font-size:0.9rem}

@media(max-width:768px){
  .container{padding:0 16px}
  .hero{padding:48px 0}
  .hero h1{font-size:2.5rem}
  .demo-section{padding:32px 16px}
  .demo-input{width:100%}
  .demo-result{flex-direction:column;gap:16px}
  .variants-grid{grid-template-columns:1fr}
  .gallery{grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:16px}
  .sizes{gap:16px}
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
      <button class="theme-toggle" onclick="toggleTheme()">🌙</button>
    </nav>
  </header>

  <section class="hero">
    <h1>Minimal faces from <span class="gradient">pure math</span></h1>
    <p>
      Feed it any string, get back a unique minimal face avatar. 
      Same input, same face — forever. Zero dependencies, pure SVG determinism.
    </p>
  </section>

  <div class="demo-section">
    <div class="demo-input-wrap">
      <input class="demo-input" id="demoInput" type="text" 
             placeholder="Type anything..." value="avataurus" autocomplete="off"/>
    </div>
    <div class="demo-result" id="demoResult">
      <!-- Generated dynamically -->
    </div>
  </div>

  <section class="variants-showcase">
    <h2>Two Variants</h2>
    <p class="variants-subtitle">Choose between faces with mouths or initials</p>
    
    <div class="variants-grid">
      <div class="variant-demo">
        <h3>Face (default)</h3>
        <p>Eyes + mouth expressions on colored backgrounds</p>
        <div class="variant-examples">
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
        <div class="variant-examples">
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
    <p class="code-subtitle">URL, web component, or JavaScript — pick your approach</p>
    
    <div class="code-tabs">
      <button class="code-tab active" onclick="showTab(0)">Image URL</button>
      <button class="code-tab" onclick="showTab(1)">Web Component</button>
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
    <p class="sizes-subtitle">Sharp at every size</p>
    
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
             class="feature-icon" alt="Deterministic"/>
        <h3>Deterministic</h3>
        <p>Same input always produces the same output. No randomness, no database, no state changes over time.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('lightweight', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt="Lightweight"/>
        <h3>Zero Dependencies</h3>
        <p>Pure JavaScript with no external dependencies. Ships as a single 4KB gzipped file.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('scalable', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt="Scalable"/>
        <h3>Vector Graphics</h3>
        <p>Pure SVG output scales perfectly from 16px thumbnails to high-DPI displays without quality loss.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('edge', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt="Edge"/>
        <h3>Edge Native</h3>
        <p>Runs on Cloudflare Workers at 200+ locations worldwide. Sub-millisecond generation times.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('component', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt="Component"/>
        <h3>Web Component</h3>
        <p>Drop-in &lt;avataurus&gt; element with Shadow DOM isolation. Works with any framework or vanilla HTML.</p>
      </div>
      
      <div class="feature">
        <img src="data:image/svg+xml;base64,${btoa(generateAvatar('accessible', { size: 48, variant: 'initial' }))}" 
             class="feature-icon" alt="Accessible"/>
        <h3>Accessible</h3>
        <p>Semantic HTML, proper alt text, keyboard navigation, and screen reader support built in.</p>
      </div>
    </div>
  </section>

  <footer>
    <p>Built by <a href="https://github.com/ruzicic">mladen</a> · Open source under MIT license</p>
    <div class="links">
      <a href="https://github.com/ruzicic/avataurus">Source Code</a>
      <a href="https://www.npmjs.com/package/avataurus">npm Package</a>
      <a href="https://github.com/ruzicic/avataurus/issues">Report Bug</a>
    </div>
  </footer>
</div>

<script>
// Theme management
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('avataurus-theme', isDark ? 'dark' : 'light');
  document.querySelector('.theme-toggle').textContent = isDark ? '☀️' : '🌙';
}

// Initialize theme
(function() {
  const theme = localStorage.getItem('avataurus-theme');
  if (theme === 'dark' || (theme === null && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    document.querySelector('.theme-toggle').textContent = '☀️';
  }
})();

// Code examples
const codeExamples = [
\`<!-- Use as image URL -->
<img src="https://avataurus.com/john" width="48" height="48" alt="Avatar for john" />

<!-- With options -->
<img src="https://avataurus.com/john?size=128&variant=initial" alt="John's initial avatar" />
<img src="https://avataurus.com/jane?size=64&variant=face" alt="Jane's face avatar" />\`,

\`<!-- Load the web component -->
<script type="module" src="https://unpkg.com/avataurus/src/element.js"><\\/script>

<!-- Use it anywhere -->
<avataurus seed="john" size="48"></avataurus>
<avataurus seed="jane" size="64" variant="initial"></avataurus>
<avataurus seed="team" size="32" no-hover></avataurus>\`,

\`import { generateAvatar } from 'avataurus';

// Generate SVG string
const svg = generateAvatar('john', {
  size: 128,
  variant: 'face'  // or 'initial'
});

// Insert into DOM
document.getElementById('avatar').innerHTML = svg;

// Or use as data URL
const img = document.createElement('img');
img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);\`,

\`# Install via npm
npm install avataurus

# Or use CDN
https://unpkg.com/avataurus/src/avataurus.js
https://unpkg.com/avataurus/src/element.js

# TypeScript definitions included
# Works with Vite, Webpack, Parcel, etc.\`
];

let currentTab = 0;
function showTab(index) {
  currentTab = index;
  document.querySelectorAll('.code-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
  document.getElementById('codeContent').textContent = codeExamples[index];
}

function copyCode() {
  navigator.clipboard.writeText(codeExamples[currentTab]);
  const btn = document.querySelector('.copy-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = originalText, 1500);
}

// Initialize first code tab
showTab(0);

// Live demo
const demoInput = document.getElementById('demoInput');
const demoResult = document.getElementById('demoResult');

function updateDemo() {
  const seed = demoInput.value || 'anonymous';
  
  // Generate main avatar
  const mainImg = document.createElement('img');
  mainImg.src = '/' + encodeURIComponent(seed) + '?size=128&variant=face';
  mainImg.width = 128;
  mainImg.height = 128;
  mainImg.className = 'demo-avatar';
  mainImg.alt = \`Avatar for \${seed}\`;
  
  // Generate variant examples
  const variants = ['face', 'initial'];
  const variantElements = variants.map(variant => {
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    
    const img = document.createElement('img');
    img.src = '/' + encodeURIComponent(seed) + '?size=64&variant=' + variant;
    img.width = 64;
    img.height = 64;
    img.style.borderRadius = '20%';
    img.style.boxShadow = 'var(--shadow)';
    img.alt = \`\${seed} \${variant} variant\`;
    
    const label = document.createElement('div');
    label.textContent = variant;
    label.style.fontSize = '0.75rem';
    label.style.color = 'var(--muted)';
    label.style.marginTop = '8px';
    label.style.fontWeight = '500';
    
    container.appendChild(img);
    container.appendChild(label);
    return container;
  });
  
  demoResult.innerHTML = '';
  demoResult.appendChild(mainImg);
  variantElements.forEach(el => demoResult.appendChild(el));
}

demoInput.addEventListener('input', updateDemo);
updateDemo();
</script>
</body>
</html>`;
}
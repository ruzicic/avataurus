export function landingPage(generateAvatar) {
  // Pre-generate gallery avatars — show variety
  const examples = [
    'alice', 'bob', 'charlie', 'diana', 'elena', 'frank',
    'grace', 'hiro', 'ivan', 'julia', 'kai', 'luna',
    'marco', 'nina', 'oscar', 'petra', 'quinn', 'rosa',
    'sam', 'tara',
  ];
  const exampleSvgs = examples.map(name => ({
    name,
    svg64: btoa(generateAvatar(name, { size: 80, variant: 'gradient' })),
  }));

  const sizeDemos = [32, 48, 64, 96, 128].map(s => ({
    size: s,
    svg64: btoa(generateAvatar('demo', { size: s })),
  }));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Avataurus — Deterministic Dino Avatar Generator</title>
<meta name="description" content="Generate unique, beautiful dinosaur-themed avatar faces from any string. Deterministic, zero dependencies, runs on the edge."/>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦕</text></svg>"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#FAFBFC;--fg:#1a1a2e;--muted:#6B7280;--card:#fff;--border:#E5E7EB;
  --accent:#6366F1;--accent2:#818CF8;--code-bg:#F3F4F6;--radius:16px;
  --shadow:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.06);
}
.dark{
  --bg:#0F172A;--fg:#F1F5F9;--muted:#94A3B8;--card:#1E293B;--border:#334155;
  --accent:#818CF8;--accent2:#A5B4FC;--code-bg:#1E293B;
  --shadow:0 1px 3px rgba(0,0,0,0.3);
}
html{scroll-behavior:smooth}
body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--fg);line-height:1.6;transition:background .3s,color .3s}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:900px;margin:0 auto;padding:0 24px}
header{padding:24px 0;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.5rem;font-weight:800;display:flex;align-items:center;gap:8px}
.logo span{font-size:1.8rem}
.header-links{display:flex;align-items:center;gap:12px}
.header-links a{font-size:0.9rem;color:var(--muted);transition:color .2s}
.header-links a:hover{color:var(--fg);text-decoration:none}
.theme-toggle{background:none;border:1px solid var(--border);border-radius:8px;padding:8px 12px;cursor:pointer;font-size:1.1rem;color:var(--fg);transition:all .2s}
.theme-toggle:hover{border-color:var(--accent)}
.badge{display:inline-block;padding:2px 8px;font-size:0.7rem;font-weight:600;border-radius:6px;background:var(--accent);color:white;vertical-align:middle;margin-left:6px}
.hero{text-align:center;padding:60px 0 40px}
.hero h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;letter-spacing:-0.02em;margin-bottom:12px}
.hero h1 .highlight{background:linear-gradient(135deg,var(--accent),#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:1.15rem;color:var(--muted);max-width:560px;margin:0 auto 32px}
.hero .stats{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-bottom:32px;font-size:0.85rem;color:var(--muted)}
.hero .stat{text-align:center}
.hero .stat strong{display:block;font-size:1.4rem;color:var(--fg)}
.demo-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:32px;box-shadow:var(--shadow);margin-bottom:48px}
.demo-input-wrap{display:flex;gap:12px;margin-bottom:24px;align-items:center;flex-wrap:wrap;justify-content:center}
.demo-input{font-size:1.1rem;padding:12px 20px;border:2px solid var(--border);border-radius:12px;background:var(--bg);color:var(--fg);outline:none;width:320px;max-width:100%;transition:border-color .2s}
.demo-input:focus{border-color:var(--accent)}
.demo-avatar{display:flex;justify-content:center;margin-bottom:16px}
.demo-avatar img{border-radius:20%;box-shadow:var(--shadow);transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.demo-avatar img:hover{transform:scale(1.05) rotate(1.5deg)}
.demo-variants{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.demo-variant{text-align:center}
.demo-variant img{transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.demo-variant img:hover{transform:scale(1.08)}
.demo-variant span{display:block;font-size:0.8rem;color:var(--muted);margin-top:6px}
.section{padding:40px 0}
.section h2{font-size:1.6rem;font-weight:700;margin-bottom:8px;letter-spacing:-0.01em}
.section p.sub{color:var(--muted);margin-bottom:24px}
.gallery{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-bottom:16px}
.gallery-item{text-align:center}
.gallery-item img{border-radius:20%;box-shadow:var(--shadow);transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.gallery-item img:hover{transform:scale(1.1) rotate(2deg)}
.gallery-item span{display:block;font-size:0.75rem;color:var(--muted);margin-top:4px}
.sizes{display:flex;align-items:end;gap:20px;justify-content:center;flex-wrap:wrap}
.size-item{text-align:center}
.size-item img{border-radius:20%}
.size-item span{display:block;font-size:0.75rem;color:var(--muted);margin-top:4px}
.code-block{background:var(--code-bg);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:16px;position:relative;overflow-x:auto}
.code-block code{font-family:'SF Mono',Monaco,'Cascadia Code',monospace;font-size:0.88rem;line-height:1.7;color:var(--fg)}
.code-block .copy-btn{position:absolute;top:10px;right:10px;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:0.75rem;cursor:pointer;color:var(--muted);transition:all .2s}
.code-block .copy-btn:hover{border-color:var(--accent);color:var(--accent)}
.code-tabs{display:flex;gap:0;margin-bottom:-1px;position:relative;z-index:1}
.code-tab{padding:8px 16px;font-size:0.85rem;border:1px solid transparent;border-bottom:none;border-radius:8px 8px 0 0;cursor:pointer;color:var(--muted);background:transparent;transition:all .2s}
.code-tab.active{background:var(--code-bg);border-color:var(--border);color:var(--fg);font-weight:600}
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:24px}
.feature{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);transition:transform .2s}
.feature:hover{transform:translateY(-2px)}
.feature .icon{font-size:1.8rem;margin-bottom:8px}
.feature h3{font-size:1rem;font-weight:700;margin-bottom:4px}
.feature p{font-size:0.9rem;color:var(--muted)}
footer{padding:40px 0;text-align:center;color:var(--muted);font-size:0.85rem;border-top:1px solid var(--border);margin-top:40px}
@media(max-width:600px){
  .hero{padding:40px 0 24px}
  .demo-card{padding:20px}
  .demo-input{width:100%}
  .hero .stats{gap:16px}
}
</style>
</head>
<body>
<div class="container">
  <header>
    <div class="logo"><span>🦕</span> Avataurus <span class="badge">v1.0</span></div>
    <div class="header-links">
      <a href="https://github.com/ruzicic/avataurus">GitHub</a>
      <a href="https://www.npmjs.com/package/avataurus">npm</a>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">🌙</button>
    </div>
  </header>

  <section class="hero">
    <h1>Unique dino avatars from <span class="highlight">any string</span></h1>
    <p>Deterministic, beautiful, dinosaur-inspired avatar faces with billions of combinations. Same input = same face. Zero dependencies.</p>
    <div class="stats">
      <div class="stat"><strong>1.7B+</strong>combinations</div>
      <div class="stat"><strong>0</strong>dependencies</div>
      <div class="stat"><strong>&lt;2ms</strong>generation</div>
      <div class="stat"><strong>13</strong>feature layers</div>
    </div>
  </section>

  <div class="demo-card">
    <div class="demo-avatar" id="demoAvatar"></div>
    <div class="demo-input-wrap">
      <input class="demo-input" id="demoInput" type="text" placeholder="Type a name..." value="avataurus" autocomplete="off"/>
    </div>
    <div class="demo-variants" id="demoVariants"></div>
  </div>

  <section class="section">
    <h2>Gallery</h2>
    <p class="sub">Every string produces a unique face — 20 examples</p>
    <div class="gallery">
      ${exampleSvgs.map(e => `<div class="gallery-item"><img src="data:image/svg+xml;base64,${e.svg64}" width="80" height="80" alt="${e.name}"/><span>${e.name}</span></div>`).join('')}
    </div>
  </section>

  <section class="section">
    <h2>Sizes</h2>
    <p class="sub">Pixel-perfect at any size</p>
    <div class="sizes">
      ${sizeDemos.map(s => `<div class="size-item"><img src="data:image/svg+xml;base64,${s.svg64}" width="${s.size}" height="${s.size}" alt="${s.size}px"/><span>${s.size}px</span></div>`).join('')}
    </div>
  </section>

  <section class="section">
    <h2>Usage</h2>
    <p class="sub">Multiple ways to use Avataurus</p>
    <div class="code-tabs">
      <button class="code-tab active" onclick="showTab(0)">Image URL</button>
      <button class="code-tab" onclick="showTab(1)">Web Component</button>
      <button class="code-tab" onclick="showTab(2)">JavaScript</button>
      <button class="code-tab" onclick="showTab(3)">npm</button>
    </div>
    <div class="code-block" id="codeBlock">
      <button class="copy-btn" onclick="copyCode()">Copy</button>
      <pre><code id="codeContent"></code></pre>
    </div>
  </section>

  <section class="section">
    <h2>Why Avataurus?</h2>
    <div class="features">
      <div class="feature"><div class="icon">⚡</div><h3>Blazing Fast</h3><p>Pure SVG generation with zero external requests. Runs on Cloudflare's edge network in 200+ cities.</p></div>
      <div class="feature"><div class="icon">🎯</div><h3>Deterministic</h3><p>Same input always produces the same avatar. No randomness, no databases, no state.</p></div>
      <div class="feature"><div class="icon">🦕</div><h3>1.7B+ Combinations</h3><p>13 feature layers including eyebrows, ears, markings, accessories, tails. Every avatar feels unique.</p></div>
      <div class="feature"><div class="icon">📦</div><h3>Zero Dependencies</h3><p>Vanilla JavaScript. No React, no frameworks. Works everywhere — browser, Node.js, Workers.</p></div>
      <div class="feature"><div class="icon">🔌</div><h3>Web Component</h3><p>Drop-in &lt;avatar-us&gt; element with hover animations and Shadow DOM isolation. Works in any framework.</p></div>
      <div class="feature"><div class="icon">♾️</div><h3>Cache Forever</h3><p>Immutable by design. Cache responses forever — the same URL always returns the same image.</p></div>
    </div>
  </section>

  <footer>
    <p>Built with 🦕 by <a href="https://github.com/ruzicic">mladen</a> · <a href="https://github.com/ruzicic/avataurus">GitHub</a> · MIT License</p>
  </footer>
</div>

<script>
function toggleTheme(){
  document.body.classList.toggle('dark');
  const isDark=document.body.classList.contains('dark');
  localStorage.setItem('avataurus-theme',isDark?'dark':'light');
  document.querySelector('.theme-toggle').textContent=isDark?'☀️':'🌙';
}
(function(){
  const t=localStorage.getItem('avataurus-theme');
  if(t==='dark'||(t===null&&matchMedia('(prefers-color-scheme:dark)').matches)){
    document.body.classList.add('dark');
    document.querySelector('.theme-toggle').textContent='☀️';
  }
})();

const codes=[
  \`<!-- Use as an image URL -->
<img src="https://avataurus.workers.dev/john" width="48" height="48" />

<!-- With options -->
<img src="https://avataurus.workers.dev/john?size=128&variant=solid&initial=true" />\`,
  \`<!-- Load the web component -->
<script type="module" src="https://unpkg.com/avataurus/src/element.js"><\\/script>

<!-- Use it! -->
<avatar-us name="john" size="48"></avatar-us>
<avatar-us name="jane" size="64" variant="solid"></avatar-us>
<avatar-us name="bob" size="48" show-initial></avatar-us>

<!-- Disable hover animation -->
<avatar-us name="static" size="48" no-hover></avatar-us>\`,
  \`import { generateAvatar } from 'avataurus';

// Generate SVG string
const svg = generateAvatar('john', {
  size: 128,
  variant: 'gradient',  // or 'solid'
  showInitial: true,
});

// Insert into DOM
document.getElementById('avatar').innerHTML = svg;\`,
  \`# Install
npm install avataurus

# Or use CDN
# https://unpkg.com/avataurus/src/avataurus.js
# https://unpkg.com/avataurus/src/element.js\`
];
let currentTab=0;
function showTab(i){
  currentTab=i;
  document.querySelectorAll('.code-tab').forEach((t,j)=>t.classList.toggle('active',j===i));
  document.getElementById('codeContent').textContent=codes[i];
}
function copyCode(){
  navigator.clipboard.writeText(codes[currentTab]);
  const btn=document.querySelector('.copy-btn');
  btn.textContent='Copied!';
  setTimeout(()=>btn.textContent='Copy',1500);
}
showTab(0);

const demoInput=document.getElementById('demoInput');
const demoAvatar=document.getElementById('demoAvatar');
const demoVariants=document.getElementById('demoVariants');
function updateDemo(){
  const name=demoInput.value||'anonymous';
  demoAvatar.innerHTML='';
  const img=document.createElement('img');
  img.src='/'+encodeURIComponent(name)+'?size=128';
  img.width=128;img.height=128;
  demoAvatar.appendChild(img);
  demoVariants.innerHTML='';
  ['gradient','solid'].forEach(v=>{
    const d=document.createElement('div');d.className='demo-variant';
    const i2=document.createElement('img');i2.src='/'+encodeURIComponent(name)+'?size=64&variant='+v;
    i2.width=64;i2.height=64;i2.style.borderRadius='20%';d.appendChild(i2);
    const sp=document.createElement('span');sp.textContent=v;d.appendChild(sp);
    demoVariants.appendChild(d);
  });
  const d2=document.createElement('div');d2.className='demo-variant';
  const i3=document.createElement('img');i3.src='/'+encodeURIComponent(name)+'?size=64&initial=true';
  i3.width=64;i3.height=64;i3.style.borderRadius='20%';d2.appendChild(i3);
  const sp2=document.createElement('span');sp2.textContent='with initial';d2.appendChild(sp2);
  demoVariants.appendChild(d2);
}
demoInput.addEventListener('input',updateDemo);
updateDemo();
</script>
</body>
</html>`;
}

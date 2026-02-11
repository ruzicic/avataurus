export function landingPage(generateAvatar) {
  const examples = [
    'alice','bob','charlie','diana','elena','frank','grace','hiro',
    'ivan','julia','kai','luna','marco','nina','oscar','petra','quinn','rosa','sam','tara',
  ];
  const exampleSvgs = examples.map((name) => ({
    name,
    svg64: btoa(generateAvatar(name, { size: 80, variant: 'gradient' })),
  }));

  const sizeDemos = [32, 48, 64, 96, 128].map((s) => ({
    size: s,
    svg64: btoa(generateAvatar('demo', { size: s })),
  }));

  const moods = ['happy', 'angry', 'sleepy', 'surprised', 'chill'];
  const moodDemos = moods.map((m) => ({
    mood: m,
    svg64: btoa(generateAvatar('demo', { size: 64, mood: m })),
  }));

  const species = ['rex', 'triceratops', 'stego', 'raptor', 'bronto'];
  const speciesDemos = species.map((s) => ({
    species: s,
    svg64: btoa(generateAvatar('demo', { size: 64, species: s })),
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
  --bg:#F5F0E8;--bg2:#EDE7DA;--fg:#1B2D1B;--muted:#6B7255;--card:#FFFDF7;
  --border:#D4CCBA;--accent:#F59E0B;--accent2:#FF6B35;--primary:#0A3622;
  --code-bg:#0D1F15;--code-fg:#A8E6A3;--code-accent:#F59E0B;
  --radius:14px;--shadow:0 2px 8px rgba(10,54,34,0.06),0 1px 3px rgba(10,54,34,0.08);
  --fossil:#E8DCC8;--volcanic:#1a1a2e;
}
.dark{
  --bg:#0D1208;--bg2:#141E0F;--fg:#E8DCC8;--muted:#8B9A6B;--card:#1A2614;
  --border:#2A3C22;--accent:#F59E0B;--accent2:#FF6B35;--primary:#2ECC71;
  --code-bg:#0A1A0D;--code-fg:#A8E6A3;
  --shadow:0 2px 12px rgba(0,0,0,0.3);
}
html{scroll-behavior:smooth}
body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--fg);line-height:1.6;transition:background .3s,color .3s}
body::before{content:'';position:fixed;inset:0;pointer-events:none;opacity:0.03;z-index:9999;
  background-image:url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23000'/%3E%3C/svg%3E")}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline;color:var(--accent2)}
.container{max-width:920px;margin:0 auto;padding:0 24px}

/* Header */
header{padding:20px 0;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.4rem;font-weight:800;display:flex;align-items:center;gap:8px;color:var(--fg);letter-spacing:-0.02em}
.logo span.icon{font-size:1.6rem}
.logo .ver{font-size:0.65rem;font-weight:600;padding:2px 7px;border-radius:6px;background:var(--primary);color:#fff;vertical-align:middle;margin-left:4px;letter-spacing:0.03em}
.header-links{display:flex;align-items:center;gap:14px}
.header-links a{font-size:0.85rem;color:var(--muted);font-weight:500;transition:color .2s}
.header-links a:hover{color:var(--fg);text-decoration:none}
.theme-toggle{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:pointer;font-size:1rem;color:var(--fg);transition:all .2s}
.theme-toggle:hover{border-color:var(--accent);background:var(--accent);color:#000}

/* Strata divider */
.strata{height:4px;margin:0;border:none;background:linear-gradient(90deg,var(--primary) 0%,var(--accent) 40%,var(--accent2) 70%,var(--primary) 100%);opacity:0.5;border-radius:2px}
.strata-section{position:relative;padding:48px 0}
.strata-section::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:60px;height:3px;background:var(--accent);border-radius:2px;opacity:0.6}

/* Hero */
.hero{text-align:center;padding:72px 0 40px;position:relative}
.hero h1{font-size:clamp(2.2rem,6vw,3.6rem);font-weight:900;letter-spacing:-0.03em;line-height:1.1;margin-bottom:16px}
.hero h1 .highlight{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:1.15rem;color:var(--muted);max-width:540px;margin:0 auto 36px;line-height:1.7}

/* Specimen stats */
.stats{display:flex;gap:0;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
.stat{text-align:center;padding:12px 24px;border-right:1px solid var(--border);position:relative}
.stat:last-child{border-right:none}
.stat strong{display:block;font-size:1.5rem;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums}
.stat span{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);font-weight:600}

/* Demo card */
.demo-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:36px;box-shadow:var(--shadow);margin-bottom:48px;position:relative;overflow:hidden}
.demo-card::before{content:'';position:absolute;top:-1px;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--primary),var(--accent),var(--accent2))}
.demo-label{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:700;margin-bottom:16px;text-align:center}
.demo-input-wrap{display:flex;gap:12px;margin-bottom:24px;align-items:center;justify-content:center;flex-wrap:wrap}
.demo-input{font-size:1.1rem;padding:12px 20px;border:2px solid var(--border);border-radius:10px;background:var(--bg);color:var(--fg);outline:none;width:340px;max-width:100%;transition:border-color .2s,box-shadow .2s;font-weight:500}
.demo-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(245,158,11,0.15)}
.demo-avatar{display:flex;justify-content:center;margin-bottom:20px}
.demo-avatar img{border-radius:22%;box-shadow:0 8px 32px rgba(10,54,34,0.12);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.demo-avatar img:hover{transform:scale(1.06) rotate(1deg)}
.demo-variants{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.demo-variant{text-align:center}
.demo-variant img{border-radius:22%;transition:transform .25s cubic-bezier(.34,1.56,.64,1);box-shadow:0 2px 8px rgba(10,54,34,0.1)}
.demo-variant img:hover{transform:scale(1.1)}
.demo-variant span{display:block;font-size:0.7rem;color:var(--muted);margin-top:6px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}

/* Sections */
.section{padding:44px 0}
.section-head{margin-bottom:28px}
.section-head h2{font-size:1.7rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px}
.section-head p{color:var(--muted);font-size:0.95rem}

/* Gallery */
.gallery{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.gallery-item{text-align:center;position:relative}
.gallery-item img{border-radius:22%;box-shadow:var(--shadow);transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.gallery-item img:hover{transform:scale(1.12) rotate(2deg)}
.gallery-item span{display:block;font-size:0.7rem;color:var(--muted);margin-top:5px;font-weight:500}

/* Sizes */
.sizes{display:flex;align-items:end;gap:20px;justify-content:center;flex-wrap:wrap}
.size-item{text-align:center}
.size-item img{border-radius:22%;box-shadow:var(--shadow)}
.size-item span{display:block;font-size:0.7rem;color:var(--muted);margin-top:4px;font-weight:600;font-variant-numeric:tabular-nums}

/* Code section */
.code-tabs{display:flex;gap:0;margin-bottom:-1px;position:relative;z-index:1;flex-wrap:wrap}
.code-tab{padding:8px 16px;font-size:0.8rem;border:1px solid transparent;border-bottom:none;border-radius:8px 8px 0 0;cursor:pointer;color:var(--muted);background:transparent;transition:all .2s;font-weight:500}
.code-tab.active{background:var(--code-bg);border-color:var(--border);color:var(--code-fg);font-weight:700}
.code-block{background:var(--code-bg);border:1px solid var(--border);border-radius:0 12px 12px 12px;padding:20px 24px;margin-bottom:16px;position:relative;overflow-x:auto}
.code-block code{font-family:'SF Mono',Monaco,'Cascadia Code','Fira Code',monospace;font-size:0.85rem;line-height:1.8;color:var(--code-fg)}
.code-block .copy-btn{position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:4px 12px;font-size:0.72rem;cursor:pointer;color:var(--code-accent);transition:all .2s;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}
.code-block .copy-btn:hover{background:var(--accent);color:#000;border-color:var(--accent)}

/* Terminal prompt decoration */
.code-block::before{content:'● ● ●';position:absolute;top:10px;left:14px;font-size:0.55rem;letter-spacing:4px;color:rgba(255,255,255,0.15)}

/* Features */
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:24px}
.feature{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);transition:transform .2s,border-color .2s;position:relative;overflow:hidden}
.feature::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);opacity:0;transition:opacity .2s}
.feature:hover{transform:translateY(-3px);border-color:var(--accent)}
.feature:hover::after{opacity:1}
.feature .icon{font-size:1.6rem;margin-bottom:10px;display:inline-block}
.feature h3{font-size:0.95rem;font-weight:700;margin-bottom:4px}
.feature p{font-size:0.85rem;color:var(--muted);line-height:1.5}

/* Footer */
footer{padding:40px 0;text-align:center;color:var(--muted);font-size:0.8rem;margin-top:32px;position:relative}
footer::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--primary),var(--accent),var(--accent2),transparent);opacity:0.3}
footer a{color:var(--accent)}
footer .claw{font-size:0.65rem;margin-top:8px;opacity:0.4;letter-spacing:0.3em}

@media(max-width:600px){
  .hero{padding:48px 0 24px}
  .hero h1{font-size:2rem}
  .demo-card{padding:20px}
  .demo-input{width:100%}
  .stat{padding:10px 16px}
  .stat strong{font-size:1.2rem}
  .features{grid-template-columns:1fr}
}
</style>
</head>
<body>
<div class="container">
  <header>
    <div class="logo"><span class="icon">🦕</span>Avataurus<span class="ver">v1.0</span></div>
    <div class="header-links">
      <a href="https://github.com/ruzicic/avataurus">GitHub</a>
      <a href="https://www.npmjs.com/package/avataurus">npm</a>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">🌙</button>
    </div>
  </header>

  <section class="hero">
    <h1>Dino avatars from<br/><span class="highlight">any string</span></h1>
    <p>Deterministic, dinosaur-inspired avatar faces with billions of unique combinations. Same input, same face. Zero dependencies. Runs on the edge.</p>
    <div class="stats">
      <div class="stat"><strong>1.7B+</strong><span>Combinations</span></div>
      <div class="stat"><strong>0</strong><span>Dependencies</span></div>
      <div class="stat"><strong>&lt;2ms</strong><span>Generation</span></div>
      <div class="stat"><strong>13</strong><span>Feature Layers</span></div>
    </div>
  </section>

  <div class="demo-card">
    <div class="demo-label">Live Specimen Generator</div>
    <div class="demo-avatar" id="demoAvatar"></div>
    <div class="demo-input-wrap">
      <input class="demo-input" id="demoInput" type="text" placeholder="Type any string..." value="avataurus" autocomplete="off"/>
    </div>
    <div class="demo-variants" id="demoVariants"></div>
  </div>

  <hr class="strata"/>

  <section class="section strata-section">
    <div class="section-head">
      <h2>Gallery</h2>
      <p>Every string produces a unique specimen — 20 examples</p>
    </div>
    <div class="gallery">
      ${exampleSvgs.map((e) => `<div class="gallery-item"><img src="data:image/svg+xml;base64,${e.svg64}" width="80" height="80" alt="${e.name}" loading="lazy"/><span>${e.name}</span></div>`).join('')}
    </div>
  </section>

  <section class="section strata-section">
    <div class="section-head">
      <h2>Sizes</h2>
      <p>Pixel-perfect at any scale</p>
    </div>
    <div class="sizes">
      ${sizeDemos.map((s) => `<div class="size-item"><img src="data:image/svg+xml;base64,${s.svg64}" width="${s.size}" height="${s.size}" alt="${s.size}px"/><span>${s.size}px</span></div>`).join('')}
    </div>
  </section>

  <section class="section strata-section">
    <div class="section-head">
      <h2>Moods</h2>
      <p>Override expressions with mood presets</p>
    </div>
    <div class="gallery">
      ${moodDemos.map((m) => `<div class="gallery-item"><img src="data:image/svg+xml;base64,${m.svg64}" width="64" height="64" alt="${m.mood}"/><span>${m.mood}</span></div>`).join('')}
    </div>
  </section>

  <section class="section strata-section">
    <div class="section-head">
      <h2>Species</h2>
      <p>Different dino types for unique spikes, ears, and tails</p>
    </div>
    <div class="gallery">
      ${speciesDemos.map((s) => `<div class="gallery-item"><img src="data:image/svg+xml;base64,${s.svg64}" width="64" height="64" alt="${s.species}"/><span>${s.species}</span></div>`).join('')}
    </div>
  </section>

  <section class="section strata-section">
    <div class="section-head">
      <h2>Usage</h2>
      <p>Multiple ways to integrate Avataurus</p>
    </div>
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

  <section class="section strata-section">
    <div class="section-head">
      <h2>Why Avataurus?</h2>
    </div>
    <div class="features">
      <div class="feature"><div class="icon">⚡</div><h3>Blazing Fast</h3><p>Pure SVG generation with zero external requests. Runs on Cloudflare's edge in 200+ cities.</p></div>
      <div class="feature"><div class="icon">🎯</div><h3>Deterministic</h3><p>Same input always produces the same avatar. No randomness, no databases, no state.</p></div>
      <div class="feature"><div class="icon">🦕</div><h3>1.7B+ Combinations</h3><p>13 feature layers including eyebrows, ears, markings, accessories, and tails.</p></div>
      <div class="feature"><div class="icon">📦</div><h3>Zero Dependencies</h3><p>Vanilla JavaScript. No frameworks. Works everywhere — browser, Node.js, Workers.</p></div>
      <div class="feature"><div class="icon">🔌</div><h3>Web Component</h3><p>Drop-in &lt;avataurus-el&gt; with hover animations and Shadow DOM. Works in any framework.</p></div>
      <div class="feature"><div class="icon">♾️</div><h3>Cache Forever</h3><p>Immutable by design. Same URL always returns the same image. Cache it forever.</p></div>
    </div>
  </section>

  <footer>
    <p>Built by <a href="https://github.com/ruzicic">mladen</a> · <a href="https://github.com/ruzicic/avataurus">GitHub</a> · <a href="https://www.npmjs.com/package/avataurus">npm</a> · MIT License</p>
    <div class="claw">///</div>
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
<img src="https://avataurus.com/john" width="48" height="48" />

<!-- With options -->
<img src="https://avataurus.com/john?size=128&variant=solid&initial=true" />\`,
  \`<!-- Load the web component -->
<script type="module" src="https://unpkg.com/avataurus/src/element.js"><\\/script>

<!-- Use it! -->
<avataurus-el name="john" size="48"></avataurus-el>
<avataurus-el name="jane" size="64" variant="solid"></avataurus-el>
<avataurus-el name="bob" mood="happy" species="rex"></avataurus-el>
<avataurus-el name="chill" mood="chill" species="bronto"></avataurus-el>\`,
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
    i2.width=64;i2.height=64;i2.style.borderRadius='22%';d.appendChild(i2);
    const sp=document.createElement('span');sp.textContent=v;d.appendChild(sp);
    demoVariants.appendChild(d);
  });
  ['happy','angry','chill'].forEach(m=>{
    const d=document.createElement('div');d.className='demo-variant';
    const i2=document.createElement('img');i2.src='/'+encodeURIComponent(name)+'?size=64&mood='+m;
    i2.width=64;i2.height=64;i2.style.borderRadius='22%';d.appendChild(i2);
    const sp=document.createElement('span');sp.textContent=m;d.appendChild(sp);
    demoVariants.appendChild(d);
  });
}
demoInput.addEventListener('input',updateDemo);
updateDemo();
</script>
</body>
</html>`;
}

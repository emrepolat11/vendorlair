export default async function handler(req, res) {
  const sourceUrl = 'https://raw.githubusercontent.com/emrepolat11/vendorlair/feature/action-centre-implement/index.html';
  const response = await fetch(sourceUrl, { cache: 'no-store' });
  let html = await response.text();

  html = html.replace(
    '<h1>Know every vendor.<br>Know what needs<br>your <em>attention.</em></h1>',
    '<h1>Know every<br>vendor in<br>your <em>lair.</em></h1>'
  );

  html = html.replace(
    'padding-top:98px;padding-bottom:70px',
    'padding-top:98px;padding-bottom:24px'
  );

  html = html.replace(
    '.section{padding:95px 0}',
    '.section{padding:48px 0 95px}'
  );

  html = html.replace(
    '.section{padding:65px 0}',
    '.section{padding:36px 0 65px}'
  );

  html = html.replace(
    '.snapshotWrap{position:relative}',
    '.snapshotWrap{position:relative;width:120%;margin-left:-10%}'
  );

  html = html.replace(
    '.snapshotWrap{max-width:680px;margin:0 auto}',
    '.snapshotWrap{max-width:734px;margin-left:-4%;width:108%}'
  );

  html = html.replace('500+', '50');
  html = html.replace('40+', '8');
  html = html.replace('10,000+', '500');

  const themeCss = `<style>
.theme-toggle{width:36px;height:36px;padding:0;border-radius:9px;border:1px solid rgba(255,255,255,.09);background:transparent;color:#F0EDE6;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px}
.theme-toggle .moon{display:none}
html[data-theme="light"] body{background:#F7F7FB;color:#191922}
html[data-theme="light"] nav{background:rgba(247,247,251,.88);border-bottom-color:rgba(25,25,34,.09)}
html[data-theme="light"] .brand{color:#191922}
html[data-theme="light"] .ghost{border-color:rgba(25,25,34,.11);color:rgba(25,25,34,.65)}
html[data-theme="light"] .eyebrow{background:rgba(108,99,255,.10);color:#5A52D6}
html[data-theme="light"] .sub,html[data-theme="light"] .feature p,html[data-theme="light"] .bottom p{color:rgba(25,25,34,.58)}
html[data-theme="light"] .note,html[data-theme="light"] footer{color:rgba(25,25,34,.38)}
html[data-theme="light"] .features{background:rgba(25,25,34,.08);border-color:rgba(25,25,34,.08)}
html[data-theme="light"] .feature{background:#fff}
html[data-theme="light"] .bottom,html[data-theme="light"] footer{border-color:rgba(25,25,34,.09)}
html[data-theme="light"] .theme-toggle{border-color:rgba(25,25,34,.11);color:#191922;background:rgba(25,25,34,.03)}
html[data-theme="light"] .theme-toggle .sun{display:none}
html[data-theme="light"] .theme-toggle .moon{display:inline}
</style>`;
  html = html.replace('</head>', `${themeCss}</head>`);
  html = html.replace('<div class="navactions">', '<div class="navactions"><button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch theme"><span class="sun">☀️</span><span class="moon">🌙</span></button>');

  const themeJs = `<script>(function(){var r=document.documentElement,t=document.getElementById('themeToggle'),s='dark';try{s=localStorage.getItem('vendorlair-theme')||'dark'}catch(e){}r.dataset.theme=s==='light'?'light':'dark';if(t)t.onclick=function(){r.dataset.theme=r.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('vendorlair-theme',r.dataset.theme)}catch(e){}}})();</script>`;
  html = html.replace('</body>', `${themeJs}</body>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
}

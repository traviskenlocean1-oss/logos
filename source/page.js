const fs = require('fs');
const meta = JSON.parse(fs.readFileSync(__dirname + '/meta.json', 'utf8'));
const cards = meta.map(m => `<figure id="logo-${m.i}"><div class="board" style="background:${m.bg}">${m.svg}</div><figcaption><span class="n">${m.i}</span><span class="t">${m.name}</span><span class="c">${m.color}</span></figcaption></figure>`).join('\n');
const html = `<title>EV Roadside Logos</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&display=swap">
<style>
/* Layout: plain drawing-board grid, two logos across, one on a phone. The logos carry all the color. */
:root{--bg:#E9ECEE;--fg:#15202B;--mute:#566371;--line:#CBD2D8;--focus:#1B62D6;--f:"Archivo",system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171C21;--fg:#EDF1F4;--mute:#9AA7B4;--line:#333C45;--focus:#7FB0FF;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171C21;--fg:#EDF1F4;--mute:#9AA7B4;--line:#333C45;--focus:#7FB0FF;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--f);line-height:1.5}
.wrap{max-width:1240px;margin:0 auto;padding-block:40px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
header{display:grid;gap:10px;margin-bottom:32px}
h1{margin:0;font-size:clamp(30px,5vw,52px);line-height:1.04;font-weight:800;font-stretch:118%;letter-spacing:-.02em;text-wrap:balance}
header p{margin:0;max-width:62ch;font-size:17px;color:var(--mute)}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px 24px}
figure{margin:0;min-width:0}
.board{border:1px solid var(--line);aspect-ratio:4/3;max-width:100%;overflow:hidden}
.board svg{display:block;width:100%;height:100%}
figcaption{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:baseline;padding-top:10px;font-size:15px}
.n{font-weight:800;font-size:20px;font-variant-numeric:tabular-nums;min-width:1.4em}
.t{font-weight:650}
.c{color:var(--mute);text-align:right}
@media (max-width:720px){.grid{grid-template-columns:minmax(0,1fr)}}
</style>
<div class="wrap"><header><h1>EV Roadside, 20 logo directions</h1><p>Every one comes from the original sketch: the globe, EV, the plug, the van and the bolt. Pick your favorites by number. Numbers 3, 4 and 15 are pure black, and 16 uses one ink.</p></header>
<main class="grid">${cards}</main></div>`;
fs.writeFileSync(__dirname + '/ev-roadside-logos.html', html);
console.log(html.length);

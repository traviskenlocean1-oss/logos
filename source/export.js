// Measures the real ink of each logo, centers it on a 4:3 board, and writes SVG + PNG + contact sheets.
const pp = require('C:/Users/locea_zau6eja/OneDrive/AI CODING/VISIONARY/node_modules/puppeteer');
const fs = require('fs'), path = require('path');
const all = { ...require('./a.js'), ...require('./b.js') };
const out = process.argv[2]; fs.mkdirSync(out + '/svg', { recursive: true }); fs.mkdirSync(out + '/png', { recursive: true });
const X0 = -200, Y0 = -200, W = 1200, H = 1100;
(async () => {
  const b = await pp.launch({ headless: 'new' }), p = await b.newPage(), meta = [];
  for (const i of Object.keys(all).map(Number)) {
    const l = all[i], inner = l.draw();
    await p.setViewport({ width: W, height: H });
    await p.setContent(`<body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${X0} ${Y0} ${W} ${H}" width="${W}" height="${H}">${inner}</svg>`);
    const shot = await p.screenshot({ omitBackground: true, encoding: 'base64' });
    const bb = await p.evaluate(async (s, th) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; let a = 1e9, e = 1e9, f = -1, g = -1; for (let j = 0; j < c.height; j++) for (let k = 0; k < c.width; k++) if (d[(j * c.width + k) * 4 + 3] > th) { if (k < a) a = k; if (k > f) f = k; if (j < e) e = j; if (j > g) g = j; } return [a, e, f, g]; }, shot, i === 17 ? 120 : 12);
    const [x1, y1, x2, y2] = [bb[0] + X0, bb[1] + Y0, bb[2] + X0, bb[3] + Y0], cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    let w = (x2 - x1) / .8, h = (y2 - y1) / .8; if (w / h > 4 / 3) h = w * 3 / 4; else w = h * 4 / 3;
    const vb = [cx - w / 2, cy - h / 2, w, h].map(n => +n.toFixed(1)).join(' '), slug = String(i).padStart(2, '0') + '-' + l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="EV Roadside logo, ${l.name}">${inner}</svg>`;
    fs.writeFileSync(`${out}/svg/${slug}.svg`, svg);
    await p.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
    await p.setContent(`<body style="margin:0;background:${l.bg}">${svg.replace('<svg ', '<svg width="1200" height="900" style="display:block" ')}`);
    await p.screenshot({ path: `${out}/png/${slug}.png` });
    meta.push({ i, name: l.name, color: l.color, bg: l.bg, slug, svg });
  }
  fs.writeFileSync(__dirname + '/meta.json', JSON.stringify(meta));
  const sheet = async (list, file, cols, cw) => { await p.setViewport({ width: cols * cw + (cols + 1) * 14, height: 800, deviceScaleFactor: 1 }); await p.setContent(`<body style="margin:0;background:#6f7378"><div style="display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:14px;padding:14px">${list.map(m => `<div style="background:${m.bg};height:${cw * .75}px;position:relative">${m.svg.replace('<svg ', `<svg width="${cw}" height="${cw * .75}" style="display:block" `)}<b style="position:absolute;left:10px;top:8px;font:600 15px Arial;color:#888">${m.i}</b></div>`).join('')}</div>`); await p.screenshot({ path: file, fullPage: true }); };
  await sheet(meta.slice(0, 10), __dirname + '/c1.png', 2, 760);
  await sheet(meta.slice(10), __dirname + '/c2.png', 2, 760);
  await sheet(meta, out + '/all-20-logos.png', 4, 640);
  await b.close(); console.log('exported', meta.length);
})();

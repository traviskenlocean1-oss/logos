// usage: node export2.js sheet 1,2,3 file.png [g]   |   node export2.js all <outdir>
const pp = require('C:/Users/locea_zau6eja/OneDrive/AI CODING/VISIONARY/node_modules/puppeteer');
const fs = require('fs'), { C, G } = require('./kit'), all = require('./logos2');
const luma = h => { const n = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)), v = Math.round(n[0] * .299 + n[1] * .587 + n[2] * .114).toString(16).padStart(2, '0'); return v + v + v; };
const toGray = s => s.replace(/(["'( ])#([0-9a-fA-F]{6})(?=["') ])/g, (m, a, h) => a + '#' + luma(h)).split('rgba(0,8,30,').join('rgba(0,0,0,');
const X0 = -200, Y0 = -200, BW = 2000, BH = 1700;
const bg = (l, g) => l.bgc ? (g ? l.bgg : l.bgc) : '#FFFFFF';
async function fit(p, inner, th) {
  await p.setViewport({ width: BW / 2, height: BH / 2 });
  await p.setContent(`<body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${X0} ${Y0} ${BW} ${BH}" width="${BW / 2}" height="${BH / 2}">${inner}</svg>`);
  const s = await p.screenshot({ omitBackground: true, encoding: 'base64' });
  const q = await p.evaluate(async (s, th) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; let a = 1e9, e = 1e9, f = -1, g = -1; for (let j = 0; j < c.height; j++) for (let k = 0; k < c.width; k++) if (d[(j * c.width + k) * 4 + 3] > th) { if (k < a) a = k; if (k > f) f = k; if (j < e) e = j; if (j > g) g = j; } return [a, e, f, g].map(n => n * 2); }, s, th);
  const x1 = q[0] + X0, y1 = q[1] + Y0, x2 = q[2] + X0, y2 = q[3] + Y0; let w = (x2 - x1) / .88, h = (y2 - y1) / .88; if (w / h > 4 / 3) h = w * .75; else w = h * 4 / 3;
  return [(x1 + x2) / 2 - w / 2, (y1 + y2) / 2 - h / 2, w, h].map(n => +n.toFixed(1)).join(' ');
}
(async () => {
  const b = await pp.launch({ headless: 'new', protocolTimeout: 240000 }), p = await b.newPage(); p.setDefaultTimeout(240000);
  const one = async (i, g, w) => { const l = all[i], inner = g ? toGray(l.draw(G)) : l.draw(C), vb = l.vb || (l.vb = await fit(p, inner, l.bgc ? 90 : 60)); const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="EV Jumpstart logo, ${l.name}${g ? ', gray' : ''}">${inner}</svg>`; await p.setViewport({ width: w, height: w * .75 }); await p.setContent(`<body style="margin:0;background:${bg(l, g)}">${svg.replace('<svg ', `<svg width="${w}" height="${w * .75}" style="display:block" `)}`); await new Promise(r => setTimeout(r, 250)); const file = `${__dirname}/o_${i}${g ? 'g' : ''}.png`; const shot = await p.screenshot(); let clear = null; if (w > 1000 && !l.bgc) { await p.setContent(`<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${w}" height="${w * .75}" style="display:block" `)}`); await new Promise(r => setTimeout(r, 250)); clear = await p.screenshot({ omitBackground: true }); } return { svg, shot, l, clear }; };
  if (process.argv[2] === 'sheet') {
    const ids = process.argv[3].split(',').map(Number), g = process.argv[5] === 'g', fs_ = [];
    for (const i of ids) { const r = await one(i, g, 900); fs.writeFileSync(`${__dirname}/s_${i}.png`, r.shot); fs_.push(`${__dirname}/s_${i}.png`); }
    require('child_process').execFileSync('magick', ['montage', ...fs_, '-tile', '2x', '-geometry', '900x675+8+8', '-background', '#70757b', process.argv[4]]);
  } else {
    const out = process.argv[3], meta = []; for (const d of ['color', 'gray', 'transparent', 'svg', 'web']) fs.mkdirSync(`${out}/${d}`, { recursive: true });
    for (const i of Object.keys(all).map(Number)) for (const g of [false, true]) { const r = await one(i, g, 2400), slug = `${String(i + 20).padStart(2, '0')}-${r.l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}${g ? '-gray' : ''}`; fs.writeFileSync(`${out}/${g ? 'gray' : 'color'}/${slug}.png`, r.shot); if (!r.l.render) fs.writeFileSync(`${out}/svg/${slug}.svg`, r.svg); if (r.clear) fs.writeFileSync(`${out}/transparent/${slug}.png`, r.clear); require('child_process').execFileSync('magick', [`${out}/${g ? 'gray' : 'color'}/${slug}.png`, '-resize', '1200x', '-quality', '88', `${out}/web/${slug}.webp`]); meta.push({ i, g, slug, name: r.l.name, from: r.l.from, render: !!r.l.render }); console.log(slug); }
    fs.writeFileSync(__dirname + '/meta2.json', JSON.stringify(meta));
  }
  await b.close();
})();

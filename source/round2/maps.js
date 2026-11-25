// Paint maps projected onto the van (side x:-3..3 -> 4096px, y:-0.1..2.15; front z:-1.2..1.2) and the world map for the globe.
const pp = require('C:/Users/locea_zau6eja/OneDrive/AI CODING/VISIONARY/node_modules/puppeteer');
const fs = require('fs'), d3 = require('d3-geo'), topo = require('topojson-client');
const W = 4096, H = 1536, sx = x => (x + 3) / 6 * W, sy = y => (2.15 - y) / 2.25 * H;
const pt = (x, y) => `${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
const FW = 2048, FH = 1920, fx = z => (z + 1.2) / 2.4 * FW, fy = y => (2.15 - y) / 2.25 * FH, fp = (z, y) => `${fx(z).toFixed(1)} ${fy(y).toFixed(1)}`;
const svg = (w, h, inner, bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
// side glass: one dark, continuous greenhouse band, kicked up at the rear
const glass = `M${pt(-0.02, 1.70)}L${pt(0.62, 1.69)}C${pt(0.86, 1.66)} ${pt(1.12, 1.48)} ${pt(1.50, 1.16)}C${pt(1.52, 1.13)} ${pt(1.50, 1.10)} ${pt(1.45, 1.10)}L${pt(0.02, 1.12)}C${pt(-0.05, 1.12)} ${pt(-0.10, 1.18)} ${pt(-0.10, 1.24)}L${pt(-0.10, 1.60)}Q${pt(-0.10, 1.70)} ${pt(-0.02, 1.70)}Z`;
const seams = [`M${pt(-0.16, 1.80)}L${pt(-0.16, 0.36)}`, `M${pt(0.92, 1.12)}C${pt(0.99, 0.9)} ${pt(0.99, 0.6)} ${pt(0.90, 0.36)}`, `M${pt(-1.28, 1.80)}L${pt(-1.28, 0.98)}`, `M${pt(-0.16, 0.36)}L${pt(0.90, 0.36)}`, `M${pt(-2.36, 0.62)}L${pt(-2.36, 1.72)}`, `M${pt(-1.28, 1.0)}L${pt(-0.16, 1.0)}`];
const handles = [[-0.10, 0.98], [-0.34, 0.98]].map(([x, y], i) => `<rect x="${sx(i ? x - .08 : x)}" y="${sy(y)}" width="${sx(.18) - sx(0)}" height="${sy(0) - sy(.032)}" rx="10"/>`).join('');
const trim = `M${pt(-3, 0.40)}L${pt(3, 0.40)}L${pt(3, 0)}L${pt(-3, 0)}Z`;
// livery: two tapered speed sweeps
const sweepB = `M${pt(-2.6, 0.62)}C${pt(-1.4, 0.60)} ${pt(-0.6, 0.64)} ${pt(0.35, 1.02)}L${pt(0.18, 1.02)}C${pt(-0.7, 0.80)} ${pt(-1.5, 0.78)} ${pt(-2.6, 0.96)}Z`;
const sweepG = `M${pt(-2.6, 1.04)}C${pt(-1.5, 0.84)} ${pt(-0.8, 0.86)} ${pt(0.08, 1.04)}L${pt(-0.22, 1.04)}C${pt(-0.9, 0.96)} ${pt(-1.6, 0.98)} ${pt(-2.6, 1.22)}Z`;
// front
const wind = `M${fp(-0.66, 1.80)}L${fp(0.66, 1.80)}C${fp(0.76, 1.6)} ${fp(0.86, 1.36)} ${fp(0.90, 1.17)}C${fp(0.6, 1.10)} ${fp(-0.6, 1.10)} ${fp(-0.90, 1.17)}C${fp(-0.86, 1.36)} ${fp(-0.76, 1.6)} ${fp(-0.66, 1.80)}Z`;
const panel = `M${fp(-1.2, 0.86)}L${fp(1.2, 0.86)}L${fp(1.2, 0.755)}L${fp(0.62, 0.70)}L${fp(-0.62, 0.70)}L${fp(-1.2, 0.755)}Z`;
const intake = `M${fp(-0.62, 0.47)}L${fp(0.62, 0.47)}L${fp(0.50, 0.32)}L${fp(-0.50, 0.32)}Z`;
const files = {
  side_glass: svg(W, H, `<path d="${glass}" fill="#fff"/>`, '#000'),
  side_seam: svg(W, H, `<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">${seams.map(d => `<path d="${d}"/>`).join('')}</g>`, '#000'),
  side_dark: svg(W, H, `<path d="${trim}" fill="#fff"/><g fill="#fff">${handles}</g>`, '#000'),
  side_livery: svg(W, H, `<path d="${sweepB}" fill="#f00"/><path d="${sweepG}" fill="#0f0"/>`, '#000'),
  front_glass: svg(FW, FH, `<path d="${wind}" fill="#fff"/>`, '#000'),
  front_dark: svg(FW, FH, `<path d="${intake}" fill="#fff"/><rect y="${fy(.30)}" width="${FW}" height="500" fill="#fff"/>`, '#000'),
};
const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-50m.json', 'utf8')), land = topo.feature(world, world.objects.land);
const pr = d3.geoEquirectangular().scale(8192 / (2 * Math.PI)).translate([4096, 2048]);
files.land = svg(8192, 4096, `<path d="${d3.geoPath(pr)(land)}" fill="#fff"/>`, '#000');
(async () => {
  const b = await pp.launch({ headless: 'new' }), p = await b.newPage();
  for (const [k, s] of Object.entries(files)) { const w = +s.match(/width="(\d+)"/)[1], h = +s.match(/height="(\d+)"/)[1]; await p.setViewport({ width: w, height: h }); await p.setContent(`<body style="margin:0">${s}`); await p.screenshot({ path: `${__dirname}/${k}.png` }); console.log(k, w, h); }
  await b.close();
})();

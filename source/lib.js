const fs = require('fs'), ot = require('opentype.js'), topo = require('topojson-client');
const d3 = require('d3-geo');
const world = JSON.parse(fs.readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = topo.feature(world, world.objects.land);
const fc = {};
const F = (n, v) => { const k = n + v; if (!fc[k]) { const b = fs.readFileSync(`${__dirname}/node_modules/@fontsource/${n}/files/${n}-latin-${v}.woff`); fc[k] = ot.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)); } return fc[k]; };
const fonts = { archivo: ['archivo-black', '400-normal'], kanit: ['kanit', '800-italic'], barlowI: ['barlow-condensed', '800-italic'], barlow: ['barlow-condensed', '700-normal'], righteous: ['righteous', '400-normal'], russo: ['russo-one', '400-normal'], outfit: ['outfit', '800-normal'], outfitM: ['outfit', '500-normal'], michroma: ['michroma', '400-normal'], fredoka: ['fredoka', '700-normal'], slab: ['alfa-slab-one', '400-normal'], saira: ['saira-extra-condensed', '800-normal'], rubik: ['rubik', '900-normal'], shoulders: ['big-shoulders-display', '900-normal'], syncopate: ['syncopate', '700-normal'], sora: ['sora', '800-normal'], yellowtail: ['yellowtail', '400-normal'], teko: ['teko', '700-normal'], bowlby: ['bowlby-one', '400-normal'], staat: ['staatliches', '400-normal'], oswald: ['oswald', '700-normal'], titan: ['titan-one', '400-normal'] };
const font = k => F(...fonts[k]);
function run(k, str, track = 0) { const f = font(k), S = 1000, p = new ot.Path(); let x = 0; const gs = f.stringToGlyphs(str); gs.forEach((g, i) => { g.getPath(x, 0, S).commands.forEach(c => p.commands.push(c)); let a = g.advanceWidth * S / f.unitsPerEm; if (i < gs.length - 1) a += f.getKerningValue(g, gs[i + 1]) * S / f.unitsPerEm; x += a + track; }); return p; }
// Fit the ink box of a word into x,y,w and/or h. a:'m' centers on x.
function word(k, str, o) {
  const p = run(k, str, o.track || 0), b = p.getBoundingBox(), bw = b.x2 - b.x1, bh = b.y2 - b.y1;
  let sx = o.w ? o.w / bw : null, sy = o.h ? o.h / bh : null; if (sx == null) sx = sy; if (sy == null) sy = sx;
  const w = bw * sx, h = bh * sy; let x = o.x; if (o.a === 'm') x -= w / 2; if (o.a === 'e') x -= w;
  const pt = (px, py) => `${((px - b.x1) * sx + x).toFixed(2)} ${((py - b.y1) * sy + o.y).toFixed(2)}`;
  let d = '';
  p.commands.forEach(c => { if (c.type === 'M' || c.type === 'L') d += c.type + pt(c.x, c.y); else if (c.type === 'C') d += 'C' + pt(c.x1, c.y1) + ' ' + pt(c.x2, c.y2) + ' ' + pt(c.x, c.y); else if (c.type === 'Q') d += 'Q' + pt(c.x1, c.y1) + ' ' + pt(c.x, c.y); else d += 'Z'; });
  return { d, w, h, x, y: o.y };
}
function arc(k, str, o) {
  const f = font(k), S = o.size, tr = o.track || 0, gs = f.stringToGlyphs(str);
  const adv = gs.map((g, i) => g.advanceWidth * S / f.unitsPerEm + (i < gs.length - 1 ? tr : 0)), tot = adv.reduce((a, b) => a + b, 0), dir = o.inward ? -1 : 1;
  let cur = -tot / 2, out = '';
  gs.forEach((g, i) => { const gw = g.advanceWidth * S / f.unitsPerEm, ang = o.mid * Math.PI / 180 + dir * (cur + gw / 2) / o.r, px = o.cx + o.r * Math.cos(ang), py = o.cy + o.r * Math.sin(ang), rot = ang * 180 / Math.PI + (o.inward ? -90 : 90), d = g.getPath(-gw / 2, 0, S).toPathData(1); if (d) out += `<path d="${d}" transform="translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${rot.toFixed(2)})"/>`; cur += adv[i]; });
  return `<g fill="${o.fill}">${out}</g>`;
}
const proj = (cx, cy, r, rot) => d3.geoOrthographic().scale(r).translate([cx, cy]).rotate(rot).clipAngle(90).precision(.3);
function rings(cx, cy, r, rot) { const out = []; let cur = null; const ctx = { moveTo(x, y) { cur = [[x, y]]; out.push(cur); }, lineTo(x, y) { cur.push([x, y]); }, closePath() { }, arc() { }, beginPath() { } }; d3.geoPath(proj(cx, cy, r, rot), ctx)(land); return out; }
const area = p => { let a = 0; for (let i = 0; i < p.length; i++) { const [x, y] = p[i], [u, v] = p[(i + 1) % p.length]; a += x * v - u * y; } return Math.abs(a / 2); };
function rdp(p, e) { if (p.length < 3) return p; let m = 0, ix = 0; const a = p[0], b = p[p.length - 1], Ln = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let i = 1; i < p.length - 1; i++) { const d = Ln < 1e-3 ? Math.hypot(p[i][0] - a[0], p[i][1] - a[1]) : Math.abs((b[0] - a[0]) * (a[1] - p[i][1]) - (a[0] - p[i][0]) * (b[1] - a[1])) / Ln; if (d > m) { m = d; ix = i; } } return m > e ? [...rdp(p.slice(0, ix + 1), e).slice(0, -1), ...rdp(p.slice(ix), e)] : [a, b]; }
function smooth(p, cx, cy, r) { const n = p.length, f = v => v.toFixed(1), on = q => Math.hypot(q[0] - cx, q[1] - cy) > r * .985; let d = `M${f((p[n - 1][0] + p[0][0]) / 2)} ${f((p[n - 1][1] + p[0][1]) / 2)}`; for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; d += on(a) ? `L${f(a[0])} ${f(a[1])}L${f(mx)} ${f(my)}` : `Q${f(a[0])} ${f(a[1])} ${f(mx)} ${f(my)}`; } return d + 'Z'; }
function simp(cx, cy, r, rot, eps, min) { return rings(cx, cy, r, rot).filter(p => area(p) > min * Math.PI * r * r).map(p => { const k = Math.floor(p.length / 2); return [...rdp(p.slice(0, k + 1), eps * r).slice(0, -1), ...rdp([...p.slice(k), p[0]], eps * r).slice(0, -1)]; }); }
const continents = (cx, cy, r, rot = [85, -18], eps = .018, min = .004) => simp(cx, cy, r, rot, eps, min).map(q => smooth(q, cx, cy, r)).join('');
const hardContinents = (cx, cy, r, rot, eps = .05, min = .01) => simp(cx, cy, r, rot, eps, min).map(q => 'M' + q.map(v => v.map(n => n.toFixed(1)).join(' ')).join('L') + 'Z').join('');
const grat = (cx, cy, r, rot, step = [30, 30]) => d3.geoPath(proj(cx, cy, r, rot)).digits(1)(d3.geoGraticule().step(step)());
function grid(cx, cy, r, mer = [.38, .75], par = [0, .5]) { let d = `M${cx} ${cy - r}V${cy + r}`; mer.forEach(m => { const rx = r * m; d += `M${cx} ${cy - r}A${rx} ${r} 0 0 0 ${cx} ${cy + r}A${rx} ${r} 0 0 0 ${cx} ${cy - r}`; }); par.forEach(p => { const hw = r * Math.sqrt(1 - p * p); (p ? [-p, p] : [0]).forEach(q => { d += `M${cx - hw} ${cy + q * r}H${cx + hw}`; }); }); return d; }
const isLand = (lon, lat) => d3.geoContains(land, [lon, lat]);
const BOLT = 'M14 0L0 23H11L6 42L26 15H14L20 0Z';
const bolt = (x, y, s, fill, extra = '') => `<path d="${BOLT}" transform="translate(${x} ${y}) scale(${s})" fill="${fill}" ${extra}/>`;
const VAN = 'M8 78V26Q8 10 24 10H110C132 10 141 18 150 33L158 46C176 49 190 54 193 68V79Q193 86 186 86H177A22 22 0 0 0 133 86H69A22 22 0 0 0 25 86H16Q8 86 8 78Z';
const VWIN = 'M112 21H120C130 21 135 26 141 36L146 45H112Z';
const VANL = 'M33 86H16Q8 86 8 78V26Q8 10 24 10H110C132 10 141 18 150 33L158 46C176 49 190 54 193 68V79Q193 86 186 86H173M65 86H137';
function van(x, y, s, o) { const b = o.body, w = o.wheel || b; return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${VAN}" fill="${b}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 4}" stroke-linejoin="round"` : ''}/><path d="${VWIN}" fill="${o.win}"/>${o.light ? `<path d="M176 58L188 62Q191 66 190 70H180Z" fill="${o.light}"/>` : ''}${o.bolt ? bolt(o.bx || 50, o.by || 21, o.bs || 1, o.bolt) : ''}${[47, 155].map(c => `<circle cx="${c}" cy="86" r="17" fill="${w}"/><circle cx="${c}" cy="86" r="${o.hubR || 7}" fill="${o.hub}"/>`).join('')}</g>`; }
const plug = (x, y, s, fill, rot = 0, prong) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 -5H6C10 -5 11 -20 20 -20H36Q40 -20 40 -16V16Q40 20 36 20H20C11 20 10 5 6 5H0Z" fill="${fill}"/><rect x="43" y="-13.5" width="20" height="8" rx="2.5" fill="${prong || fill}"/><rect x="43" y="5.5" width="20" height="8" rx="2.5" fill="${prong || fill}"/></g>`;
const cloud = (x, y, s, fill, o = 1) => `<path transform="translate(${x} ${y}) scale(${s})" opacity="${o}" d="M14 34A14 14 0 0 1 16 6A20 20 0 0 1 52 2A16 16 0 0 1 76 14A11 11 0 0 1 74 34Z" fill="${fill}"/>`;
const P = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
const L = (d, stroke, w, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const C = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const R = (x, y, w, h, fill, rx = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const extrude = (d, n, dx, dy, fill) => Array.from({ length: n }, (_, i) => `<path d="${d}" fill="${fill}" transform="translate(${((n - i) * dx).toFixed(2)} ${((n - i) * dy).toFixed(2)})"/>`).join('');
module.exports = { word, arc, continents, hardContinents, grat, grid, isLand, rings, bolt, BOLT, van, VAN, VWIN, VANL, plug, cloud, P, L, C, R, extrude, proj, d3 };

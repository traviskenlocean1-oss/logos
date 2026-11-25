const fs = require('fs'), path = require('path'), ot = require('opentype.js');
const { execFileSync } = require('child_process'), { PNG } = require('pngjs');
const L1 = require('../logos/lib');
const fc = {};
const font = k => { if (!fc[k]) { const [n, v] = k.split(':'), b = fs.readFileSync(`${__dirname}/node_modules/@fontsource/${n}/files/${n}-latin-${v}.woff`); fc[k] = ot.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)); } return fc[k]; };
// Fit the ink of a word to x,y and w and/or h. a: 'm' centers, 'e' right-aligns. skew slants it.
function word(k, str, o) {
  const f = font(k), S = 1000, P = new ot.Path(); let x = 0; const gs = f.stringToGlyphs(str);
  gs.forEach((g, i) => { g.getPath(x, 0, S).commands.forEach(c => P.commands.push(c)); let a = g.advanceWidth * S / f.unitsPerEm; if (i < gs.length - 1) a += f.getKerningValue(g, gs[i + 1]) * S / f.unitsPerEm; x += a + (o.track || 0); });
  const b = P.getBoundingBox(), bw = b.x2 - b.x1, bh = b.y2 - b.y1; let sx = o.w ? o.w / bw : null, sy = o.h ? o.h / bh : null; if (sx == null) sx = sy; if (sy == null) sy = sx;
  const w = bw * sx, h = bh * sy; let X = o.x; if (o.a === 'm') X -= w / 2; if (o.a === 'e') X -= w;
  const pt = (px, py) => { const yy = (py - b.y1) * sy + o.y; return `${((px - b.x1) * sx + X + (o.skew || 0) * (o.y + h - yy)).toFixed(2)} ${yy.toFixed(2)}`; };
  let d = ''; P.commands.forEach(c => { if (c.type === 'M' || c.type === 'L') d += c.type + pt(c.x, c.y); else if (c.type === 'C') d += 'C' + pt(c.x1, c.y1) + ' ' + pt(c.x2, c.y2) + ' ' + pt(c.x, c.y); else if (c.type === 'Q') d += 'Q' + pt(c.x1, c.y1) + ' ' + pt(c.x, c.y); else d += 'Z'; });
  return { d, w, h, x: X, y: o.y };
}
function arc(k, str, o) { const f = font(k), S = o.size, gs = f.stringToGlyphs(str), adv = gs.map((g, i) => g.advanceWidth * S / f.unitsPerEm + (i < gs.length - 1 ? (o.track || 0) : 0)), tot = adv.reduce((a, b) => a + b, 0), dir = o.inward ? -1 : 1; let cur = -tot / 2, out = ''; gs.forEach((g, i) => { const gw = g.advanceWidth * S / f.unitsPerEm, an = o.mid * Math.PI / 180 + dir * (cur + gw / 2) / o.r; const d = g.getPath(-gw / 2, 0, S).toPathData(1); if (d) out += `<path d="${d}" transform="translate(${(o.cx + o.r * Math.cos(an)).toFixed(2)} ${(o.cy + o.r * Math.sin(an)).toFixed(2)}) rotate(${(an * 180 / Math.PI + (o.inward ? -90 : 90)).toFixed(2)})"/>`; cur += adv[i]; }); return `<g fill="${o.fill}">${out}</g>`; }
const C = { ink: '#071B3B', deep: '#06307F', blue: '#0B5CE0', sky: '#18A5EE', green: '#0FAE60', lime: '#5FD36A', slate: '#55657D', paper: '#FFFFFF', dark: '#050F24', mist: '#E8EEF5', gray: false };
const G = { ink: '#191B1E', deep: '#2B2E33', blue: '#4A4F57', sky: '#868C94', green: '#767C84', lime: '#B9BEC4', slate: '#686D74', paper: '#FFFFFF', dark: '#131518', mist: '#ECEDEF', gray: true };
// ---- rendered images: trimmed, cached, gray twin
const cache = {};
function asset(name, gray) {
  const key = name + (gray ? '_g' : ''); if (cache[key]) return cache[key];
  const src = path.join(__dirname, name + '.png'), dst = path.join(__dirname, 'tr_' + key + '.png');
  if (!fs.existsSync(dst) || fs.statSync(dst).mtimeMs < fs.statSync(src).mtimeMs) execFileSync('magick', [src, '-trim', '+repage', ...(name.startsWith('ev_chrome') ? ['-channel', 'RGB', '-level', '6%,70%', '+channel'] : []), ...(gray ? ['-channel', 'RGB', '-colorspace', 'Gray', '+channel', '-sigmoidal-contrast', '2.2x50%'] : []), 'PNG32:' + dst]);
  const buf = fs.readFileSync(dst), p = PNG.sync.read(buf); return cache[key] = { uri: 'data:image/png;base64,' + buf.toString('base64'), w: p.width, h: p.height };
}
const I = (p, name, x, y, w, ex = '') => { const a = asset(name, p.gray); return `<image href="${a.uri}" x="${x}" y="${y}" width="${w}" height="${(w * a.h / a.w).toFixed(2)}" ${ex}/>`; };
const ih = (name, w) => { const a = asset(name, false); return w * a.h / a.w; };
// ---- gradients
const lin = (id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0, u = '') => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${u}>${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" ${a != null ? `stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = .34, cy = .26, r = .85) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" ${a != null ? `stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
const US = 'gradientUnits="userSpaceOnUse"';
// ---- shapes
const f1 = n => n.toFixed(1);
// tapered sweep along an ellipse arc (degrees), width function of t 0..1
function sweep(cx, cy, rx, ry, rot, a0, a1, wf, n = 120) { const R = rot * Math.PI / 180, o = [], q = []; for (let i = 0; i <= n; i++) { const t = i / n, a = (a0 + (a1 - a0) * t) * Math.PI / 180, x = rx * Math.cos(a), y = ry * Math.sin(a), dx = -rx * Math.sin(a), dy = ry * Math.cos(a), l = Math.hypot(dx, dy), nx = dy / l, ny = -dx / l, w = wf(t) / 2, tr = (u, v) => `${f1(cx + u * Math.cos(R) - v * Math.sin(R))} ${f1(cy + u * Math.sin(R) + v * Math.cos(R))}`; o.push(tr(x + nx * w, y + ny * w)); q.push(tr(x - nx * w, y - ny * w)); } return 'M' + o.join('L') + 'L' + q.reverse().join('L') + 'Z'; }
const ell = (cx, cy, rx, ry, rot, a) => { const R = rot * Math.PI / 180, t = a * Math.PI / 180, x = rx * Math.cos(t), y = ry * Math.sin(t), dx = -rx * Math.sin(t), dy = ry * Math.cos(t); return { x: cx + x * Math.cos(R) - y * Math.sin(R), y: cy + x * Math.sin(R) + y * Math.cos(R), ang: Math.atan2(dx * Math.sin(R) + dy * Math.cos(R), dx * Math.cos(R) - dy * Math.sin(R)) * 180 / Math.PI }; };
const bell = (max, p0 = .5, e = 1) => t => max * Math.pow(Math.max(0, t < p0 ? t / p0 : (1 - t) / (1 - p0)), e);
// ---- vector van from the 3D model's own profile; 513 x 200 units at s=1 (x -2.56..2.57)
const TOP = [[-2.56, .95], [-2.54, 1.30], [-2.48, 1.66], [-2.36, 1.86], [-2.1, 1.955], [-1.2, 2.0], [-.2, 2.0], [.45, 1.955], [.85, 1.83], [1.25, 1.57], [1.62, 1.28], [1.86, 1.135], [2.15, 1.04], [2.36, .955], [2.48, .85], [2.545, .72], [2.57, .60]];
function mono(tab, x) { for (let i = 0; i < tab.length - 1; i++) { const [x0, y0] = tab[i], [x1, y1] = tab[i + 1]; if (x >= x0 && x <= x1) { const sl = j => { if (j <= 0 || j >= tab.length - 1) return (tab[Math.min(j + 1, tab.length - 1)][1] - tab[Math.max(j - 1, 0)][1]) / (tab[Math.min(j + 1, tab.length - 1)][0] - tab[Math.max(j - 1, 0)][0]); const a = (tab[j][1] - tab[j - 1][1]) / (tab[j][0] - tab[j - 1][0]), b = (tab[j + 1][1] - tab[j][1]) / (tab[j + 1][0] - tab[j][0]); return a * b <= 0 ? 0 : 2 * a * b / (a + b); }; const h = x1 - x0, t = (x - x0) / h; return (2 * t ** 3 - 3 * t * t + 1) * y0 + (t ** 3 - 2 * t * t + t) * h * sl(i) + (-2 * t ** 3 + 3 * t * t) * y1 + (t ** 3 - t * t) * h * sl(i + 1); } } }
const vx = x => (x + 2.56) * 100, vy = y => (2.0 - y) * 100;
const V = (x, y) => `${f1(vx(x))} ${f1(vy(y))}`;
let roof = []; for (let i = 0; i <= 140; i++) { const t = i / 140, x = -2.56 + 5.13 * (.35 * t + .65 * (.5 - .5 * Math.cos(Math.PI * t))); roof.push(V(x, mono(TOP, Math.min(x, 2.57)))); }
const BODY = `M${V(-2.56, .95)}L${roof.join('L')}C${V(2.585, .46)} ${V(2.53, .30)} ${V(2.36, .30)}L${V(2.02, .29)}A44 44 0 0 0 ${V(1.14, .29)}L${V(-1.14, .29)}A44 44 0 0 0 ${V(-2.02, .29)}L${V(-2.30, .31)}C${V(-2.50, .33)} ${V(-2.56, .50)} ${V(-2.56, .70)}Z`;
const ROOFLINE = `M${roof.join('L')}`;
const VGLASS = `M${V(-.02, 1.72)}L${V(.60, 1.71)}C${V(.86, 1.67)} ${V(1.14, 1.48)} ${V(1.50, 1.17)}C${V(1.52, 1.13)} ${V(1.50, 1.11)} ${V(1.45, 1.11)}L${V(.02, 1.13)}C${V(-.05, 1.13)} ${V(-.10, 1.18)} ${V(-.10, 1.25)}L${V(-.10, 1.62)}Q${V(-.10, 1.72)} ${V(-.02, 1.72)}Z`;
const VWIND = `M${V(.80, 1.80)}L${V(1.04, 1.70)}L${V(1.72, 1.18)}L${V(1.60, 1.17)}Z`;
function wheelV(x, p, rim, tire) { const cx = vx(x), cy = vy(.375); let sp = ''; for (let k = 0; k < 5; k++) for (const o of [-.17, .17]) { const a = k * 2 * Math.PI / 5 - Math.PI / 2 + o, b = k * 2 * Math.PI / 5 - Math.PI / 2 + o * .3; sp += `M${f1(cx + 5 * Math.cos(b))} ${f1(cy + 5 * Math.sin(b))}L${f1(cx + 26.5 * Math.cos(a))} ${f1(cy + 26.5 * Math.sin(a))}`; } return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="37.5" fill="${tire}"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="28" fill="none" stroke="${rim}" stroke-width="3"/><path d="${sp}" stroke="${rim}" stroke-width="4.4" fill="none"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="6" fill="${rim}"/>`; }
let vid = 0;
function vvan(x, y, s, p, o = {}) {
  const id = 'vv' + (++vid), body = o.body || [[0, '#FFFFFF'], [.45, '#F1F5FA'], [.75, '#C9D3E0'], [1, '#95A3B7']], rim = o.rim || '#E9EEF4', tire = o.tire || p.ink, gl = o.glass || p.ink;
  return `<g transform="translate(${x} ${y}) scale(${s})"><defs>${lin(id, body, 0, 0, 0, 1)}${lin(id + 'g', [[0, gl], [.55, gl], [1, o.glass2 || p.deep]], 0, 0, 1, 1)}<clipPath id="${id}c"><path d="${BODY}"/></clipPath></defs>
${o.halo ? `<path d="${BODY}" fill="${o.halo}" stroke="${o.halo}" stroke-width="${o.hw || 16}" stroke-linejoin="round"/>${[-1.58, 1.58].map(c => `<circle cx="${vx(c)}" cy="${vy(.375)}" r="${37.5 + (o.hw || 16) / 2}" fill="${o.halo}"/>`).join('')}` : ''}
${[-1.58, 1.58].map(c => `<circle cx="${vx(c)}" cy="${vy(.375)}" r="43" fill="${tire}"/>`).join('')}<path d="${BODY}" fill="url(#${id})"/>
<g clip-path="url(#${id}c)">${o.sweeps === false ? '' : `<path d="M${V(-2.6, .56)}C${V(-1.4, .56)} ${V(-.5, .62)} ${V(.5, 1.03)}L${V(.26, 1.03)}C${V(-.7, .78)} ${V(-1.5, .74)} ${V(-2.6, .92)}Z" fill="${o.s1 || p.blue}"/><path d="M${V(-2.6, 1.0)}C${V(-1.5, .80)} ${V(-.8, .84)} ${V(.12, 1.05)}L${V(-.24, 1.05)}C${V(-.9, .93)} ${V(-1.6, .94)} ${V(-2.6, 1.22)}Z" fill="${o.s2 || p.green}"/>`}<path d="M${V(-2.6, 1.98)}L${V(.5, 1.96)}L${V(.2, 1.90)}L${V(-2.2, 1.92)}Z" fill="#fff" opacity="${o.shine == null ? .7 : o.shine}"/><path d="M${V(2.06, .865)}H520V${vy(.755)}L${V(2.14, .755)}Z" fill="${gl}"/><path d="M${V(2.06, .862)}H520V${vy(.835)}L${V(2.085, .835)}Z" fill="${o.led || '#EAF6FF'}"/></g>
<path d="${VGLASS}" fill="url(#${id}g)"/><path d="M${V(.62, 1.66)}L${V(.80, 1.60)}L${V(.42, 1.14)}L${V(.16, 1.14)}Z" fill="#fff" opacity=".14"/><path d="${VWIND}" fill="${gl}" opacity=".92"/>
<path d="M${V(-.16, 1.80)}V${vy(.34)}M${V(.92, 1.10)}C${V(.99, .9)} ${V(.99, .6)} ${V(.90, .34)}" stroke="${gl}" stroke-width="1.5" opacity=".5" fill="none"/>${[[-.30, 1.01], [-.06, 1.01]].map(([a, b]) => `<rect x="${vx(a)}" y="${vy(b)}" width="16" height="3.2" rx="1.6" fill="${gl}"/>`).join('')}
${wheelV(-1.58, p, rim, tire)}${wheelV(1.58, p, rim, tire)}</g>`;
}
const BOLT = 'M62 0L0 92H44L22 168L108 60H60L88 0Z'; // 108 x 168
const bolt = (x, y, s, fill, ex = '') => `<path d="${BOLT}" transform="translate(${x} ${y}) scale(${s})" fill="${fill}" ${ex}/>`;
// slim connector, cable entry at origin, pointing right; 150 long
const plugV = (x, y, s, rot, fill, prong, ring) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-4 -9H14C30 -9 34 -38 58 -38H92Q100 -38 100 -30V30Q100 38 92 38H58C34 38 30 9 14 9H-4Z" fill="${fill}"/>${ring ? `<rect x="80" y="-38" width="8" height="76" fill="${ring}"/>` : ''}<rect x="103" y="-25" width="46" height="13" rx="4" fill="${prong || fill}"/><rect x="103" y="12" width="46" height="13" rx="4" fill="${prong || fill}"/></g>`;
// shaded cable
const cable = (d, w, p, hi) => `<path d="${d}" fill="none" stroke="${p.gray ? '#17191C' : '#070D1A'}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${hi || (p.gray ? '#6A6F76' : '#3C4B66')}" stroke-width="${w * .3}" stroke-linecap="round" transform="translate(${-w * .1} ${-w * .16})" opacity=".8"/>`;
const shadow = (cx, cy, rx, ry, o = .28) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#softsh)" opacity="${o / .28}"/>`;
const softDef = rad('softsh', [[0, '#000', .34], [.5, '#000', .16], [1, '#000', 0]], .5, .5, .5);
const land = (cx, cy, r, rot = [88, -14], eps = .006) => L1.continents(cx, cy, r, rot, eps, .0012);
module.exports = { word, arc, C, G, I, ih, asset, lin, rad, US, sweep, ell, bell, vvan, BODY, ROOFLINE, VGLASS, vx, vy, V, bolt, BOLT, plugV, cable, shadow, softDef, land, f1, L1 };

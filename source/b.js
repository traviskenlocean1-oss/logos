const { word, arc, continents, grid, isLand, bolt, BOLT, van, VAN, VWIN, VANL, plug, cloud, P, L, C, R, extrude, proj } = require('./lib');
const out = {};
const f1 = n => n.toFixed(1);

// 11: isometric van on the world
out[11] = { name: 'Isometric', color: 'Violet, coral, ice', bg: '#F3F1FF', draw() {
  const k = Math.cos(Math.PI / 6), ox = 352, oy = 168, W = 92, iso = (x, y, z) => [ox + (x - y) * k, oy + (x + y) * .5 - z];
  const pf = [[0, 16], [0, 104], [8, 112], [122, 112], [134, 106], [164, 66], [196, 54], [204, 44], [204, 16]];
  const q = (a, b, y0, y1, fill, ex = '') => `<path d="M${[iso(a[0], y0, a[1]), iso(b[0], y0, b[1]), iso(b[0], y1, b[1]), iso(a[0], y1, a[1])].map(p => p.map(f1).join(' ')).join('L')}Z" fill="${fill}" ${ex}/>`;
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const top = [['#C9BEFF', 1, 2], ['#D9D1FF', 2, 3], ['#CDC3FF', 3, 4], ['#A99AFF', 4, 5], ['#BFB2FF', 5, 6], ['#8F7BFF', 6, 7], ['#7A63F7', 7, 8]].map(([c, i, j]) => q(pf[i], pf[j], 0, W, c, `stroke="${c}" stroke-width=".8"`)).join('');
  const glass = q(lerp(pf[4], pf[5], .1), lerp(pf[4], pf[5], .92), 8, W - 8, '#2A1B6B');
  const hl = q([204, 40], [204, 28], 8, 26, '#FFE08A') + q([204, 40], [204, 28], W - 26, W - 8, '#FFE08A');
  const so = iso(0, W, 0), M = `matrix(${k.toFixed(4)} .5 0 1 ${f1(so[0])} ${f1(so[1])})`;
  const side = 'M' + pf.map(p => `${p[0]} ${-p[1]}`).join('L') + 'Z';
  const ev = word('archivo', 'EV', { x: 12, y: -92, w: 88, h: 46, track: 30 });
  const wheel = x => `<circle cx="${x}" cy="-16" r="25" fill="#3B23B8"/><circle cx="${x}" cy="-14" r="19" fill="#1C1148"/><circle cx="${x}" cy="-14" r="8" fill="#fff"/>`;
  const gx = 398, gy = 378, gr = 158, ft = [[-14, -14], [220, -14], [220, W + 16], [-14, W + 16]].map(([a, b]) => iso(a, b, -4).map(f1).join(" ")).join("L"), rt = iso(0, 0, 112);
  return `<defs><radialGradient id="k11" cx=".35" cy=".2" r=".95"><stop offset="0" stop-color="#8F7BFF"/><stop offset="1" stop-color="#3B23B8"/></radialGradient><clipPath id="k11c"><circle cx="${gx}" cy="${gy}" r="${gr}"/></clipPath></defs>${C(gx, gy, gr, 'url(#k11)')}${P(continents(gx, gy, gr, [86, -26]), '#FF7A66')}
<g clip-path="url(#k11c)"><path d="M${ft}Z" fill="#1C1148" opacity=".34" stroke="#1C1148" stroke-width="16" stroke-linejoin="round"/></g>
${top}<g transform="matrix(${k.toFixed(4)} .5 ${(-k).toFixed(4)} .5 ${f1(rt[0])} ${f1(rt[1])})"><path d="${BOLT}" transform="translate(46 16) scale(1.4)" fill="#FFD447"/></g>${glass}${hl}<g transform="${M}"><path d="${side}" fill="#5B3DF5"/><path d="M128 -100L136 -98L158 -64H112V-100Z" fill="#2A1B6B"/><path d="${ev.d}" fill="#fff"/>${wheel(46)}${wheel(162)}</g>
${L(`M${f1(iso(0, W, 40)[0] + 1)} ${f1(iso(0, W, 40)[1])}C222 190 196 262 216 330C240 412 330 452 452 436`, '#1C1148', 9)}${plug(446, 437, 1.05, '#1C1148', -9)}
<path d="${word('outfit', 'ROADSIDE', { x: 398, y: 572, w: 400, a: 'm', track: 60 }).d}" fill="#1C1148"/>`;
} };

// 12: seventies stripes
out[12] = { name: 'Seventies Stripes', color: 'Sunset stripes', bg: '#FFF6E5', draw() {
  const cols = ['#F6C453', '#F0892B', '#D94A2B', '#7E2A3A'], Rm = 214, st = 25;
  let s = '';
  cols.forEach((c, i) => { const r = Rm - i * st, q = 44 + i * st, d = `M36 ${376 + q}H${400 - Rm - 44}A${q} ${q} 0 0 0 ${400 - r} 376V330A${r} ${r} 0 0 1 ${400 + r} 330V376A${q} ${q} 0 0 0 ${400 + Rm + 44} ${376 + q}H${i ? 700 : 740}`; s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="22"/>`; });
  const ev = word('righteous', 'EV', { x: 400, y: 280, w: 172, a: 'm', track: 10 });
  return `${s}${C(400, 334, 118, '#1F6F78')}<defs><clipPath id="l12"><circle cx="400" cy="334" r="118"/></clipPath></defs><g clip-path="url(#l12)">${P(continents(400, 334, 118, [86, -14]), '#3FA7A0')}</g>
<path d="${ev.d}" fill="#FFF6E5" stroke="#7E2A3A" stroke-width="13" paint-order="stroke" stroke-linejoin="round"/>
${plug(728, 420, 1.15, '#F6C453', 0, '#7E2A3A')}
<g transform="translate(400 330) rotate(-7)">${van(-62, -(Rm + 10 + 64), .62, { body: '#7E2A3A', win: '#FFF6E5', wheel: '#7E2A3A', hub: '#F6C453', bolt: '#F6C453', light: '#F6C453' })}</g>
<path d="${word('righteous', 'ROADSIDE', { x: 400, y: 552, w: 560, a: 'm', track: 40 }).d}" fill="#7E2A3A"/>`;
} };

// 13: friendly van face
out[13] = { name: 'Friendly Face', color: 'Mint, cream, ink', bg: '#EAFBF7', draw() {
  const k = '#12323A', m = '#26C6A6', ev = word('titan', 'EV', { x: 400, y: 338, h: 46, a: 'm', track: 40 });
  return `${R(318, 30, 26, 62, k, 8)}${R(456, 30, 26, 62, k, 8)}
<path d="M276 406H334V442Q334 456 320 456H290Q276 456 276 442ZM466 406H524V442Q524 456 510 456H480Q466 456 466 442Z" fill="${k}"/>
<path d="M226 206Q206 206 206 226V252Q206 262 218 262H240V206ZM574 206Q594 206 594 226V252Q594 262 582 262H560V206Z" fill="${k}"/>
<path d="M272 118Q280 78 322 78H478Q520 78 528 118L558 268V396Q558 420 534 420H266Q242 420 242 396V268Z" fill="${m}" stroke="${k}" stroke-width="13" stroke-linejoin="round"/>
<defs><clipPath id="m13"><path d="M300 128Q304 110 322 110H478Q496 110 500 128L524 246Q526 258 512 260Q400 276 288 260Q274 258 276 246Z"/></clipPath></defs>
<g clip-path="url(#m13)"><rect x="260" y="100" width="280" height="180" fill="#DFF6FF"/>${cloud(312, 128, .62, '#fff')}${cloud(438, 118, .5, '#fff')}${C(400, 300, 146, '#2F8FE0')}${P(continents(400, 300, 146, [84, -38]), '#7FD36B')}</g>
<path d="M300 128Q304 110 322 110H478Q496 110 500 128L524 246Q526 258 512 260Q400 276 288 260Q274 258 276 246Z" fill="none" stroke="${k}" stroke-width="10"/>
${[292, 508].map(x => C(x, 330, 36, '#fff', `stroke="${k}" stroke-width="10"`) + C(x + (x < 400 ? 5 : -5), 332, 16, k) + C(x + (x < 400 ? 10 : 0), 326, 5.5, '#fff')).join('')}
<path d="${ev.d}" fill="#fff" stroke="${k}" stroke-width="12" paint-order="stroke" stroke-linejoin="round"/>
${L('M346 391Q400 418 454 391', k, 9)}${bolt(384, 286, 1.02, '#FFD23F', `stroke="${k}" stroke-width="6" paint-order="stroke" stroke-linejoin="round"`)}
${L('M552 392C610 392 612 440 650 440C676 440 676 414 676 396', k, 11)}${plug(676, 402, 1.02, k, -90)}
<path d="${word('titan', 'ROADSIDE', { x: 400, y: 488, w: 424, a: 'm', track: 20 }).d}" fill="${k}"/>`;
} };

// 14: the globe is the plug
out[14] = { name: 'Globe Plug', color: 'Cobalt and sun', bg: '#ffffff', draw() {
  const b = '#1F3BFF', y = '#FFC400', k = '#0A1250', cx = 300, cy = 220, ev = word('archivo', 'EV', { x: cx, y: 176, w: 196, h: 92, a: 'm', track: 20 });
  const road = 'M300 372C300 452 176 430 176 486C176 536 250 536 320 536H706';
  return `${R(246, 24, 32, 92, y, 8)}${R(322, 24, 32, 92, y, 8)}
${L(road, '#fff', 58)}${L(road, k, 46)}${L(road, y, 5, 'stroke-dasharray="24 22"')}
<path d="M240 346H360L330 420H270Z" fill="${k}"/>${C(cx, cy, 153, '#fff')}${C(cx, cy, 146, b)}<defs><clipPath id="n14"><circle cx="${cx}" cy="${cy}" r="146"/></clipPath></defs>${P(continents(cx, cy, 146, [84, -14]), '#5E74FF')}<path d="${ev.d}" fill="#fff"/>
${van(440, 382, 1.28, { body: b, win: '#fff', wheel: k, hub: y, bolt: y, light: y, stroke: '#fff', sw: 3 })}
<path d="${word('archivo', 'ROADSIDE', { x: 474, y: 262, w: 300 }).d}" fill="${k}"/>${R(474, 318, 300, 10, y)}`;
} };

// 15: a solid globe cut into EV
out[15] = { name: 'Globe Monogram', color: 'Black, no color', bg: '#ffffff', draw() {
  const k = '#000', cx = 400, cy = 236, r = 192;
  return `<defs><clipPath id="o15"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><mask id="o15m" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/><rect x="286" y="148" width="140" height="38" rx="10" fill="#000"/><rect x="286" y="286" width="140" height="38" rx="10" fill="#000"/><path d="M412 167Q510 150 620 167M412 305Q510 318 620 305" fill="none" stroke="#000" stroke-width="7"/></mask></defs>
<g clip-path="url(#o15)"><g mask="url(#o15m)"><rect x="200" y="30" width="194" height="420" fill="${k}"/><path d="M412 30H474L511 290L554 30H640V450H474Z" fill="${k}"/></g></g>
${L('M556 148C572 104 600 92 640 92', k, 15)}${plug(634, 92, 1.4, k)}
${van(128, 462, .98, { body: k, win: '#fff', wheel: k, hub: '#fff', bolt: '#fff' })}<path d="${word('syncopate', 'ROADSIDE', { x: 346, y: 506, w: 326 }).d}" fill="${k}"/>${L('M128 576H672', k, 6)}`;
} };

// 16: banknote engraving
out[16] = { name: 'Engraved', color: 'One ink, bottle green', bg: '#F5F2E6', draw() {
  const g = '#0E4A35', cx = 400, cy = 252, r = 172, pr = proj(cx, cy, r, [84, -14]); let ln = '';
  const lx = -.5, ly = -.55, lz = .67;
  for (let y = cy - r + 3; y < cy + r; y += 5.2) { const hw = Math.sqrt(Math.max(0, r * r - (y - cy) ** 2)); if (hw < 4) continue; const up = [], dn = []; for (let x = cx - hw; x <= cx + hw + .1; x += 3) { const nx = (x - cx) / r, ny = (y - cy) / r, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)), lit = Math.max(0, nx * lx + ny * ly + nz * lz), g2 = pr.invert([x, y]), ld = g2 && isLand(g2[0], g2[1]); let t = ld ? 3 + (1 - lit) * 1.5 : .4 + (1 - lit) * 1.05; t = Math.min(4.5, t); const bow = 5 * (1 - nx * nx) * ny; up.push(`${f1(x)} ${f1(y + bow - t / 2)}`); dn.push(`${f1(x)} ${f1(y + bow + t / 2)}`); } ln += `M${up.join('L')}L${dn.reverse().join('L')}Z`; }
  let rope = ''; for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2; rope += `<ellipse cx="${f1(cx + 206 * Math.cos(a))}" cy="${f1(cy + 206 * Math.sin(a))}" rx="8.5" ry="3" transform="rotate(${f1(a * 180 / Math.PI + 48)} ${f1(cx + 206 * Math.cos(a))} ${f1(cy + 206 * Math.sin(a))})" fill="${g}"/>`; }
  const ev = word('slab', 'EV', { x: 400, y: 168, h: 106, a: 'm', track: 30 }), rs = word('slab', 'ROADSIDE', { x: 400, y: 436, w: 340, a: 'm', track: 60 });
  let hatch = ''; for (let i = 0; i < 30; i++) hatch += `M${i * 7} 8V88`;
  return `${C(cx, cy, 222, 'none', `stroke="${g}" stroke-width="3"`)}${rope}${C(cx, cy, 190, '#F5F2E6', `stroke="${g}" stroke-width="3"`)}<path d="${ln}" fill="${g}"/>
${extrude(ev.d, 8, .9, .9, g)}<path d="${ev.d}" fill="#F5F2E6" stroke="${g}" stroke-width="4.5" stroke-linejoin="round"/>
${L('M486 222C520 222 520 236 552 236', '#F5F2E6', 20)}${L('M492 222C522 222 522 236 566 236', g, 8)}<g transform="translate(560 236)"><path d="M0 -5H6C10 -5 11 -20 20 -20H36Q40 -20 40 -16V16Q40 20 36 20H20C11 20 10 5 6 5H0ZM44 -14h20v8h-20zM44 6h20v8h-20z" fill="${g}" stroke="#F5F2E6" stroke-width="8" paint-order="stroke"/></g>
<defs><clipPath id="p16"><path d="${VAN}"/></clipPath></defs><g transform="translate(296 300) scale(1.04)"><path d="${VAN}" fill="#F5F2E6" stroke="#F5F2E6" stroke-width="20" stroke-linejoin="round"/><path d="${VAN}" fill="#F5F2E6" stroke="${g}" stroke-width="4.5"/><g clip-path="url(#p16)"><path d="M8 56H200V90H8Z" fill="${g}"/><path d="M8 50H200" stroke="${g}" stroke-width="2"/></g><path d="${VWIN}" fill="${g}"/>${bolt(58, 14, .78, g)}${[47, 155].map(c => `<circle cx="${c}" cy="86" r="19" fill="${g}" stroke="#F5F2E6" stroke-width="3"/><circle cx="${c}" cy="86" r="9" fill="#F5F2E6"/><circle cx="${c}" cy="86" r="4" fill="${g}"/>`).join('')}</g>
<path d="M134 424H666L640 458L666 492H134L160 458Z" fill="${g}"/><path d="M152 431H648L628 458L648 485H152L172 458Z" fill="none" stroke="#F5F2E6" stroke-width="2"/><path d="${rs.d}" fill="#F5F2E6" transform="translate(0 2)"/>`;
} };

// 17: neon sign
out[17] = { name: 'Neon Sign', color: 'Cyan, pink, amber glow', bg: '#0B0714', draw() {
  const tube = (d, c, w, ex = '') => `<g fill="none" stroke-linecap="round" stroke-linejoin="round" ${ex}><path d="${d}" stroke="${c}" stroke-width="${w * 3.2}" opacity=".5" filter="url(#q17b)"/><path d="${d}" stroke="${c}" stroke-width="${w * 1.5}" filter="url(#q17s)"/><path d="${d}" stroke="${c}" stroke-width="${w}"/><path d="${d}" stroke="#fff" stroke-width="${w * .42}" opacity=".92"/></g>`;
  const cy = '#22E6FF', pk = '#FF3DA5', am = '#FFC02E';
  const arcG = 'M226 372A188 188 0 1 1 574 372';
  return `<defs><filter id="q17b" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1000" height="800"><feGaussianBlur stdDeviation="14"/></filter><filter id="q17s" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1000" height="800"><feGaussianBlur stdDeviation="4"/></filter></defs>
${tube(arcG, cy, 8)}${tube('M400 112C318 148 296 206 300 206M400 112C482 148 504 206 500 206M232 218C300 196 500 196 568 218', cy, 4)}
${tube('M358 236H296V322H358M296 279H346', pk, 12)}${tube('M390 236L430 322L470 236', pk, 12)}
${tube('M470 236C500 206 520 280 552 280H632', am, 6)}${tube('M632 256H650C660 256 664 262 664 270V290C664 298 660 304 650 304H632ZM664 268H688M664 292H688', am, 6)}
<g transform="translate(290 344) scale(1.1)">${tube(VANL, am, 6.2)}${tube('M33 86a14 14 0 1 0 28 0a14 14 0 1 0 -28 0M141 86a14 14 0 1 0 28 0a14 14 0 1 0 -28 0', am, 5.5)}${tube('M112 23H121C130 23 135 28 140 36L145 46H112Z', cy, 4)}${tube('M66 22L54 44H64L60 62L76 38H65Z', pk, 4)}</g>
${tube('M232 396H262M196 414H262M220 432H262', cy, 5)}
${tube(word('outfitM', 'ROADSIDE', { x: 400, y: 494, w: 424, a: 'm', track: 110 }).d, cy, 3.6)}`;
} };

// 18: low poly
out[18] = { name: 'Low Poly', color: 'Faceted sea and land', bg: '#ffffff', draw() {
  const t = (1 + Math.sqrt(5)) / 2, nrm = v => { const l = Math.hypot(...v); return v.map(c => c / l); };
  let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(nrm);
  let T = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]].map(f => f.map(i => V[i]));
  const mid = (a, b) => nrm(a.map((c, i) => c + b[i]));
  for (let n = 0; n < 2; n++) T = T.flatMap(([a, b, c]) => { const x = mid(a, b), y = mid(b, c), z = mid(c, a); return [[a, x, z], [b, y, x], [c, z, y], [x, y, z]]; });
  const cx = 400, cy = 240, r = 196, lon0 = -84, lat0 = 14, D = Math.PI / 180;
  const rot = ([x, y, z]) => { const a = .18; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z]; };
  const mix = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - k) + parseInt(b.slice(1 + i, 3 + i), 16) * k).toString(16).padStart(2, '0')).join('');
  let g = '';
  T.forEach(tri => { const p = tri.map(rot), c = nrm([0, 1, 2].map(i => p[0][i] + p[1][i] + p[2][i])); if (c[2] < -.02) return; const la = Math.asin(c[1]), lo = Math.atan2(c[0], c[2]); const sl = Math.sin(lat0 * D), cl = Math.cos(lat0 * D); const y2 = c[1] * cl + c[2] * sl, z2 = -c[1] * sl + c[2] * cl; const lat = Math.asin(y2) / D, lon = lon0 + Math.atan2(c[0], z2) / D; const lit = Math.max(0, Math.min(1, .5 * (c[0] * -.5 + c[1] * .62 + c[2] * .6) + .5 + (((c[0] * 91.7 + c[1] * 47.3) % 1) * .07))); const col = isLand(lon, lat) ? mix('#0F6B4A', '#8CF0A4', (lit - .3) * 1.4 > 1 ? 1 : Math.max(0, (lit - .3) * 1.4)) : mix('#0A2A6B', '#55C1FF', Math.max(0, Math.min(1, (lit - .3) * 1.4))); g += `<path d="M${p.map(q => `${f1(cx + q[0] * r)} ${f1(cy - q[1] * r)}`).join('L')}Z" fill="${col}" stroke="${col}" stroke-width=".7"/>`; });
  // chiselled EV: each bar split along its spine
  const pg = (pts, c) => `<path d="M${pts.map(p => p.join(' ')).join('L')}Z" fill="${c}"/>`;
  const H = '#FFFFFF', M2 = '#DCE6F5', S = '#AEBFDA', K = '#0A1A3F';
  const E = (x, y, w, h, b) => { const m = b / 2, o = []; o.push(pg([[x, y], [x + m, y + m], [x + m, y + h - m], [x, y + h]], H)); o.push(pg([[x + b, y + b], [x + m, y + m], [x + m, y + h - m], [x + b, y + h - b]], S)); const bar = (yy, ww, x0) => { o.push(pg([[x0, yy], [x + ww, yy], [x + ww - m, yy + m], [x + m, yy + m]], H)); o.push(pg([[x + m, yy + m], [x + ww - m, yy + m], [x + ww, yy + b], [x0 + (x0 === x ? b : 0), yy + b]], S)); o.push(pg([[x + ww, yy], [x + ww, yy + b], [x + ww - m, yy + m]], M2)); }; bar(y, w, x); bar(y + h / 2 - m, w * .86, x + b); bar(y + h - b, w, x); o.push(pg([[x, y + h], [x + m, y + h - m], [x + w - m, y + h - m], [x + w, y + h]], S)); o.push(pg([[x + b, y + h - b], [x + m, y + h - m], [x + w - m, y + h - m], [x + w, y + h - b]], H)); return o.join(''); };
  const eo = 'M250 178H366V210H286V230H350V262H286V278H366V318H250Z', vo = 'M386 178H426L462 266L498 178H538L482 318H442Z';
  const ee = E(250, 178, 116, 140, 36);
  const vv = pg([[386, 178], [406, 178], [462, 300], [442, 318]], H) + pg([[406, 178], [426, 178], [462, 266], [462, 300]], S) + pg([[538, 178], [518, 178], [462, 300], [482, 318]], S) + pg([[518, 178], [498, 178], [462, 266], [462, 300]], H) + pg([[442, 318], [462, 300], [482, 318]], M2);
  const vx = 262, vy = 344, s = 1.36, tri = (a, c) => pg(a.map(([x, y]) => [f1(vx + x * s), f1(vy + y * s)]), c);
  const vn = tri([[8, 18], [60, 10], [34, 50]], '#FFB24D') + tri([[60, 10], [34, 50], [84, 52]], '#FF9524') + tri([[60, 10], [108, 10], [84, 52]], '#FFC670') + tri([[8, 18], [34, 50], [8, 84]], '#F07F12') + tri([[34, 50], [8, 84], [48, 84]], '#D96A05') + tri([[34, 50], [84, 52], [48, 84]], '#F58A1B') + tri([[84, 52], [48, 84], [110, 84]], '#E07408') + tri([[108, 10], [84, 52], [112, 48]], '#FF9E33') + tri([[84, 52], [112, 48], [110, 84]], '#F07F12') + tri([[108, 10], [130, 16], [112, 48]], K) + tri([[130, 16], [150, 46], [112, 48]], '#23407F') + tri([[112, 48], [150, 46], [110, 84]], '#FF9524') + tri([[150, 46], [110, 84], [154, 84]], '#E07408') + tri([[150, 46], [192, 62], [154, 84]], '#FFB24D') + tri([[192, 62], [192, 84], [154, 84]], '#C95F00') + tri([[180, 58], [192, 62], [188, 70]], '#FFF3C4');
  const wh = [48, 154].map(c => { const X = vx + c * s, Y = vy + 85 * s, rr = 25; let o = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * 2 * Math.PI, b = (i + 1) / 8 * 2 * Math.PI; o += pg([[f1(X), f1(Y)], [f1(X + rr * Math.cos(a)), f1(Y + rr * Math.sin(a))], [f1(X + rr * Math.cos(b)), f1(Y + rr * Math.sin(b))]], i % 2 ? '#0A1A3F' : '#1C2F63'); } return o + C(X, Y, 8, '#fff'); }).join('');
  const body = 'M8 18L60 10H130L150 46L192 62V84H8Z';
  return `${g}<path d="${eo}${vo}" fill="${K}" stroke="${K}" stroke-width="16" stroke-linejoin="round"/>${ee}${vv}
${L('M512 236H580', K, 18)}${L('M512 236H584', '#FFB24D', 8)}<path d="M580 226L592 208H616V264H592L580 246Z" fill="#FF9524" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M580 226L592 208H616L598 236Z" fill="#FFC670"/><path d="M620 216h24v11h-24zM620 245h24v11h-24z" fill="${K}"/>
<g transform="translate(${vx} ${vy}) scale(${s})"><path d="${body}" fill="#fff" stroke="#fff" stroke-width="14" stroke-linejoin="round"/></g>${[48, 154].map(c => C(vx + c * s, vy + 85 * s, 34, '#fff')).join('')}${vn}${bolt(vx + 48, vy + 24, 1.35, '#fff')}${wh}
<path d="${word('russo', 'ROADSIDE', { x: 400, y: 512, w: 420, a: 'm', track: 60 }).d}" fill="${K}"/>`;
} };

// 19: app icon, earthrise
out[19] = { name: 'Earthrise Icon', color: 'Dusk gradient', bg: '#ffffff', draw() {
  const sq = 'M300 20H500C596 20 640 64 640 160V360C640 456 596 500 500 500H300C204 500 160 456 160 360V160C160 64 204 20 300 20Z', ev = word('sora', 'EV', { x: 382, y: 64, w: 254, a: 'm', track: -20 });
  return `<defs><linearGradient id="s19" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B0F54"/><stop offset=".45" stop-color="#C2347A"/><stop offset=".72" stop-color="#FF8A4C"/></linearGradient><linearGradient id="s19b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1CA7EC"/><stop offset=".5" stop-color="#0B3C8C"/></linearGradient><clipPath id="s19c"><path d="${sq}"/></clipPath></defs><g clip-path="url(#s19c)"><rect x="150" y="10" width="500" height="500" fill="url(#s19)"/>${C(400, 300, 118, '#FFD27A', 'opacity=".55"')}<path d="${ev.d}" fill="#fff"/>
${C(400, 640, 326, '#fff', 'opacity=".28"')}${C(400, 640, 312, 'url(#s19b)')}${P(continents(400, 640, 312, [86, -52], .012, .002), '#39C6A0')}<path d="M88 640A312 312 0 0 1 712 640" fill="none" stroke="#0E1B3D" stroke-width="20"/>
${L('M584 10V78C584 108 566 112 566 140V150', '#fff', 8)}${plug(566, 144, 1.05, '#fff', 90)}</g>
${van(286, 226, 1.14, { body: '#0E1B3D', win: '#FFD27A', wheel: '#0E1B3D', hub: '#FFD27A', bolt: '#FFD27A', light: '#FFD27A' })}
<path d="${word('sora', 'ROADSIDE', { x: 400, y: 532, w: 400, a: 'm', track: 50 }).d}" fill="#2B0F54"/>`;
} };

// 20: one road spells ev
out[20] = { name: 'Road Script', color: 'Asphalt and yellow', bg: '#FFD400', draw() {
  const k = '#17181A', d = 'M96 250H348C348 150 300 92 222 92C140 92 88 162 88 246C88 336 148 400 232 400C290 400 330 380 360 344', d2 = 'M456 92L552 396L648 92';
  return `<defs><clipPath id="t20"><rect x="120" y="90" width="210" height="130"/></clipPath></defs><g clip-path="url(#t20)">${C(222, 222, 100, '#1769E0')}${P(continents(222, 222, 100, [88, -36]), '#37C871')}</g>${L(d, k, 78)}${L(d2, k, 78)}<path d="${d}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="30 24"/><path d="${d2}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="30 24"/>
${L('M648 92C660 40 700 34 700 -4', k, 16)}${plug(700, 4, 1.5, k, -90)}
<g transform="translate(404 60) rotate(0)"></g>${van(96, 154, 0, { body: '#fff', win: k, wheel: k, hub: '#fff' })}
<g transform="translate(560 250)"></g><path d="${word('barlowI', 'ROADSIDE', { x: 52, y: 474, w: 420 }).d}" fill="${k}"/>${van(506, 460, .98, { body: '#fff', win: k, wheel: k, hub: '#FFD400', bolt: k, light: '#FFD400', stroke: k, sw: 6 })}${[[478, 0], [0, 0]].length ? '' : ''}`;
} };
module.exports = out;

const { word, arc, continents, grid, isLand, bolt, BOLT, van, VAN, VWIN, VANL, plug, cloud, P, L, C, R, extrude, proj } = require('./lib');
const out = {};

// 1: the sketch, finished
out[1] = { name: 'The Sketch, Finished', color: 'Full color', bg: '#ffffff', draw() {
  const cx = 236, cy = 300, r = 206, ev = word('archivo', 'EV', { x: 92, y: 190, w: 218, h: 116, track: 30 });
  return `<defs><radialGradient id="a1" cx=".36" cy=".28" r=".85"><stop offset="0" stop-color="#4FB6F2"/><stop offset=".6" stop-color="#1B78D6"/><stop offset="1" stop-color="#0C4596"/></radialGradient><clipPath id="a1c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
${C(cx, cy, r + 13, '#0B2545')}${C(cx, cy, r + 5, '#fff')}${C(cx, cy, r, 'url(#a1)')}<g clip-path="url(#a1c)">${P(continents(cx, cy, r, [88, -14]), '#43C46B')}<path d="M0 446H500V560H0Z" fill="#0B2545"/><path d="M60 474H440" stroke="#FFD23F" stroke-width="5" stroke-dasharray="26 18"/></g>
${cloud(206, 122, 1, '#fff')}${cloud(344, 322, .6, '#fff', .95)}
${L('M296 250H368', '#0B2545', 18)}${L('M296 250H368', '#FFD23F', 8)}${plug(360, 250, 1.06, '#FFD23F', 0, '#fff')}
${extrude(ev.d, 9, .9, 1, '#0B2545')}<path d="${ev.d}" fill="#fff" stroke="#0B2545" stroke-width="5" stroke-linejoin="round"/>
${[[92, 366, 62], [68, 388, 92], [96, 410, 52]].map(([x, y, w]) => L(`M${x} ${y}h${w}`, '#fff', 7)).join('')}
${van(170, 338, 1.06, { body: '#fff', win: '#0B2545', wheel: '#0B2545', hub: '#fff', bolt: '#FFB800', light: '#FFD23F', stroke: '#0B2545', sw: 5 })}
<path d="${word('kanit', 'ROADSIDE', { x: 478, y: 250, w: 294 }).d}" fill="#0B2545"/>${[[478, 326, 282, '#1B78D6'], [478, 348, 206, '#43C46B'], [478, 370, 130, '#FFB800']].map(([x, y, w, c]) => R(x, y, w, 9, c, 4.5)).join('')}`;
} };

// 2: service-station roundel
out[2] = { name: 'Service Station', color: 'Red, cream, blue', bg: '#F7F3EA', draw() {
  const cx = 400, cy = 296; let rays = '';
  for (let i = 0; i < 24; i++) { const a = (i * 15 - 3.75) * Math.PI / 180, b = (i * 15 + 3.75) * Math.PI / 180; rays += `M${cx} 330L${(cx + 260 * Math.cos(a)).toFixed(1)} ${(330 + 260 * Math.sin(a)).toFixed(1)}L${(cx + 260 * Math.cos(b)).toFixed(1)} ${(330 + 260 * Math.sin(b)).toFixed(1)}Z`; }
  const sc = word('yellowtail', 'Roadside', { x: 400, y: 318, w: 430, a: 'm' });
  const front = `<g transform="translate(400 246)"><path d="M-76 66H-46V86Q-46 92-52 92H-70Q-76 92-76 86ZM76 66H46V86Q46 92 52 92H70Q76 92 76 86Z" fill="#1D1B1A"/><path d="M-80 -34H-98Q-104 -34-104 -28V-6Q-104 0-98 0H-80ZM80 -34H98Q104 -34 104 -28V-6Q104 0 98 0H80Z" fill="#C8202F"/><path d="M-64 -70Q-61 -84-46 -84H46Q61 -84 64 -70L82 0V62Q82 72 72 72H-72Q-82 72-82 62V0Z" fill="#C8202F"/><path d="M-50 -68H50L64 -10Q0 4-64 -10Z" fill="#F7F3EA"/><path d="M-82 12H82V32H-82Z" fill="#F7F3EA"/>${bolt(-11, 2, .85, '#C8202F')}<circle cx="-57" cy="22" r="16" fill="#1D1B1A"/><circle cx="57" cy="22" r="16" fill="#1D1B1A"/><circle cx="-57" cy="22" r="10.5" fill="#FFD15C"/><circle cx="57" cy="22" r="10.5" fill="#FFD15C"/></g>`;
  return `${C(cx, cy, 252, '#1D1B1A')}${C(cx, cy, 244, '#F7F3EA')}${C(cx, cy, 234, '#C8202F')}${C(cx, cy, 170, '#F7F3EA')}<defs><clipPath id="b2"><circle cx="${cx}" cy="${cy}" r="162"/></clipPath></defs><g clip-path="url(#b2)"><rect x="200" y="100" width="400" height="400" fill="#2C6E8F"/><path d="${rays}" fill="#3B86AB"/>${C(400, 340, 134, '#F2E2B8')}${P(continents(400, 340, 134, [60, -22]), '#D9A441')}<rect x="200" y="338" width="400" height="200" fill="#1D1B1A"/></g>
${front}${arc('slab', 'EV', { cx, cy, r: 180, mid: -90, size: 60, track: 16, fill: '#F7F3EA' })}${plug(318, 116, .84, '#F7F3EA', 158)}<g transform="translate(800 0) scale(-1 1)">${plug(318, 116, .84, '#F7F3EA', 158)}</g>
<path d="${sc.d}" fill="none" stroke="#1D1B1A" stroke-width="30" stroke-linejoin="round"/><path d="${sc.d}" fill="none" stroke="#F7F3EA" stroke-width="13" stroke-linejoin="round"/><path d="${sc.d}" fill="#C8202F"/>
${arc('barlow', 'FOR EVERYONE', { cx, cy, r: 219, mid: 90, size: 34, track: 8, inward: true, fill: '#F7F3EA' })}`;
} };

// 3: one line
out[3] = { name: 'One Line', color: 'Black, no color', bg: '#ffffff', draw() {
  const k = '#111', w = 9;
  return `${L('M284 424A170 170 0 1 1 516 424', k, w)}<g fill="none" stroke="${k}" stroke-width="3.2" stroke-linecap="round"><path d="M400 130C334 158 312 196 306 222M400 130C466 158 488 196 494 222M249 219C320 190 480 190 551 219"/></g>

${L('M352 250H292V332H352M292 291H342M380 250L418 332L456 250', k, 15)}
${L('M456 250C488 214 516 326 560 292C582 276 594 282 618 282', k, w)}${plug(612, 282, 1.15, k)}
<g transform="translate(298 352) scale(1.04)"><path d="M33 86H16Q8 86 8 78V26Q8 10 24 10H110C132 10 141 18 150 33L158 46C176 49 190 54 193 68V79Q193 86 186 86H173" fill="#fff"/>${L(VANL, k, w / 1.04)}${L('M33 86a14 14 0 1 0 28 0a14 14 0 1 0 -28 0M141 86a14 14 0 1 0 28 0a14 14 0 1 0 -28 0', k, w / 1.04)}${L('M112 23H121C130 23 135 28 140 36L145 46H112Z', k, 6)}${bolt(50, 24, .95, k)}</g>
${L('M166 456H318M366 456H432M478 456H634', k, w)}<path d="${word('outfitM', 'ROADSIDE', { x: 400, y: 506, w: 330, a: 'm', track: 210 }).d}" fill="${k}"/>`;
} };

// 4: negative-space plug makes the E
out[4] = { name: 'Hidden Plug', color: 'Black, no color', bg: '#ffffff', draw() {
  const k = '#0A0A0A';
  return `<defs><mask id="d4" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/><rect x="334" y="146" width="80" height="128" rx="12" fill="#000"/><rect x="250" y="160" width="92" height="36" rx="9" fill="#000"/><rect x="250" y="224" width="92" height="36" rx="9" fill="#000"/><path d="M400 210H452C484 210 490 158 532 158" stroke="#000" stroke-width="16" fill="none"/></mask></defs>
<g mask="url(#d4)"><path d="M190 92H404V328H190Z" fill="${k}"/><path d="M426 92H500L541 236L582 92H656L582 328H500Z" fill="${k}"/></g>
${C(541, 130, 39, '#fff')}${C(541, 130, 32, k)}<path d="${grid(541, 130, 32, [.5], [0, .5])}" fill="none" stroke="#fff" stroke-width="3.6"/>
<rect x="190" y="352" width="466" height="104" fill="${k}"/><g transform="translate(456 359) scale(.88)"><path d="${VAN}" fill="#fff"/><path d="${VWIN}" fill="${k}"/><path d="${BOLT}" transform="translate(50 22)" fill="${k}"/><circle cx="47" cy="86" r="15" fill="#fff"/><circle cx="155" cy="86" r="15" fill="#fff"/></g><path d="${word('archivo', 'ROADSIDE', { x: 212, y: 387, w: 226 }).d}" fill="#fff"/>`;
} };

// 5: the van is the logo
out[5] = { name: 'The Van Is the Logo', color: 'Volt lime on charcoal', bg: '#15181C', draw() {
  const g = '#C6FF3D', k = '#15181C', s = 2.75, x = 158, y = 92, wy = y + 86 * s, wx = [47, 155].map(c => x + c * s), ev = word('russo', 'EV', { x: 196, y: 142, w: 246, h: 108, track: 70 });
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${VAN}" fill="${g}"/><path d="${VWIN}" fill="${k}"/><path d="M177 58L188 62Q190.5 66 190 70H181Z" fill="${k}"/></g><path d="${ev.d}" fill="${k}"/>
${wx.map((c, i) => `${C(c, wy, 53, g)}${C(c, wy, 45, k)}${P(continents(c, wy, 45, i ? [-20, -12] : [90, -14], .03, .006), g)}`).join('')}
${L('M182 262C112 262 140 366 106 366', g, 9)}${plug(112, 366, 1, g, 180)}
${[[56, 150, 92], [88, 180, 60], [40, 210, 108]].map(([a, b, w]) => R(a, b, w, 9, g, 4.5)).join('')}
<path d="${word('russo', 'ROADSIDE', { x: 400, y: 440, w: 500, a: 'm', track: 110 }).d}" fill="#fff"/>`;
} };

// 6: orbit lockup
out[6] = { name: 'In Orbit', color: 'Teal to blue, navy', bg: '#ffffff', draw() {
  const cx = 222, cy = 318, r = 118, n = '#0A1F44';
  return `<defs><linearGradient id="f6" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16D3B4"/><stop offset="1" stop-color="#0B63E5"/></linearGradient><mask id="f6m" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/><path d="M98 372C30 412 110 438 202 402C300 364 362 298 376 246" stroke="#000" stroke-width="40" fill="none"/></mask></defs>
<g mask="url(#f6m)">${C(cx, cy, r, 'url(#f6)')}${P(continents(cx, cy, r - 1, [92, -16]), '#fff')}${C(cx, cy, r - 2, 'none', 'stroke="url(#f6)" stroke-width="5"')}</g>
<path d="M100 356C10 408 92 440 202 404C310 368 372 294 384 228C352 300 286 350 206 380C118 412 74 396 100 356Z" fill="${n}"/>${plug(379, 240, .78, n, -74)}
<g transform="translate(${cx} ${cy}) rotate(-16)"><g transform="translate(-66 -${r + 69}) scale(.66)"><path d="${VAN}" fill="${n}" stroke="#fff" stroke-width="5" paint-order="stroke"/><path d="${VWIN}" fill="#16D3B4"/>${bolt(52, 22, 1, '#16D3B4')}${[47, 155].map(c => `<circle cx="${c}" cy="86" r="19" fill="${n}" stroke="#fff" stroke-width="4"/><circle cx="${c}" cy="86" r="6" fill="#fff"/>`).join('')}</g></g>
<path d="${word('sora', 'EV', { x: 448, y: 208, h: 112, track: -10 }).d}" fill="${n}"/><path d="${word('sora', 'ROADSIDE', { x: 450, y: 346, w: 306, track: 30 }).d}" fill="url(#f6)"/>`;
} };

// 7: map pin that plugs in
out[7] = { name: 'Pin and Plug', color: 'Safety orange, navy', bg: '#ffffff', draw() {
  const o = '#FF5A1F', n = '#14213D', cx = 400, cy = 186;
  return `<ellipse cx="400" cy="466" rx="78" ry="11" fill="${n}" opacity=".14"/>
<path d="M400 32A154 154 0 0 1 554 186C554 258 492 306 440 366H446Q458 366 458 378V410Q458 422 446 422H354Q342 422 342 410V378Q342 366 354 366H360C308 306 246 258 246 186A154 154 0 0 1 400 32Z" fill="${o}"/>${R(364, 428, 20, 42, n, 5)}${R(416, 428, 20, 42, n, 5)}
${C(cx, cy, 122, '#fff')}<defs><clipPath id="g7"><circle cx="${cx}" cy="${cy}" r="122"/></clipPath></defs><g clip-path="url(#g7)"><path d="${grid(cx, cy, 122, [.42, .8], [0, .52])}" fill="none" stroke="#CBD5E8" stroke-width="5"/><rect x="260" y="254" width="280" height="90" fill="${n}"/><path d="M292 276H520" stroke="#fff" stroke-width="5" stroke-dasharray="20 14"/></g>
<path d="${word('rubik', 'EV', { x: 400, y: 92, h: 62, a: 'm', track: 20 }).d}" fill="${n}" stroke="#fff" stroke-width="16" paint-order="stroke" stroke-linejoin="round"/>
${van(306, 163, .96, { body: o, win: '#fff', wheel: n, hub: '#fff', bolt: '#fff', stroke: '#fff', sw: 8 })}
${bolt(382, 344, 1.4, '#fff')}<path d="${word('rubik', 'ROADSIDE', { x: 400, y: 504, w: 340, a: 'm', track: 40 }).d}" fill="${n}"/>`;
} };

// 8: highway shield
out[8] = { name: 'Highway Shield', color: 'Navy, gold, sky', bg: '#F4F6F8', draw() {
  const n = '#0F2A4A', y = '#F5B82E', sh = 'M400 46C436 70 486 78 534 62Q556 92 552 128C548 168 584 208 584 276C584 384 492 452 400 492C308 452 216 384 216 276C216 208 252 168 248 128Q244 92 266 62C314 78 364 70 400 46Z', ev = word('shoulders', 'EV', { x: 400, y: 96, h: 88, a: 'm', track: 40 });
  return `<path d="${sh}" fill="${n}" stroke="${n}" stroke-width="22" stroke-linejoin="round"/><path d="${sh}" fill="${y}" stroke="${y}" stroke-width="8" stroke-linejoin="round"/><defs><clipPath id="h8"><path d="${sh}" transform="translate(400 270) scale(.955) translate(-400 -270)"/></clipPath></defs><g clip-path="url(#h8)"><rect x="180" y="20" width="440" height="500" fill="${n}"/><rect x="180" y="204" width="440" height="330" fill="#2F7FD0"/>${C(400, 372, 138, '#5AA4EA')}${P(continents(400, 372, 138, [86, -26]), '#A9D6FA')}<rect x="180" y="344" width="440" height="200" fill="${n}"/><path d="M196 364H620" stroke="${y}" stroke-width="5" stroke-dasharray="24 17"/><rect x="180" y="200" width="440" height="9" fill="${y}"/></g>
<path d="${ev.d}" fill="#fff"/>${plug(330, 140, .86, y, 180)}<g transform="translate(800 0) scale(-1 1)">${plug(330, 140, .86, y, 180)}</g>
${van(294, 239, 1.08, { body: '#fff', win: n, wheel: n, hub: y, bolt: y, light: y, stroke: n, sw: 6 })}
<path d="M168 376H632L606 410L632 444H168L194 410Z" fill="${n}"/><path d="M190 385H610L591 410L610 435H190L209 410Z" fill="#fff"/><path d="${word('shoulders', 'ROADSIDE', { x: 400, y: 393, h: 34, a: 'm', track: 130 }).d}" fill="${n}"/>`;
} };

// 9: halftone globe, sliced type
out[9] = { name: 'Halftone Speed', color: 'Red and black', bg: '#ffffff', draw() {
  const cx = 510, cy = 246, r = 204, st = 11.4, pr = proj(cx, cy, r, [86, -16]); let dots = '';
  for (let j = -22; j <= 22; j++) for (let i = -19; i <= 19; i++) { const x = cx + i * st + (j & 1 ? st / 2 : 0), y = cy + j * st * .87, d = Math.hypot(x - cx, y - cy); if (d > r - 2) continue; const g = pr.invert([x, y]); if (!g) continue; const sh = .55 + .45 * ((x - cx) / r * .6 - (y - cy) / r * .3); dots += isLand(g[0], g[1]) ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4 + 1.2 * sh).toFixed(2)}" fill="#FF3B30"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.1 + .5 * sh).toFixed(2)}" fill="#9a9a9a"/>`; }
  const ev = word('kanit', 'EV', { x: 110, y: 116, h: 200, track: -20 });
  return `${dots}<path d="${ev.d}" fill="none" stroke="#fff" stroke-width="28" stroke-linejoin="round"/><defs><mask id="i9" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/><path d="M0 166H236V178H0ZM0 206H214V218H0ZM0 246H232V258H0Z" fill="#000"/></mask></defs><path d="${ev.d}" fill="#111" mask="url(#i9)"/>
${[[54, 166, 182], [30, 206, 184], [66, 246, 166]].map(([x, y, w]) => R(x, y, w, 12, '#FF3B30')).join('')}
<g transform="translate(436 326) scale(1.24)"><path d="${VAN}" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/><circle cx="47" cy="86" r="26" fill="#fff"/><circle cx="155" cy="86" r="26" fill="#fff"/></g>${van(436, 326, 1.24, { body: '#111', win: '#fff', wheel: '#111', hub: '#FF3B30', bolt: '#FF3B30', light: '#FF3B30' })}
${L('M446 412H404C366 412 378 376 340 376H326', '#111', 8)}${plug(334, 376, .95, '#111', 180)}
<path d="${word('kanit', 'ROADSIDE', { x: 100, y: 474, w: 604 }).d}" fill="#111"/>`;
} };

// 10: wordmark road
out[10] = { name: 'Wordmark Road', color: 'Green and ink', bg: '#ffffff', draw() {
  const k = '#101820', g = '#00A86B', y = 250, h = 92, parts = []; let x = 70;
  const add = (s, gap = 11) => { const w = word('outfit', s, { x, y, h }); parts.push(`<path d="${w.d}" fill="${k}"/>`); x += w.w + gap; };
  add('R'); const ox = x + 47; x += 100; add('A', 6); add('D'); add('S', 12); const ix = x + 20; x += 53; add('D', 13); add('E', 0); const end = x;
  return `<g transform="translate(${400 - (70 + end) / 2} 0)">${parts.join('')}${C(ox, y + 46, 47, g)}<defs><clipPath id="j10"><circle cx="${ox}" cy="${y + 46}" r="47"/></clipPath></defs><g clip-path="url(#j10)">${P(continents(ox, y + 46, 47, [88, -12], .03, .006), '#fff')}</g>
${R(ix - 16, y - 18, 9, 26, g, 2.5)}${R(ix + 7, y - 18, 9, 26, g, 2.5)}<path d="M${ix - 21} ${y + 10}H${ix + 21}V${y + 48}Q${ix + 21} ${y + 64} ${ix + 8} ${y + 69}V${y + h}H${ix - 8}V${y + 69}Q${ix - 21} ${y + 64} ${ix - 21} ${y + 48}Z" fill="${g}"/>
${L(`M${ix} ${y + h - 4}V${y + h + 12}Q${ix} ${y + h + 32} ${ix - 20} ${y + h + 32}H76`, g, 11)}${L(`M${ix + 34} ${y + h + 32}H${end - 5}`, k, 11, 'stroke-dasharray="24 24"')}
<path d="${word('outfit', 'EV', { x: 70, y: 124, h: 92, track: 20 }).d}" fill="${k}"/>${van(end - 200, 111, 1.02, { body: k, win: '#fff', wheel: k, hub: '#fff', bolt: g, light: g })}${[[150, 132], [194, 176], [116, 98]].map(([a, w], i) => R(end - 200 - a, 140 + i * 21, w, 8, g, 4)).join('')}</g>`;
} };
module.exports = out;

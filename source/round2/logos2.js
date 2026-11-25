const { word, arc, I, ih, lin, rad, US, sweep, ell, bell, vvan, BODY, ROOFLINE, VGLASS, bolt, BOLT, plugV, cable, shadow, softDef, land, f1, L1 } = require('./kit');
const EXO = 'exo-2:900-italic', EXO8 = 'exo-2:800-italic', SAI = 'saira:800-italic', SAI7 = 'saira:700-normal', SAI6 = 'saira:600-normal', MON = 'montserrat:800-normal', MONI = 'montserrat:800-italic', ENC = 'encode-sans-expanded:800-normal', TIT = 'titillium-web:900-normal', KRO = 'krona-one:400-normal', MIC = 'michroma:400-normal', RED = 'red-hat-display:900-normal', OUT = 'outfit:800-normal';
const W = (f, s, o, fill, ex = '') => `<path d="${word(f, s, o).d}" fill="${fill}" ${ex}/>`;
const pair = (f, y, tw, c1, c2, gap = .22, cx = 800) => { const a = word(f, 'EV', { x: 0, y, h: 100, track: 10 }), b = word(f, 'JUMPSTART', { x: 0, y, h: 100, track: 14 }), s = tw / (a.w + b.w + gap * 100), x = cx - tw / 2; return W(f, 'EV', { x, y, h: 100 * s, track: 10 }, c1) + W(f, 'JUMPSTART', { x: x + (a.w + gap * 100) * s, y, h: 100 * s, track: 14 }, c2); };
const out = {};

// 1: the #6 direction, taken all the way
out[1] = { name: 'Orbit Pro', from: 6, render: true, draw(p) {
  const cx = 430, cy = 560, r = 290, E = [cx, cy + 46, 420, 128, -17];
  return `<defs>${softDef}${lin('a1', [[0, p.green], [.45, p.sky], [1, p.deep]], 60, 0, 840, 0, US)}${lin('a1b', [[0, p.deep], [1, p.sky]], 120, 0, 820, 0, US)}${lin('a1t', [[0, p.deep], [1, p.blue]], 0, 0, 1, 0)}${lin('a1j', [[0, p.blue], [.5, p.sky], [1, p.green]])}<clipPath id="a1k"><path d="M0 0H1600V${cy - 60}L0 ${cy + 230}Z"/></clipPath></defs>
<path d="${sweep(...E, -178, -14, bell(30, .5, .6))}" fill="url(#a1b)" opacity=".9"/>
${I(p, 'globe_gloss', cx - r, cy - r, r * 2)}
<path d="${sweep(...E, 190, -8, t => 13 + 60 * Math.pow(Math.sin(Math.PI * t), 1.1) * (1 - .25 * t))}" fill="url(#a1)"/>
${(() => { const e = ell(...E, -14); return plugV(e.x - 4, e.y + 14, .82, -60, p.ink, p.gray ? '#8d9299' : '#9FB0C6', p.lime); })()}
${I(p, 'van_q_white', 208, 556, 540)}
${W(EXO, 'EV', { x: 900, y: 372, h: 220, track: 10 }, 'url(#a1t)')}${W(SAI, 'JUMPSTART', { x: 884, y: 634, w: 612, track: 20 }, 'url(#a1j)')}${bolt(1318, 372, 1.31, 'url(#a1j)')}`;
} };

// 2: the #1 direction, taken all the way
out[2] = { name: 'Globe Emblem', from: 1, render: true, draw(p) {
  const cx = 800, cy = 500, r = 400;
  return `<defs>${softDef}${lin('b2r', [[0, p.lime], [.5, p.sky], [1, p.deep]], 400, 100, 1200, 900, US)}${lin('b2j', [[0, p.deep], [.55, p.blue], [1, p.green]])}${lin('b2s', [[0, '#000', 0], [1, p.gray ? '#0a0b0c' : '#010a22', .72]], 0, 0, 0, 1)}<clipPath id="b2c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
<circle cx="${cx}" cy="${cy}" r="${r + 22}" fill="none" stroke="url(#b2r)" stroke-width="14"/>${I(p, 'globe_gloss', cx - r, cy - r, r * 2)}<g clip-path="url(#b2c)"><rect x="300" y="520" width="1000" height="400" fill="url(#b2s)"/></g>
<g style="filter:drop-shadow(0 14px 18px rgba(0,8,30,.55))">${I(p, 'ev_chrome_i', 520, 176, 560)}</g>
${cable('M1030 340C1096 340 1100 410 1160 410', 22, p)}${I(p, 'plug', 1140, 338, 300)}
${shadow(800, 940, 360, 30, .34)}${I(p, 'van_q_white', 440, 522, 720)}
${W(SAI, 'JUMPSTART', { x: 800, y: 1010, w: 900, a: 'm', track: 30 }, 'url(#b2j)')}`;
} };

// 3: flat vector orbit for everyday use
out[3] = { name: 'Orbit Vector', from: 6, draw(p) {
  const cx = 420, cy = 540, r = 250, E = [cx, cy + 40, 372, 116, -20];
  return `<defs>${rad('c3', [[0, p.sky], [.55, p.blue], [1, p.deep]])}${lin('c3l', [[0, p.lime], [1, p.green]], 0, 0, 1, 1)}${lin('c3s', [[0, p.green], [.5, p.sky], [1, p.deep]], 60, 0, 780, 0, US)}<clipPath id="c3c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><mask id="c3m" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1200"><rect width="1600" height="1200" fill="#fff"/><path d="${sweep(...E, 196, -10, t => 38 + 66 * Math.pow(Math.sin(Math.PI * t), 1.1) * (1 - .25 * t))}" fill="#000"/></mask></defs>
<g mask="url(#c3m)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#c3)"/><g clip-path="url(#c3c)"><path d="${land(cx, cy, r, [84, -16], .01)}" fill="url(#c3l)"/><ellipse cx="${cx - 70}" cy="${cy - 130}" rx="170" ry="100" fill="#fff" opacity=".13" transform="rotate(-28 ${cx - 70} ${cy - 130})"/></g></g>
<path d="${sweep(...E, 190, -8, t => 12 + 54 * Math.pow(Math.sin(Math.PI * t), 1.1) * (1 - .25 * t))}" fill="url(#c3s)"/>${(() => { const e = ell(...E, -13); return plugV(e.x - 4, e.y + 14, .72, -62, p.deep, p.deep, p.lime); })()}
<g transform="rotate(-9 420 760)">${vvan(236, 566, .78, p, { halo: p.paper, hw: 20 })}</g>
${W(MON, 'EV', { x: 870, y: 384, h: 196, track: 0 }, p.deep)}${W(MON, 'JUMPSTART', { x: 870, y: 622, w: 600, track: 30 }, p.green)}`;
} };

// 4: roofline signature
out[4] = { name: 'Roofline', from: 6, draw(p) {
  const s = 2.1, x = 270, y = 250;
  return `<defs>${lin('d4', [[0, p.green], [.4, p.sky], [.75, p.blue], [1, p.deep]], 0, 0, 513, 0, US)}${lin('d4g', [[0, p.lime], [.5, p.sky], [1, p.deep]], 500, 180, 1100, 700, US)}</defs>
<g fill="none" stroke="url(#d4g)" stroke-width="3.2" opacity=".55"><circle cx="800" cy="470" r="300"/>${[.36, .72].map(m => `<ellipse cx="800" cy="470" rx="${300 * m}" ry="300"/>`).join('')}<path d="M800 170V770M500 470H1100M540 320H1060M540 620H1060"/></g>
<g transform="translate(${x} ${y}) scale(${s})"><path d="${BODY}" fill="${p.paper}"/><circle cx="98" cy="162.500" r="44" fill="${p.paper}"/><circle cx="414" cy="162.500" r="44" fill="${p.paper}"/></g>
<path d="${ROOFLINE}C515 158 510 171 494 171M0 105V150Q0 171 18 171H46" transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="url(#d4)" stroke-width="10.500" stroke-linecap="round" vector-effect="none"/>
<g transform="translate(${x} ${y}) scale(${s})"><path d="${VGLASS}" fill="${p.ink}"/><path d="M-60 171H46M150 171H366M462 171H494" stroke="${p.ink}" stroke-width="6" stroke-linecap="round"/><path d="M50 170A48 48 0 0 1 146 170M366 170A48 48 0 0 1 462 170" fill="none" stroke="${p.ink}" stroke-width="6" stroke-linecap="round"/>${[98, 414].map(c => `<circle cx="${c}" cy="165" r="33" fill="none" stroke="${p.ink}" stroke-width="9"/><circle cx="${c}" cy="165" r="9" fill="${p.green}"/>`).join('')}<path d="M462 113H503" stroke="${p.sky}" stroke-width="6" stroke-linecap="round"/><path d="M-60 171C-110 171 -96 118 -140 118" fill="none" stroke="${p.green}" stroke-width="6" stroke-linecap="round"/></g>${plugV(-12 + 4, 498, .62, 180, p.green)}
${bolt(440, 372, .78, p.green)}
${pair(EXO, 806, 1200, p.blue, p.ink)}`;
} };

// 5: globe built out of speed
out[5] = { name: 'Velocity Globe', from: 6, draw(p) {
  const cx = 480, cy = 500, r = 300; let bars = ''; const n = 13;
  for (let i = 0; i < n; i++) { const y0 = cy - r + i * 2 * r / n + 5, y1 = cy - r + (i + 1) * 2 * r / n - 5, ym = (y0 + y1) / 2, hw = Math.sqrt(r * r - (ym - cy) ** 2), xl = cx - hw * .55 - (i % 3 === 0 ? 70 : i % 3 === 1 ? 10 : 130) * (hw / r), xr = cx + hw, e = Math.min(10, hw * .1); const h0 = Math.sqrt(Math.max(0, r * r - (y0 - cy) ** 2)), h1 = Math.sqrt(Math.max(0, r * r - (y1 - cy) ** 2)); bars += `M${f1(xl - 60)} ${f1(ym)}L${f1(xl + 60)} ${f1(y0)}H${f1(cx + h0)}Q${f1(cx + Math.max(h0, h1) + e * .6)} ${f1(ym)} ${f1(cx + h1)} ${f1(y1)}H${f1(xl + 60)}Z`; }
  return `<defs>${lin('e5', [[0, p.lime], [.3, p.green], [.62, p.sky], [1, p.deep]], 130, 250, 800, 760, US)}<clipPath id="e5c"><path d="${bars}"/></clipPath><clipPath id="e5d"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
<path d="${bars}" fill="url(#e5)"/><g clip-path="url(#e5c)"><g clip-path="url(#e5d)"><path d="${land(cx, cy, r, [98, -14], .012)}" fill="${p.paper}" opacity=".93"/></g></g>
${vvan(352, 586, 1.02, p, { halo: p.paper, hw: 22 })}
${W(SAI, 'EV', { x: 900, y: 338, h: 210, track: 10 }, p.deep)}${W(SAI, 'JUMPSTART', { x: 878, y: 594, w: 620, track: 18 }, p.green)}
<path d="M884 706H1300" stroke="${p.deep}" stroke-width="9" stroke-linecap="round"/><path d="M1300 706H1340" stroke="${p.deep}" stroke-width="9"/>${plugV(1330, 706, .62, 0, p.deep, p.deep, p.lime)}`;
} };

// 6: hood badge
out[6] = { name: 'Chrome Badge', from: 1, render: true, draw(p) {
  const cx = 800, cy = 560, chrome = [[0, '#F8FBFF'], [.22, '#A9B4C4'], [.42, '#FFFFFF'], [.52, '#566274'], [.7, '#C9D2DE'], [.86, '#F6F9FD'], [1, '#7B8798']], cg = chrome.map(([o, c]) => [o, p.gray ? '#' + Array(3).fill(Math.round(parseInt(c.slice(1, 3), 16) * .3 + parseInt(c.slice(3, 5), 16) * .59 + parseInt(c.slice(5), 16) * .11).toString(16).padStart(2, '0')).join('') : c]);
  return `<defs>${lin('f6', cg, 0, 0, .35, 1)}${lin('f6b', cg.slice().reverse().map(([o, c]) => [1 - o, c]), 0, 0, .35, 1)}${rad('f6e', [[0, p.gray ? '#5a6068' : '#1566E8'], [.6, p.gray ? '#2b2e33' : '#052C78'], [1, p.gray ? '#141619' : '#020E2C']], .4, .25, .9)}${rad('f6n', [[0, p.gray ? '#8d939b' : '#25C777'], [.7, p.gray ? '#6a7077' : '#0A8F4C'], [1, p.gray ? '#4a4f55' : '#06552F']], .4, .2, 1)}${lin('f6h', [[0, '#fff', .42], [1, '#fff', 0]], 0, 0, 0, 1)}<clipPath id="f6c"><circle cx="${cx}" cy="${cy}" r="330"/></clipPath></defs>
<circle cx="${cx}" cy="${cy}" r="500" fill="url(#f6)"/><circle cx="${cx}" cy="${cy}" r="484" fill="url(#f6b)"/><circle cx="${cx}" cy="${cy}" r="468" fill="url(#f6n)"/><circle cx="${cx}" cy="${cy}" r="364" fill="url(#f6)"/><circle cx="${cx}" cy="${cy}" r="346" fill="url(#f6b)"/><circle cx="${cx}" cy="${cy}" r="332" fill="url(#f6e)"/>
<g clip-path="url(#f6c)"><path d="${land(cx, cy, 332, [86, -14], .006)}" fill="${p.gray ? '#a4a9b0' : '#35B8FF'}" opacity=".30"/><g fill="none" stroke="${p.gray ? '#c9cdd2' : '#7CD0FF'}" stroke-width="2" opacity=".35">${[.34, .68].map(m => `<ellipse cx="${cx}" cy="${cy}" rx="${332 * m}" ry="332"/>`).join('')}<path d="M468 560H1132M520 400H1080M520 720H1080M800 228V892"/></g></g>
${arc(ENC, 'JUMPSTART', { cx, cy, r: 388, mid: -90, size: 74, track: 16, fill: '#fff' })}${[[-150, 0], [-30, 0]].length ? '' : ''}
<g fill="#fff">${bolt(800 - 27, 946, .5, '#fff')}</g>${plugV(652, 968, .58, 197, '#fff')}<g transform="translate(1600 0) scale(-1 1)">${plugV(652, 968, .58, 197, '#fff')}</g><path d="M760 988Q720 990 652 968M840 988Q880 990 948 968" stroke="#fff" stroke-width="10" fill="none"/>
<g style="filter:drop-shadow(0 12px 12px rgba(0,0,0,.6))">${I(p, 'ev_chrome', 566, 330, 468)}</g>${shadow(800, 806, 230, 22, .5)}${I(p, 'van_side_white', 574, 640, 452)}
<g clip-path="url(#f6c)"><ellipse cx="${cx}" cy="300" rx="420" ry="190" fill="url(#f6h)" opacity=".45"/></g>`;
} };

// 7: night drive
out[7] = { name: 'Night Drive', from: 1, render: true, bgc: '#050F24', bgg: '#151515', draw(p) {
  const cx = 800, cy = 440, r = 330, a = p.gray ? '#E3E6EA' : '#3CE48C', b = p.gray ? '#8B9199' : '#1FA2FF';
  const rp = L1.d3.geoPath(L1.proj(cx, cy, r, [86, -16]))(L1.d3.geoGraticule().step([15, 15])());
  return `<defs>${softDef}${lin('g7', [[0, a], [1, b]], 470, 0, 1130, 0, US)}<filter id="g7f" filterUnits="userSpaceOnUse" x="0" y="-200" width="1600" height="1600"><feGaussianBlur stdDeviation="16"/></filter>${rad('g7r', [[0, b, .30], [1, b, 0]], .5, .5, .5)}${lin('g7m', [[0, '#fff'], [.62, '#fff'], [1, '#000']], 0, 0, 0, 1)}<mask id="g7k" maskUnits="userSpaceOnUse" x="400" y="0" width="800" height="900"><rect x="400" y="60" width="800" height="760" fill="url(#g7m)"/></mask></defs>
<circle cx="${cx}" cy="${cy}" r="520" fill="url(#g7r)"/><g mask="url(#g7k)"><path d="${rp}" fill="none" stroke="url(#g7)" stroke-width="1.8" opacity=".5"/><path d="${land(cx, cy, r, [86, -16], .006)}" fill="url(#g7)" opacity=".38"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#g7)" stroke-width="16" filter="url(#g7f)" opacity=".8"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#g7)" stroke-width="4"/></g>
<path d="M120 716C420 690 1180 690 1480 716L1480 722C1180 700 420 700 120 722Z" fill="url(#g7)" filter="url(#g7f)"/><path d="M120 716C420 694 1180 694 1480 716C1180 702 420 702 120 716Z" fill="url(#g7)"/>
${shadow(800, 716, 420, 34, .5)}${I(p, 'van_low_white', 420, 722 - ih('van_low_white', 760), 760)}
${cable('M436 604C330 604 340 664 240 664', 16, { gray: p.gray }, b)}${plugV(252, 664, .7, 180, b, a, a)}
${pair(EXO, 800, 1180, 'url(#g7)', '#FFFFFF')}`;
} };

// 8: shield
out[8] = { name: 'Guardian Shield', from: 1, draw(p) {
  const S = 'M800 90C910 150 1030 172 1150 168Q1170 168 1170 190V520C1170 760 1010 920 800 1010C590 920 430 760 430 520V190Q430 168 450 168C570 172 690 150 800 90Z';
  return `<defs>${lin('h8', [[0, p.sky], [.5, p.blue], [1, p.deep]], 430, 100, 1170, 1000, US)}${lin('h8g', [[0, p.lime], [1, p.green]], 430, 900, 1170, 500, US)}${rad('h8o', [[0, p.sky], [.7, p.blue], [1, p.deep]], .35, .2, .95)}<clipPath id="h8c"><path d="${S}" transform="translate(800 548) scale(.925) translate(-800 -548)"/></clipPath></defs>
<path d="${S}" fill="${p.ink}"/><path d="${S}" transform="translate(800 548) scale(.968) translate(-800 -548)" fill="#fff"/><g clip-path="url(#h8c)"><rect x="400" y="60" width="800" height="980" fill="url(#h8)"/><circle cx="800" cy="900" r="430" fill="${p.ink}" opacity=".35"/><circle cx="800" cy="912" r="418" fill="url(#h8o)"/><path d="${land(800, 912, 418, [86, -34], .008)}" fill="url(#h8g)"/><path d="M400 720C620 660 980 660 1200 720V760C980 690 620 690 400 760Z" fill="#fff"/><path d="M400 742C620 680 980 680 1200 742V1060H400Z" fill="${p.ink}"/><path d="M400 790C620 730 980 730 1200 790V806C980 744 620 744 400 806Z" fill="url(#h8g)"/><path d="M430 168L1170 168L800 60Z" fill="#fff" opacity=".06"/></g>
${W(MONI, 'EV', { x: 800, y: 240, h: 190, a: 'm', track: 10 }, '#fff')}
${vvan(520, 486, 1.1, p, {})}${W(MON, 'JUMPSTART', { x: 800, y: 806, w: 342, a: 'm', track: 30 }, '#fff')}
${bolt(780, 872, .37, p.lime)}<path d="M762 902H722M838 902H878" stroke="${p.lime}" stroke-width="7" stroke-linecap="round"/>`;
} };

// 9: two halves, one road
out[9] = { name: 'Open Road Globe', from: 6, draw(p) {
  const cx = 460, cy = 560, r = 310;
  return `<defs>${lin('i9', [[0, p.sky], [.5, p.blue], [1, p.deep]], 160, 240, 560, 860, US)}${lin('i9g', [[0, p.lime], [1, p.green]], 500, 300, 760, 860, US)}${lin('i9r', [[0, p.slate], [1, p.ink]], 0, 300, 0, 880, US)}<clipPath id="i9c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
<g clip-path="url(#i9c)"><rect x="140" y="240" width="640" height="640" fill="url(#i9)"/><path d="${land(cx, cy, r, [96, -10], .01)}" fill="#fff" opacity=".2"/><path d="M560 220C520 360 640 400 560 520C480 640 560 760 700 900H820V220Z" fill="url(#i9g)"/><path d="${land(cx, cy, r, [60, -10], .01)}" fill="#fff" opacity=".0"/>
<path d="M556 236C512 372 628 408 540 524C452 640 360 720 300 900H690C640 780 560 700 596 600C650 500 690 430 586 236Z" fill="#fff"/><path d="M562 236C520 372 640 410 554 528C470 640 392 730 336 900H656C608 780 528 700 572 596C630 500 670 430 580 236Z" fill="url(#i9r)"/><path d="M574 300C560 376 630 428 588 506M556 560C526 628 520 690 512 760M508 800L502 880" fill="none" stroke="#fff" stroke-width="9" stroke-dasharray="40 26"/></g>
<circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="none" stroke="${p.deep}" stroke-width="9" stroke-dasharray="1580 600" transform="rotate(-20 ${cx} ${cy})" stroke-linecap="round"/>${(() => { const t = -20 * Math.PI / 180, x = cx + (r + 16) * Math.cos(t), y = cy + (r + 16) * Math.sin(t); return plugV(x, y, .66, -58, p.deep, p.deep, p.lime); })()}
${vvan(120, 640, .86, p, { halo: '#fff', hw: 22 })}
${W(RED, 'EV', { x: 880, y: 372, h: 220, track: -10 }, p.blue)}${W(RED, 'JUMPSTART', { x: 880, y: 632, w: 620, track: 14 }, p.ink)}<rect x="880" y="754" width="400" height="10" rx="5" fill="${p.green}"/><rect x="1296" y="754" width="140" height="10" rx="5" fill="${p.lime}"/>`;
} };

// 10: charge ring
out[10] = { name: 'Charge Ring', from: 1, render: true, draw(p) {
  const cx = 800, cy = 470, r = 390; let ticks = ''; for (let i = 0; i < 60; i++) { const t = i / 59, a = (140 + 260 * t) * Math.PI / 180, on = t < .8; ticks += `<path d="M${f1(cx + (r - 44) * Math.cos(a))} ${f1(cy + (r - 44) * Math.sin(a))}L${f1(cx + (r - 20) * Math.cos(a))} ${f1(cy + (r - 20) * Math.sin(a))}" stroke="${on ? (t < .4 ? p.sky : p.green) : p.mist}" stroke-width="5" stroke-linecap="round"/>`; }
  const A = t => { const a = (140 + 260 * t) * Math.PI / 180; return `${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`; }, e = (140 + 260 * .8) * Math.PI / 180;
  return `<defs>${softDef}${lin('j10', [[0, p.deep], [.45, p.sky], [1, p.lime]], 420, 700, 1180, 200, US)}${lin('j10t', [[0, p.deep], [1, p.blue]])}<clipPath id="j10c"><circle cx="${cx}" cy="${cy}" r="300"/></clipPath></defs>
<circle cx="${cx}" cy="${cy}" r="300" fill="${p.gray ? '#f3f4f5' : '#EEF5FC'}"/><g clip-path="url(#j10c)"><path d="${land(cx, cy, 300, [86, -16], .006)}" fill="${p.gray ? '#d5d8dc' : '#CFE3F6'}"/><g fill="none" stroke="#fff" stroke-width="3">${[.34, .68].map(m => `<ellipse cx="${cx}" cy="${cy}" rx="${300 * m}" ry="300"/>`).join('')}<path d="M500 470H1100M540 320H1060M540 620H1060M800 170V770"/></g></g>
<path d="M${A(.8)}A${r} ${r} 0 0 1 ${A(1)}" fill="none" stroke="${p.mist}" stroke-width="24" stroke-linecap="round"/><path d="M${A(0)}A${r} ${r} 0 1 1 ${A(.8)}" fill="none" stroke="url(#j10)" stroke-width="24" stroke-linecap="round"/>${ticks}
${plugV(cx + r * Math.cos(e), cy + r * Math.sin(e), .9, e * 180 / Math.PI + 90, p.green, p.slate)}
${W(MONI, 'EV', { x: 800, y: 204, h: 140, a: 'm', track: 6 }, 'url(#j10t)')}${shadow(800, 752, 320, 26, .34)}${I(p, 'van_low_white', 474, 752 - ih('van_low_white', 652), 652)}
${W(MON, 'JUMPSTART', { x: 800, y: 846, w: 760, a: 'm', track: 40 }, p.ink)}`;
} };

// 11: the V holds the world
out[11] = { name: 'World in the V', from: 1, render: true, draw(p) {
  const e = word(MONI, 'E', { x: 70, y: 280, h: 500 }), v = word(MONI, 'V', { x: e.x + e.w + 6, y: 280, h: 500 }), gx = v.x + v.w * .535;
  return `<defs>${softDef}${lin('k11', [[0, p.blue], [1, p.deep]], 0, 0, 0, 1)}${lin('k11g', [[0, p.deep], [.34, p.blue], [.62, p.green], [1, p.lime]], v.x, 0, v.x + v.w, 0, US)}</defs>
<path d="${e.d}" fill="url(#k11)"/><path d="${v.d}" fill="url(#k11g)"/>${I(p, 'globe_gloss', gx - 152, 196, 304)}
${cable(`M${f1(v.x + v.w - 66)} 330C${f1(v.x + v.w + 20)} 330 ${f1(v.x + v.w + 20)} 400 ${f1(v.x + v.w + 92)} 400`, 18, p)}${I(p, p.gray ? 'plug' : 'plug_blue', v.x + v.w + 76, 341, 250)}
${W(SAI, 'JUMPSTART', { x: 62, y: 836, w: 880, track: 26 }, p.ink)}${shadow(v.x + v.w + 30, 780, 270, 22, .3)}${I(p, 'van_side_white', v.x + v.w - 250, 574, 560)}`;
} };

// 12: wings
out[12] = { name: 'Wing Emblem', from: 6, draw(p) {
  const wing = [0, 1, 2, 3, 4].map(i => { const y = 372 + i * 52, l = 70 + i * 78 + i * i * 7, x1 = 596 + i * 8; return `M${x1} ${y}C${x1 - 120} ${y - 12} ${l + 190} ${y - 18} ${l} ${y - 44 + i * 6}C${l + 60} ${y + 12} ${l + 190} ${y + 36} ${x1 + 6} ${y + 36}Z`; }).join('');
  return `<defs>${lin('l12', [[0, p.lime], [.5, p.green], [1, p.deep]], 60, 0, 620, 0, US)}${lin('l12b', [[0, p.sky], [.5, p.blue], [1, p.deep]], 60, 0, 620, 0, US)}${rad('l12g', [[0, p.sky], [.6, p.blue], [1, p.deep]])}${lin('l12l', [[0, p.lime], [1, p.green]], 0, 0, 1, 1)}<clipPath id="l12c"><circle cx="800" cy="470" r="190"/></clipPath></defs>
<path d="${wing}" fill="url(#l12b)"/><g transform="translate(1600 0) scale(-1 1)"><path d="${wing}" fill="url(#l12)"/></g>
<circle cx="800" cy="470" r="222" fill="#fff"/><circle cx="800" cy="470" r="206" fill="${p.ink}"/><circle cx="800" cy="470" r="190" fill="url(#l12g)"/><g clip-path="url(#l12c)"><path d="${land(800, 470, 190, [86, -14], .01)}" fill="url(#l12l)"/><path d="M560 470H1040V700H560Z" fill="${p.ink}" opacity=".55"/><ellipse cx="740" cy="356" rx="150" ry="84" fill="#fff" opacity=".16" transform="rotate(-24 740 356)"/></g>
${W(MONI, 'EV', { x: 800, y: 336, h: 146, a: 'm', track: 6 }, '#fff', `stroke="${p.ink}" stroke-width="14" paint-order="stroke" stroke-linejoin="round"`)}
${vvan(616, 498, .72, p, { halo: p.ink, hw: 10 })}
${W(MON, 'JUMPSTART', { x: 800, y: 758, w: 900, a: 'm', track: 60 }, p.ink)}<path d="M360 890H764M860 890H1240" stroke="${p.slate}" stroke-width="4"/>${plugV(764, 890, .5, 0, p.green)}<g transform="translate(1600 0) scale(-1 1)">${''}</g>`;
} };

// 13: the world is the plug
out[13] = { name: 'World Plug', from: 6, render: true, draw(p) {
  const cx = 420, cy = 520, r = 250, met = p.gray ? [[0, '#6b7077'], [.18, '#f4f5f6'], [.42, '#9a9fa6'], [.6, '#e9ebed'], [.85, '#7b8087'], [1, '#4b4f55']] : [[0, '#637189'], [.18, '#F4F8FD'], [.42, '#94A3B8'], [.6, '#E8EEF6'], [.85, '#74839B'], [1, '#45536B']];
  return `<defs>${softDef}${lin('m13', met, 0, 0, 1, 0)}${lin('m13b', [[0, p.deep], [.35, p.blue], [.6, p.sky], [1, p.deep]], 0, 0, 1, 0)}${lin('m13r', [[0, p.blue], [.5, p.sky], [1, p.green]], 300, 0, 1500, 0, US)}</defs>
<rect x="306" y="150" width="52" height="220" rx="14" fill="url(#m13)"/><rect x="482" y="150" width="52" height="220" rx="14" fill="url(#m13)"/>
<path d="M276 716H564L520 826Q514 842 498 842H342Q326 842 320 826Z" fill="url(#m13b)"/><rect x="392" y="838" width="56" height="40" rx="8" fill="url(#m13)"/>${I(p, 'globe_gloss', cx - r, cy - r, r * 2)}
<path d="M420 874C420 1010 560 1010 700 984C920 944 1180 930 1520 934C1180 950 940 972 720 1012C560 1042 398 1030 398 874Z" fill="url(#m13r)"/>
${shadow(1090, 930, 300, 22, .28)}${I(p, 'van_side_white', 790, 706, 600)}
${W(MON, 'EV', { x: 800, y: 320, h: 178, track: 0 }, p.deep)}${W(MON, 'JUMPSTART', { x: 800, y: 540, w: 700, track: 20 }, p.green)}`;
} };

// 14: folded ribbon monogram
out[14] = { name: 'Ribbon Monogram', from: 1, draw(p) {
  return `<defs>${lin('n14a', [[0, p.lime], [1, p.green]], 0, 0, 1, 0)}${lin('n14b', [[0, p.sky], [1, p.blue]], 0, 0, 1, 0)}${lin('n14c', [[0, p.blue], [1, p.deep]], 0, 0, 0, 1)}${lin('n14d', [[0, p.sky], [1, p.deep]], 0, 0, 1, 1)}${lin('n14e', [[0, p.green], [1, p.lime]], 0, 1, 1, 0)}${lin('n14r', [[0, p.green], [.5, p.sky], [1, p.deep]], 420, 100, 1180, 840, US)}${lin('n14s', [[0, p.deep, .75], [1, p.deep, 0]], 0, 0, 1, 0)}</defs>
<path d="${sweep(800, 450, 392, 392, 0, 118, 372, t => 26 * Math.sin(Math.PI * Math.min(.98, t * .9 + .06)) + 3)}" fill="url(#n14r)"/><g fill="none" stroke="${p.sky}" stroke-width="2.5" opacity=".28"><circle cx="800" cy="450" r="340"/><ellipse cx="800" cy="450" rx="130" ry="340"/><ellipse cx="800" cy="450" rx="250" ry="340"/><path d="M460 450H1140M506 280H1094M506 620H1094"/></g>
<path d="M546 250H818L784 326H520Z" fill="url(#n14b)"/><path d="M506 412H740L706 488H480Z" fill="url(#n14b)"/><path d="M466 574H768L734 650H440Z" fill="url(#n14b)"/><path d="M546 250L622 250L482 650H406Q392 650 396 636L520 280Q530 250 546 250Z" fill="url(#n14c)"/><path d="M600 250H640L616 326H574Z M564 412H602L580 488H536ZM524 574H562L540 650H498Z" fill="url(#n14s)"/>
<path d="M826 250H924L962 500L908 650H884Q868 650 864 634Z" fill="url(#n14d)"/><path d="M1110 250H1208L986 630Q974 650 950 650H884L908 620Q932 604 948 560Z" fill="url(#n14e)"/>
${cable('M1150 262C1170 212 1190 196 1236 186', 16, p, p.lime)}${plugV(1228, 188, .74, -14, p.ink, p.slate, p.lime)}
${vvan(580, 668, .86, p, { halo: '#fff', hw: 20 })}${W(OUT, 'JUMPSTART', { x: 800, y: 912, w: 760, a: 'm', track: 60 }, p.ink)}`;
} };

// 15: fleet lockup
out[15] = { name: 'Fleet Lockup', from: 1, render: true, draw(p) {
  return `<defs>${softDef}${lin('o15', [[0, p.deep], [.5, p.blue], [1, p.sky]])}${lin('o15g', [[0, p.green], [1, p.lime]])}${lin('o15s', [[0, p.green, 0], [.3, p.green], [.7, p.sky], [1, p.blue]], 60, 0, 1540, 0, US)}<clipPath id="o15c"><rect x="0" y="0" width="1600" height="690"/></clipPath></defs>
<g clip-path="url(#o15c)">${I(p, 'globe_gloss', 500, 130, 600)}</g>
${[[90, 470, 260], [40, 520, 330], [130, 570, 210]].map(([x, y, w], i) => `<path d="M${x} ${y}L${x + w} ${y - 6}V${y + 6}Z" fill="${[p.green, p.sky, p.blue][i]}"/>`).join('')}
${shadow(800, 700, 520, 30, .4)}${I(p, 'van_side_blue', 330, 330, 940)}<path d="M60 706C460 690 1140 690 1540 706C1140 702 460 702 60 706Z" fill="url(#o15s)"/>
${cable('M352 560C270 560 290 640 214 640', 15, p)}${plugV(226, 640, .66, 180, p.ink, p.slate, p.lime)}
${pair(EXO, 776, 1240, 'url(#o15g)', 'url(#o15)')}`;
} };
module.exports = out;

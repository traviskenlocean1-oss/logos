import bpy, math, sys, os
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
opt = dict(a.split('=', 1) for a in args)
VIEW, PAINT, OUT = opt.get('view', 'q'), opt.get('paint', 'white'), opt.get('out', 'van.png')
RES, SPP = int(opt.get('res', 1200)), int(opt.get('spp', 48))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ---------- helpers
def interp(tab, x):  # monotone-ish cubic through (x,v) points
    if x <= tab[0][0]: return tab[0][1]
    if x >= tab[-1][0]: return tab[-1][1]
    for i in range(len(tab) - 1):
        x0, y0 = tab[i]; x1, y1 = tab[i + 1]
        if x0 <= x <= x1:
            def slope(j):
                if j <= 0 or j >= len(tab) - 1: return 0.0 if False else ((tab[min(j + 1, len(tab) - 1)][1] - tab[max(j - 1, 0)][1]) / (tab[min(j + 1, len(tab) - 1)][0] - tab[max(j - 1, 0)][0]))
                a = (tab[j][1] - tab[j - 1][1]) / (tab[j][0] - tab[j - 1][0]); b = (tab[j + 1][1] - tab[j][1]) / (tab[j + 1][0] - tab[j][0])
                return 0.0 if a * b <= 0 else 2 * a * b / (a + b)
            h = x1 - x0; t = (x - x0) / h
            return (2 * t ** 3 - 3 * t * t + 1) * y0 + (t ** 3 - 2 * t * t + t) * h * slope(i) + (-2 * t ** 3 + 3 * t * t) * y1 + (t ** 3 - t * t) * h * slope(i + 1)
def ss(a, b, x):
    t = max(0, min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t)

# ---------- body loft: roofline, underside, half-width along x
TOP = [(-2.56, .95), (-2.54, 1.30), (-2.48, 1.66), (-2.36, 1.86), (-2.1, 1.955), (-1.2, 2.0), (-.2, 2.0), (.45, 1.955), (.85, 1.83), (1.25, 1.57), (1.62, 1.28), (1.86, 1.135), (2.15, 1.04), (2.36, .955), (2.48, .85), (2.545, .72), (2.57, .60)]
BOT = [(-2.56, .62), (-2.50, .42), (-2.35, .33), (-2.0, .28), (2.0, .28), (2.38, .31), (2.50, .38), (2.57, .50)]
WID = [(-2.56, .72), (-2.53, .86), (-2.45, .945), (-2.2, .985), (-1.0, 1.0), (1.2, 1.0), (1.8, .985), (2.15, .95), (2.36, .87), (2.48, .74), (2.545, .56), (2.57, .40)]
xs = []
N = 300
for i in range(N + 1):
    t = i / N
    u = .5 - .5 * math.cos(math.pi * t)          # dense at both ends
    xs.append(-2.56 + 5.13 * (.35 * t + .65 * u))
M = 120
verts, faces = [], []
for x in xs:
    top, bot, w = interp(TOP, x), interp(BOT, x), interp(WID, x)
    cy, hy = (top + bot) / 2, (top - bot) / 2
    n = 6.6
    for j in range(M):
        a = 2 * math.pi * j / M
        c, s = math.cos(a), math.sin(a)
        z = math.copysign(abs(c) ** (2 / n), c) * w
        y = cy + math.copysign(abs(s) ** (2 / n), s) * hy
        sh = ss(1.0, 2.05, y)
        z *= 1 - .20 * sh - .03 * ss(.62, .28, y)                    # tumblehome, rocker tuck
        z *= 1 + .020 * math.exp(-((y - 1.02) / .085) ** 2)           # shoulder line
        z *= 1 - .016 * math.exp(-((y - .72) / .13) ** 2)             # door scallop
        verts.append((x, z, y))                                       # blender: y=lateral, z=up
for i in range(N):
    for j in range(M):
        a, b = i * M + j, i * M + (j + 1) % M
        faces.append((a, b, b + M, a + M))
faces.append(tuple(range(M - 1, -1, -1))); faces.append(tuple(N * M + j for j in range(M)))
me = bpy.data.meshes.new('body'); me.from_pydata(verts, [], faces); me.update()
body = bpy.data.objects.new('body', me); sc.collection.objects.link(body)
for p in me.polygons: p.use_smooth = True

AX = [-1.58, 1.58]; WR = .375
def cyl(name, r, d, loc, v=128):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, vertices=v, location=loc, rotation=(math.pi / 2, 0, 0)); o = bpy.context.object; o.name = name; return o
for ax in AX:
    c = cyl('cut', WR + .065, 3, (ax, 0, WR)); c.hide_render = True
    m = body.modifiers.new('arch', 'BOOLEAN'); m.operation = 'DIFFERENCE'; m.object = c; m.solver = 'EXACT'

# ---------- materials
def mat(name, col, rough=.4, metal=0, coat=0, emit=None, es=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal; b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .03
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    return m
tire = mat('tire', (.012, .012, .014), .62); rim = mat('rim', (.86, .88, .91), .42, .75); rimd = mat('rimd', (.02, .022, .026), .35, .6); disc = mat('disc', (.35, .36, .38), .3, 1); black = mat('blk', (.008, .008, .01), .5); glassm = mat('gls', (.004, .006, .010), .04, 0, 1)

# ---------- wheels
def wheel(ax, side):
    y = side * .80
    bpy.ops.mesh.primitive_torus_add(major_radius=WR - .060, minor_radius=.060, major_segments=160, minor_segments=40, location=(ax, y, WR), rotation=(math.pi / 2, 0, 0)); t = bpy.context.object; t.scale = (1, 1, 2.0); t.data.materials.append(tire); bpy.ops.object.shade_smooth()
    o = cyl('barrel', WR - .085, .16, (ax, y, WR)); o.data.materials.append(rimd)
    o = cyl('disc', WR - .20, .165, (ax, y, WR)); o.data.materials.append(disc)
    f = y + side * .100
    bpy.ops.mesh.primitive_torus_add(major_radius=WR - .092, minor_radius=.016, major_segments=160, minor_segments=24, location=(ax, f, WR), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(rim); bpy.ops.object.shade_smooth()
    for k in range(5):
        for off in (-.16, .16):
            a = k * 2 * math.pi / 5 + math.pi / 2 + off; r0, r1 = .045, WR - .096
            a0 = k * 2 * math.pi / 5 + math.pi / 2 + off * .35
            p0 = Vector((math.cos(a0) * r0, 0, math.sin(a0) * r0)); p1 = Vector((math.cos(a) * r1, 0, math.sin(a) * r1)); d = p1 - p0
            bpy.ops.mesh.primitive_cube_add(size=1, location=(ax + (p0.x + p1.x) / 2, f, WR + (p0.z + p1.z) / 2)); s = bpy.context.object
            s.scale = (d.length, .022, .036); s.rotation_euler = (0, -math.atan2(d.z, d.x), 0)
            bv = s.modifiers.new('b', 'BEVEL'); bv.width = .006; bv.segments = 3; s.data.materials.append(rim)
    o = cyl('hub', .058, .03, (ax, f + side * .006, WR)); bv = o.modifiers.new('b', 'BEVEL'); bv.width = .008; bv.segments = 3; o.data.materials.append(rimd)
    bpy.ops.mesh.primitive_cylinder_add(radius=WR - .03, depth=.3, vertices=96, location=(ax, side * .58, WR), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(black)
for ax in AX:
    for s in (-1, 1): wheel(ax, s)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, .40)); u = bpy.context.object; u.scale = (4.1, 1.3, .14); u.data.materials.append(black)
for s in (-1, 1):  # mirrors
    bpy.ops.mesh.primitive_cube_add(size=1, location=(1.13, s * 1.085, 1.235)); o = bpy.context.object; o.scale = (.11, .20, .145); o.rotation_euler = (0, .10, s * .18); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); bv = o.modifiers.new('b', 'BEVEL'); bv.width = .05; bv.segments = 6; o.data.materials.append(glassm); bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cube_add(size=1, location=(1.16, s * .965, 1.165)); o = bpy.context.object; o.scale = (.05, .14, .035); o.data.materials.append(glassm)

# ---------- painted body shader
P = bpy.data.materials.new('paint'); P.use_nodes = True; nt = P.node_tree; nd = nt.nodes; lk = nt.links; nd.clear()
outn = nd.new('ShaderNodeOutputMaterial'); tc = nd.new('ShaderNodeTexCoord'); geo = nd.new('ShaderNodeNewGeometry')
sp = nd.new('ShaderNodeSeparateXYZ'); lk.new(tc.outputs['Object'], sp.inputs[0]); sn = nd.new('ShaderNodeSeparateXYZ'); lk.new(geo.outputs['Normal'], sn.inputs[0])
def mth(op, a, b=None, c=None):
    n = nd.new('ShaderNodeMath'); n.operation = op
    for i, v in enumerate((a, b, c)):
        if v is None: continue
        if isinstance(v, (int, float)): n.inputs[i].default_value = v
        else: lk.new(v, n.inputs[i])
    return n.outputs[0]
X, Y, Z = sp.outputs
def uvn(u, v):
    c = nd.new('ShaderNodeCombineXYZ'); lk.new(u, c.inputs[0]); lk.new(v, c.inputs[1]); return c.outputs[0]
vv = mth('DIVIDE', mth('ADD', Z, .10), 2.25)
uvS = uvn(mth('DIVIDE', mth('ADD', X, 3), 6), vv); uvF = uvn(mth('DIVIDE', mth('ADD', Y, 1.2), 2.4), vv)
def img(f, uv):
    t = nd.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(HERE, f)); t.image.colorspace_settings.name = 'Non-Color'; t.extension = 'EXTEND'; lk.new(uv, t.inputs[0]); return t.outputs['Color']
def bw(c):
    s = nd.new('ShaderNodeSeparateColor'); lk.new(c, s.inputs[0]); return s.outputs
absn = mth('ABSOLUTE', sn.outputs[1])
isSide = mth('GREATER_THAN', absn, .50); notSide = mth('SUBTRACT', 1, isSide)
isFront = mth('MULTIPLY', notSide, mth('GREATER_THAN', X, .55))
nose = mth('GREATER_THAN', X, 1.95)
gS = mth('MULTIPLY', bw(img('side_glass.png', uvS))[0], isSide); gF = mth('MULTIPLY', bw(img('front_glass.png', uvF))[0], isFront)
glass = mth('MAXIMUM', gS, gF)
dS = mth('MULTIPLY', bw(img('side_dark.png', uvS))[0], isSide); dF = mth('MULTIPLY', bw(img('front_dark.png', uvF))[0], mth('MULTIPLY', isFront, nose))
# wrap-around nose panel, so the lights run around the corner
band = mth('MULTIPLY', mth('MULTIPLY', mth('GREATER_THAN', Z, .735), mth('LESS_THAN', Z, .865)), mth('GREATER_THAN', X, 2.10))
low = mth('LESS_THAN', Z, .335)
dark = mth('MAXIMUM', mth('MAXIMUM', dS, dF), mth('MAXIMUM', band, low))
led = mth('MULTIPLY', mth('MULTIPLY', mth('GREATER_THAN', Z, .825), mth('LESS_THAN', Z, .850)), mth('GREATER_THAN', X, 2.12))
tail = mth('MULTIPLY', mth('MULTIPLY', mth('GREATER_THAN', Z, 1.06), mth('LESS_THAN', Z, 1.11)), mth('LESS_THAN', X, -2.40))
seam = mth('MULTIPLY', bw(img('side_seam.png', uvS))[0], isSide)
liv = bw(img('side_livery.png', uvS)); lB = mth('MULTIPLY', liv[0], isSide); lG = mth('MULTIPLY', liv[1], isSide)
def rgb(c):
    n = nd.new('ShaderNodeRGB'); n.outputs[0].default_value = (*c, 1); return n.outputs[0]
def mix(f, a, b):
    n = nd.new('ShaderNodeMix'); n.data_type = 'RGBA'; lk.new(f, n.inputs['Factor']); lk.new(a, n.inputs[6]); lk.new(b, n.inputs[7]); return n.outputs[2]
PAL = {'white': ((.80, .83, .86), (.005, .09, .52), (.03, .50, .10)), 'blue': ((.004, .075, .42), (.80, .86, .92), (.06, .62, .10)), 'green': ((.015, .34, .09), (.80, .86, .92), (.004, .075, .42)), 'silver': ((.50, .53, .57), (.004, .075, .42), (.03, .50, .10)), 'navy': ((.006, .022, .085), (.004, .20, .85), (.05, .62, .10))}[PAINT]
col = rgb(PAL[0])
if opt.get('livery', '1') == '1': col = mix(lB, col, rgb(PAL[1])); col = mix(lG, col, rgb(PAL[2]))
col = mix(seam, col, rgb((.01, .012, .016))); col = mix(dark, col, rgb((.008, .009, .012)))
b = nd.new('ShaderNodeBsdfPrincipled'); lk.new(col, b.inputs['Base Color'])
b.inputs['Metallic'].default_value = {'white': .12, 'silver': .75}.get(PAINT, .45); b.inputs['Roughness'].default_value = .32; b.inputs['Coat Weight'].default_value = 1; b.inputs['Coat Roughness'].default_value = .02
g = nd.new('ShaderNodeBsdfPrincipled'); g.inputs['Base Color'].default_value = (.004, .007, .012, 1); g.inputs['Roughness'].default_value = .03; g.inputs['Coat Weight'].default_value = 1; g.inputs['Specular IOR Level'].default_value = .8
m1 = nd.new('ShaderNodeMixShader'); lk.new(glass, m1.inputs[0]); lk.new(b.outputs[0], m1.inputs[1]); lk.new(g.outputs[0], m1.inputs[2])
e = nd.new('ShaderNodeEmission'); e.inputs[0].default_value = (.82, .93, 1, 1); e.inputs[1].default_value = 5
m2 = nd.new('ShaderNodeMixShader'); lk.new(led, m2.inputs[0]); lk.new(m1.outputs[0], m2.inputs[1]); lk.new(e.outputs[0], m2.inputs[2])
e2 = nd.new('ShaderNodeEmission'); e2.inputs[0].default_value = (1, .03, .02, 1); e2.inputs[1].default_value = 2
m3 = nd.new('ShaderNodeMixShader'); lk.new(tail, m3.inputs[0]); lk.new(m2.outputs[0], m3.inputs[1]); lk.new(e2.outputs[0], m3.inputs[2])
lk.new(m3.outputs[0], outn.inputs[0]); body.data.materials.append(P)

# ---------- studio: soft boxes seen only in reflections
def box(loc, size, strength, target=(0, 0, .9), col=(1, 1, 1)):
    L = bpy.data.lights.new('a', 'AREA'); L.shape = 'RECTANGLE'; L.size, L.size_y = size; L.energy = strength; L.color = col
    o = bpy.data.objects.new('a', L); o.location = loc; o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); sc.collection.objects.link(o); return o
box((0, 0, 6.5), (9, 2.4), 560); box((0, -9, 7.5), (14, 1.6), 420, (0, 0, 1.2)); box((9, -2.5, 6.5), (4, 3), 380, (1.5, 0, .9)); box((2, 7, 4), (8, 3), 420)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; wn = w.node_tree; bg = wn.nodes['Background']
tcw = wn.nodes.new('ShaderNodeTexCoord'); sw = wn.nodes.new('ShaderNodeSeparateXYZ'); rp = wn.nodes.new('ShaderNodeValToRGB')
wn.links.new(tcw.outputs['Generated'], sw.inputs[0]); mr = wn.nodes.new('ShaderNodeMapRange'); mr.inputs[1].default_value = -1; mr.inputs[2].default_value = 1; wn.links.new(sw.outputs[2], mr.inputs[0]); wn.links.new(mr.outputs[0], rp.inputs[0]); wn.links.new(rp.outputs[0], bg.inputs[0])
el = rp.color_ramp.elements; el[0].position = .0; el[0].color = (.10, .11, .13, 1); el[1].position = 1; el[1].color = (.75, .80, .88, 1)
for pos, c in ((.485, (.05, .055, .065, 1)), (.515, (.62, .66, .72, 1))):
    q = el.new(pos); q.color = c
bg.inputs[1].default_value = .70

# ---------- camera
CAM = {'side': ((0, -20, 1.0), (0, 0, 1.0), 118), 'q': ((7.6, -7.0, 2.1), (.12, 0, .92), 62), 'low': ((6.6, -4.6, .78), (.35, 0, .92), 50), 'front': ((13, -1.4, 1.35), (0, 0, .98), 95), 'high': ((6.2, -7.8, 4.6), (0, 0, .85), 62), 'rq': ((-7.4, -7.2, 2.0), (-.1, 0, .92), 62)}[VIEW]
cd = bpy.data.cameras.new('c'); cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); cam.location = CAM[0]; cam.rotation_euler = (Vector(CAM[1]) - Vector(CAM[0])).to_track_quat('-Z', 'Y').to_euler(); cd.lens = CAM[2]; sc.camera = cam
sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.use_denoising = True; sc.render.film_transparent = True
try:
    pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = 'ONEAPI'; pr.get_devices()
    if any(d.type == 'ONEAPI' for d in pr.devices):
        for d in pr.devices: d.use = d.type == 'ONEAPI'
        if opt.get('gpu', '0') == '1': sc.cycles.device = 'GPU'
except Exception as ex: print('gpu', ex)
sc.render.resolution_x = RES; sc.render.resolution_y = int(RES * (.5 if VIEW == 'side' else .62)); sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Khronos PBR Neutral'
sc.view_settings.exposure = float(opt.get('exp', '-0.25')); sc.render.filepath = os.path.join(HERE, OUT); bpy.ops.render.render(write_still=True); print('RENDERED', OUT)

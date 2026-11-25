import bpy, math, sys, os
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
opt = dict(a.split('=', 1) for a in sys.argv[sys.argv.index('--') + 1:])
KIND, VAR, OUT = opt['kind'], opt.get('var', ''), opt['out']
RES, SPP = int(opt.get('res', 900)), int(opt.get('spp', 48))
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene

def mat(name, col, rough=.3, metal=0, coat=0, emit=None, es=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal; b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .02
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    return m
def box(loc, size, e, target=(0, 0, 0), col=(1, 1, 1)):
    L = bpy.data.lights.new('a', 'AREA'); L.shape = 'ELLIPSE' if KIND == 'globe' else 'RECTANGLE'; L.size, L.size_y = size; L.energy = e; L.color = col
    o = bpy.data.objects.new('a', L); o.location = loc; o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); sc.collection.objects.link(o)
def world(stops, s):
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; n = w.node_tree; bg = n.nodes['Background']
    tc = n.nodes.new('ShaderNodeTexCoord'); sx = n.nodes.new('ShaderNodeSeparateXYZ'); mr = n.nodes.new('ShaderNodeMapRange'); rp = n.nodes.new('ShaderNodeValToRGB'); mr.inputs[1].default_value = -1
    n.links.new(tc.outputs['Generated'], sx.inputs[0]); n.links.new(sx.outputs[2], mr.inputs[0]); n.links.new(mr.outputs[0], rp.inputs[0]); n.links.new(rp.outputs[0], bg.inputs[0])
    el = rp.color_ramp.elements; el[0].position = stops[0][0]; el[0].color = (*stops[0][1], 1); el[1].position = stops[-1][0]; el[1].color = (*stops[-1][1], 1)
    for p, c in stops[1:-1]: q = el.new(p); q.color = (*c, 1)
    bg.inputs[1].default_value = s
def cam(loc, tgt, lens=None, ortho=None):
    cd = bpy.data.cameras.new('c'); o = bpy.data.objects.new('c', cd); sc.collection.objects.link(o); o.location = loc; o.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); sc.camera = o
    if ortho: cd.type = 'ORTHO'; cd.ortho_scale = ortho
    else: cd.lens = lens

W, H = RES, RES
if KIND == 'globe':
    bpy.ops.mesh.primitive_uv_sphere_add(segments=256, ring_count=128, radius=1); g = bpy.context.object; bpy.ops.object.shade_smooth()
    g.rotation_euler = (math.radians(float(opt.get('tilt', '14'))), 0, math.radians(float(opt.get('spin', '-2'))))
    m = bpy.data.materials.new('g'); m.use_nodes = True; nt = m.node_tree; nd = nt.nodes; lk = nt.links; b = nd['Principled BSDF']
    tc = nd.new('ShaderNodeTexCoord'); sp = nd.new('ShaderNodeSeparateXYZ'); lk.new(tc.outputs['Object'], sp.inputs[0])
    def mth(op, a, c=None):
        n = nd.new('ShaderNodeMath'); n.operation = op
        for i, v in enumerate((a, c)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[i].default_value = v
            else: lk.new(v, n.inputs[i])
        return n.outputs[0]
    X, Y, Z = sp.outputs
    lon = mth('ARCTAN2', Y, X); lat = mth('ARCSINE', Z)
    u = mth('ADD', mth('DIVIDE', lon, 2 * math.pi), .5); v = mth('ADD', mth('DIVIDE', lat, math.pi), .5)
    uv = nd.new('ShaderNodeCombineXYZ'); lk.new(u, uv.inputs[0]); lk.new(v, uv.inputs[1])
    def img(f):
        t = nd.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(HERE, f)); t.image.colorspace_settings.name = 'Non-Color'; lk.new(uv.outputs[0], t.inputs[0]); return t.outputs['Color']
    L = img('land.png'); LB = img('land_b.png')
    SEA, LAND, LAND2 = {'gloss': ((.002, .060, .42), (.012, .30, .05), (.06, .52, .09)), 'deep': ((.001, .014, .085), (.008, .26, .07), (.04, .46, .12)), 'ice': ((.60, .74, .90), (.01, .16, .62), (.03, .46, .16))}[VAR or 'gloss']
    def rgb(c): n = nd.new('ShaderNodeRGB'); n.outputs[0].default_value = (*c, 1); return n.outputs[0]
    def mix(f, a, c): n = nd.new('ShaderNodeMix'); n.data_type = 'RGBA'; lk.new(f, n.inputs['Factor']); lk.new(a, n.inputs[6]); lk.new(c, n.inputs[7]); return n.outputs[2]
    mr = nd.new('ShaderNodeMapRange'); geo = nd.new('ShaderNodeNewGeometry'); sg = nd.new('ShaderNodeSeparateXYZ'); lk.new(geo.outputs['Position'], sg.inputs[0]); lk.new(sg.outputs[2], mr.inputs[0]); mr.inputs[1].default_value = -.8; mr.inputs[2].default_value = .9
    col = mix(L, rgb(SEA), mix(mr.outputs[0], rgb(LAND), rgb(LAND2)))
    lw = nd.new('ShaderNodeLayerWeight'); lw.inputs[0].default_value = .22
    col = mix(mth('MULTIPLY', lw.outputs['Facing'], .85), col, rgb({'deep': (.02, .35, .75), 'ice': (.10, .30, .75)}.get(VAR, (.10, .50, .95))))
    lk.new(col, b.inputs['Base Color']); b.inputs['Roughness'].default_value = .28; b.inputs['Coat Weight'].default_value = 1; b.inputs['Coat Roughness'].default_value = .04
    bp = nd.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .85; bp.inputs['Distance'].default_value = .03; lk.new(LB, bp.inputs['Height']); lk.new(bp.outputs[0], b.inputs['Normal'])
    g.data.materials.append(m)
    world([(0, (.02, .05, .12)), (.47, (.10, .18, .32)), (.55, (.55, .68, .85)), (1, (.85, .92, 1))], .75)
    box((-5, -4.2, 6.5), (5.2, 3.4), 760); box((4, 2.5, 1.5), (1.2, 4), 320, col=(.4, .75, 1))
    cam((0, -10, 0), (0, 0, 0), ortho=2.04)
elif KIND == 'ev':
    cu = bpy.data.curves.new('t', 'FONT'); cu.body = opt.get('text', 'EV'); cu.font = bpy.data.fonts.load(os.path.join(HERE, opt.get('font', 'saira-800-italic.otf')))
    cu.extrude = .075; cu.bevel_depth = .022; cu.bevel_resolution = 6; cu.resolution_u = 24; cu.offset = -.012; cu.space_character = float(opt.get('track', '1.02')); cu.align_x = 'CENTER'
    o = bpy.data.objects.new('t', cu); sc.collection.objects.link(o); o.rotation_euler = (math.pi / 2, 0, 0)
    C = {'chrome': mat('c', (.86, .89, .93), .10, 1), 'blue': mat('c', (.005, .10, .62), .20, .65, 1), 'green': mat('c', (.03, .52, .07), .20, .6, 1), 'white': mat('c', (.86, .89, .93), .22, .1, 1), 'steel': mat('c', (.55, .60, .68), .24, 1)}[VAR or 'chrome']
    cu.materials.append(C)
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); ob = o.evaluated_get(dg); bb = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    x0, x1, z0, z1 = min(p.x for p in bb), max(p.x for p in bb), min(p.z for p in bb), max(p.z for p in bb)
    cx, cz, w, h = (x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0
    world([(0, (.01, .012, .018)), (.40, (.05, .06, .08)), (.49, (.16, .19, .24)), (.505, (.95, .97, 1)), (.60, (.78, .84, .92)), (.82, (.22, .28, .38)), (1, (.95, .97, 1))], .95)
    box((-2, -5, 4), (3, 1), 160, (cx, 0, cz)); box((3, -4, -2), (3, .8), 60, (cx, 0, cz), (.6, .8, 1)); box((0, -1.2, 4), (6, 1), 140, (cx, 0, cz))
    d = 9; cam((cx + .15, -d, cz + .55), (cx, 0, cz), lens=36 * d / (max(w, h) * 1.12)); H = int(W * min(1, (h * 1.22) / (w * 1.12)))
elif KIND == 'plug':
    body = mat('b', (.012, .014, .018), .32, .1, 1); pr = mat('p', (.85, .87, .90), .16, 1); gl = mat('g', (.02, .5, .08), .3, 0, 1, (.05, .75, .15), .7); blue = mat('bl', (.004, .09, .55), .25, .4, 1)
    prof = [(-1.15, .13), (-.95, .135), (-.80, .16), (-.62, .27), (-.45, .40), (-.25, .455), (.35, .47), (.50, .455), (.56, .42), (.56, 0)]
    def rev(prof, sy, m, seg=96):
        pts = []
        import bisect
        n = len(prof); dense = []
        for i in range(n - 1):
            for k in range(14):
                t = k / 14; dense.append((prof[i][0] + (prof[i + 1][0] - prof[i][0]) * t, prof[i][1] + (prof[i + 1][1] - prof[i][1]) * t))
        dense.append(prof[-1]); sm = [(x, sum(dense[max(0, min(len(dense) - 1, j + q))][1] for q in range(-5, 6)) / 11 if 6 < j < len(dense) - 24 else r) for j, (x, r) in enumerate(dense)]
        vs, fs = [], []
        for x, r in sm:
            for j in range(seg):
                a = 2 * math.pi * j / seg; vs.append((x, math.copysign(abs(math.cos(a)) ** .62, math.cos(a)) * r * sy, math.copysign(abs(math.sin(a)) ** .62, math.sin(a)) * r))
        for i in range(len(sm) - 1):
            for j in range(seg): fs.append((i * seg + j, (i + 1) * seg + j, (i + 1) * seg + (j + 1) % seg, i * seg + (j + 1) % seg))
        me = bpy.data.meshes.new('r'); me.from_pydata(vs, [], fs); [setattr(p, 'use_smooth', True) for p in me.polygons]; o = bpy.data.objects.new('r', me); sc.collection.objects.link(o); me.materials.append(m); return o
    rev(prof, .72, blue if VAR == 'blue' else body)
    rev([(.16, .474), (.17, .482), (.235, .482), (.245, .474)], .72, gl)
    for z in (.2, -.2):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(.90, 0, z)); o = bpy.context.object; o.scale = (.74, .16, .085); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); bv = o.modifiers.new('b', 'BEVEL'); bv.width = .03; bv.segments = 5; o.data.materials.append(pr); bpy.ops.object.shade_smooth()
    world([(0, (.04, .05, .07)), (.48, (.10, .12, .15)), (.53, (.80, .85, .92)), (1, (.9, .95, 1))], .8)
    box((-1.5, -4, 4), (3, 1.4), 260); box((2, -5, 0), (2, 1), 90)
    if opt.get('view') == 'q': cam((3.6, -5.2, 1.9), (.06, 0, 0), lens=72)
    else: cam((0, -10, .0), (.06, 0, 0), ortho=2.62)
    H = int(W * .48)
sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.use_denoising = True; sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Khronos PBR Neutral'; sc.view_settings.exposure = float(opt.get('exp', '0')); sc.render.filepath = os.path.join(HERE, OUT); bpy.ops.render.render(write_still=True); print('RENDERED', OUT)

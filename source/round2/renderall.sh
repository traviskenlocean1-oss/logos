B="/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"
a(){ "$B" -b --factory-startup -P assets.py -- "$@" 2>&1 | grep -E "RENDERED|Traceback"; }
v(){ "$B" -b --factory-startup -P van.py -- "$@" 2>&1 | grep -E "RENDERED|Traceback"; }
a kind=globe var=gloss out=globe_gloss.png res=1600 spp=64
a kind=globe var=deep out=globe_deep.png res=1600 spp=64
a kind=plug out=plug.png res=1300 spp=48
a kind=plug var=blue out=plug_blue.png res=1300 spp=48
a kind=ev var=chrome font=saira-800-italic.otf out=ev_chrome_i.png res=1500 spp=64 exp=0.55
a kind=ev var=chrome font=montserrat-800-normal.otf out=ev_chrome.png res=1500 spp=64 exp=0.55
v view=q paint=white out=van_q_white.png res=1900 spp=64 exp=-0.15
v view=side paint=white out=van_side_white.png res=1900 spp=64 exp=-0.15
v view=q paint=blue out=van_q_blue.png res=1900 spp=64 exp=0.15
v view=side paint=blue out=van_side_blue.png res=1900 spp=64 exp=0.15
v view=front paint=white out=van_front_white.png res=1700 spp=64 exp=-0.15
v view=low paint=white out=van_low_white.png res=1900 spp=64 exp=-0.1
echo ALLDONE

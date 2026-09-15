"""Render reproducible league publications from the official snapshot (Pillow)."""
from pathlib import Path
import json, zipfile
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'data/official-live.json').read_text())
out=ROOT/'downloads/publicaciones';out.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
regular='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
logos={'3':'assets/branding/primera-fuerza-hd.png','5':'assets/categories/intermedia.webp','4':'assets/categories/segunda-fuerza.webp','2':'assets/categories/veteranos-35-user.png','1':'assets/categories/veteranos-50.webp'}
def write(d,txt,xy,width,size=27,color='white'):
 txt=str(txt)
 while size>12:
  f=ImageFont.truetype(font,size)
  if d.textbbox((0,0),txt,font=f)[2]<=width:break
  size-=1
 d.text(xy,txt,font=f,fill=color)
def paste(im,path,xy,size):
 p=ROOT/path.lstrip('./')
 if not p.is_file():return
 obj=Image.open(p).convert('RGBA');obj.thumbnail((size,size));im.paste(obj,(xy[0]+(size-obj.width)//2,xy[1]+(size-obj.height)//2),obj)
def team(im,n,xy):
 v=data['team_logos'].get(n,{})
 if isinstance(v,dict) and v.get('local'):paste(im,v['local'],xy,50)
 elif n=='GALACTICOS':paste(im,'assets/teams/galacticos-pozos.webp',xy,50)
for cid in ['3','5','4','2','1']:
 c=data['categories'][cid]
 for kind in ['clasificacion','partidos']:
  rows=[r for t in c['standings' if kind=='clasificacion' else 'fixtures'] for r in t['rows'] if kind!='clasificacion' or 'Equipo' in t['headers']]
  rh=78 if kind=='clasificacion' else 150
  im=Image.new('RGB',(1600,380+max(1,len(rows))*rh),'#060d37');d=ImageDraw.Draw(im)
  for y in range(im.height):
   d.line((0,y,1600,y),fill=(5+int(y/im.height*12),12+int(y/im.height*20),50+int(y/im.height*60)))
  d.rectangle((0,0,1600,10),fill='#55e5f4');paste(im,'assets/liga-logo.webp',(40,38),130);paste(im,logos[cid],(1430,38),120)
  write(d,'LIGA JUVENTINO ROSAS',(210,44),1170,39);write(d,kind.upper()+' · '+c['name'],(210,106),1170,32)
  write(d,'Datos de la liga · '+str(data['captured_at_utc'])[:10],(50,204),1490,22,'#b3ddff')
  if kind=='clasificacion':
   xx=[60,145,770,860,950,1040,1130,1220,1310,1450]
   for j,h in enumerate(['POS','EQUIPO','PJ','PG','PE','PP','GF','GC','DIF','PTS']):write(d,h,(xx[j],260),590 if j==1 else 95,24,'#65e2ff')
   for i,r in enumerate(rows):
    y=307+i*rh;d.rectangle((40,y,1560,y+rh-4),fill='#14285e' if i%2 else '#0c1948')
    for j,v in enumerate(r):
     if j==1:team(im,v,(144,y+10));write(d,v,(210,y+21),525,28)
     else:write(d,v,(xx[j],y+21),90,28)
  else:
   for i,r in enumerate(rows):
    y=268+i*rh;d.rectangle((40,y,1560,y+rh-5),fill='#14285e' if i%2 else '#0c1948')
    write(d,'JORNADA '+r[1]+' · '+(r[8] or 'Fecha por confirmar'),(60,y+9),1460,22,'#65e2ff');team(im,r[2],(60,y+49));team(im,r[6],(1495,y+49))
    write(d,r[2],(125,y+58),580,27);write(d,'VS',(763,y+58),65,27);write(d,r[6],(870,y+58),610,27)
    write(d,'Campo: '+(r[7] or 'Por confirmar')+' · Marcador registrado: '+r[3]+' — '+r[5],(60,y+112),1460,20,'#c9dcff')
  if not rows:write(d,'Sin datos publicados para esta categoría.',(60,315),1450,34)
  write(d,'Liga Juventino Rosas · Verifica fecha, categoría y jornada antes de compartir',(50,im.height-42),1500,20,'#aac5ec')
  im.save(out/f'{kind}-{cid}.png',optimize=True)
with zipfile.ZipFile(ROOT/'downloads/Publicaciones_Liga_JR_38-59.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in out.glob('*.png'):z.write(p,p.name)
print('10 PNG y ZIP generados')

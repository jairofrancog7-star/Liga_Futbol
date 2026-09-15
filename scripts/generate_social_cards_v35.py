#!/usr/bin/env python3
# FIX35: genera PNG modernos para WhatsApp/Facebook desde data/official-live.json.
import json,re,datetime,unicodedata
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
try:
    import cairosvg
except Exception:
    cairosvg=None
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data'/'official-live.json').read_text(encoding='utf-8'))
OUT=ROOT/'publicaciones'/'latest';OUT.mkdir(parents=True,exist_ok=True)
W,H=1080,1350
BG=(3,13,9);CARD=(7,28,20);GREEN=(32,232,161);GOLD=(241,199,91);WHITE=(244,248,246);MUTED=(145,169,157);LINE=(27,74,55)
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(n,b=False):
    try:return ImageFont.truetype(BOLD if b else FONT,n)
    except:return ImageFont.load_default()
def norm(s):
    s=unicodedata.normalize('NFD',str(s or ''));s=''.join(c for c in s if unicodedata.category(c)!='Mn').upper();return re.sub(r'[^A-Z0-9]+',' ',s).strip()
def slug(s):return re.sub(r'[^a-z0-9]+','-',norm(s).lower()).strip('-')
def cats():return sorted(DATA.get('categories',{}).values(),key=lambda c:c.get('id',0))
def roundrect(d,xy,r=22,fill=CARD,outline=LINE,w=2):d.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=w)
def fit_logo(im,path,box):
    try:
        lg=Image.open(path).convert('RGBA');lg.thumbnail((box[2]-box[0],box[3]-box[1]));x=box[0]+((box[2]-box[0])-lg.width)//2;y=box[1]+((box[3]-box[1])-lg.height)//2;im.alpha_composite(lg,(x,y))
    except:pass
def header(im,d,title,sub):
    roundrect(d,(45,35,1035,195),26,(5,23,16),LINE,2);fit_logo(im,ROOT/'assets'/'liga-logo.webp',(65,55,175,165));d.text((195,62),'LIGA MUNICIPAL DE FÚTBOL',font=font(22,1),fill=GREEN);d.text((195,96),'JUVENTINO ROSAS A.C.',font=font(30,1),fill=WHITE);d.text((1005,72),datetime.date.today().strftime('%d/%m/%Y'),font=font(20,1),fill=GOLD,anchor='ra');d.text((55,235),title,font=font(48,1),fill=WHITE);d.text((57,298),sub,font=font(21),fill=MUTED)
def flat_blocks(c,key):
    out=[]
    for b in c.get(key,[]) or []:
        hs=b.get('headers',[])
        for r in b.get('rows',[]) or []:out.append((hs,r))
    return out
def val(hs,r,name):
    ns=[norm(x) for x in hs]
    try:i=ns.index(norm(name));return r[i] if i<len(r) else ''
    except:return ''
def standings(c):return flat_blocks(c,'standings')
def fixtures(c):
    out=[]
    for hs,r in flat_blocks(c,'fixtures'):
        out.append({'jornada':val(hs,r,'Jornada'),'fecha':val(hs,r,'Fecha/Hora') or val(hs,r,'Fecha Hora'),'local':val(hs,r,'Local'),'visitante':val(hs,r,'Visitante'),'campo':val(hs,r,'Campo'),'g1':next((r[i] for i,h in enumerate(hs) if norm(h)=='GOLES'),'' )})
    return out
def pending_round(c):
    fs=fixtures(c)
    pend=[m for m in fs if str(m.get('g1','')).strip() in ('','-')]
    if not pend:return fs[-8:]
    js=[int((re.search(r'\d+',str(x.get('jornada',''))) or re.match(r'0','0')).group()) for x in pend]
    target=max(js) if js else 0
    return [m for m,j in zip(pend,js) if j==target]
def table_card(c):
    im=Image.new('RGBA',(W,H),BG+(255,));d=ImageDraw.Draw(im);header(im,d,'TABLA DE POSICIONES',c.get('name',''))
    y=350;roundrect(d,(45,y,1035,y+58),16,(12,135,88),None,0);cols=[('#',70),('EQUIPO',145),('PJ',650),('PG',720),('PE',790),('PP',860),('DIF',925),('PTS',995)]
    for t,x in cols:d.text((x,y+18),t,font=font(17,1),fill=WHITE,anchor='mm' if t!='EQUIPO' else 'lm')
    y+=70
    for n,(hs,r) in enumerate(standings(c)[:14],1):
        roundrect(d,(45,y,1035,y+56),14,(7,28,20) if n>4 else (8,39,28),LINE,1)
        vals=[val(hs,r,'#') or n,val(hs,r,'Equipo'),val(hs,r,'PJ'),val(hs,r,'PG'),val(hs,r,'PE'),val(hs,r,'PP'),val(hs,r,'DIF'),val(hs,r,'PTS')]
        xs=[70,145,650,720,790,860,925,995]
        for i,(v,x) in enumerate(zip(vals,xs)):
            if i==7:
                d.rounded_rectangle((958,y+8,1022,y+48),radius=10,fill=GOLD);d.text((990,y+28),str(v),font=font(18,1),fill=(20,34,25),anchor='mm')
            else:d.text((x,y+28),str(v),font=font(17,1 if i==1 else 0),fill=WHITE,anchor='lm' if i==1 else 'mm')
        y+=62
    d.text((55,1300),'Fuente deportiva pública: juventinorosasliga.com',font=font(16),fill=MUTED)
    p=OUT/f'tabla-{slug(c.get("name"))}.png';im.convert('RGB').save(p,quality=94);return p
def round_card(c):
    im=Image.new('RGBA',(W,H),BG+(255,));d=ImageDraw.Draw(im);header(im,d,'PRÓXIMA JORNADA',c.get('name',''))
    rows=pending_round(c)[:8];y=360
    if not rows:d.text((540,700),'Sin partidos programados en la fuente pública.',font=font(28,1),fill=MUTED,anchor='mm')
    for m in rows:
        roundrect(d,(55,y,1025,y+112),20,CARD,LINE,2);tm=str(m.get('fecha') or '').split();hora=tm[-1] if tm else '—';d.rounded_rectangle((75,y+22,190,y+90),radius=14,fill=GREEN);d.text((132,y+56),hora,font=font(20,1),fill=(3,32,20),anchor='mm');d.text((220,y+34),str(m.get('local') or '').upper(),font=font(20,1),fill=WHITE);d.text((220,y+70),'VS',font=font(16,1),fill=GOLD);d.text((265,y+70),str(m.get('visitante') or '').upper(),font=font(20,1),fill=WHITE);d.text((995,y+55),str(m.get('campo') or 'Sede por confirmar'),font=font(15),fill=MUTED,anchor='ra');y+=128
    d.text((55,1300),'Horarios y campos sujetos a la decisión oficial de la Liga.',font=font(16),fill=MUTED)
    p=OUT/f'jornada-{slug(c.get("name"))}.png';im.convert('RGB').save(p,quality=94);return p
def summary(kind,files):
    im=Image.new('RGBA',(W,H),BG+(255,));d=ImageDraw.Draw(im);header(im,d,'RESUMEN DE '+('TABLAS' if kind=='tablas' else 'JORNADA'),'Todas las categorías activas')
    y=360
    for c in cats():
        co=c.get('counts') or c.get('dashboard',{}).get('counts',{});roundrect(d,(60,y,1020,y+155),22,CARD,LINE,2);d.text((85,y+32),c.get('name',''),font=font(24,1),fill=GREEN)
        if kind=='tablas':
            rows=standings(c);leader=val(*rows[0],'Equipo') if rows else 'Sin tabla';pts=val(*rows[0],'PTS') if rows else ''
            d.text((85,y+78),'Líder',font=font(15),fill=MUTED);d.text((85,y+111),leader,font=font(22,1),fill=WHITE);d.text((980,y+92),(str(pts)+' pts') if pts!='' else '—',font=font(22,1),fill=GOLD,anchor='ra')
        else:
            rs=pending_round(c);d.text((85,y+82),f'{len(rs)} partido(s) en la próxima jornada disponible',font=font(20,1),fill=WHITE);d.text((85,y+116),f"{co.get('Equipos','—')} equipos · {co.get('Jugadores','—')} jugadores",font=font(15),fill=MUTED)
        y+=170
    p=OUT/f'resumen-{kind}.png';im.convert('RGB').save(p,quality=94);return p
def america_card():
    im=Image.new('RGBA',(W,H),BG+(255,));d=ImageDraw.Draw(im);header(im,d,'CLUB AMÉRICA','Veteranos 35+ · Juventino Rosas')
    png=OUT/'_america.png'
    if cairosvg:
        try:cairosvg.svg2png(url=str(ROOT/'assets'/'branding'/'america-veteranos-35.svg'),write_to=str(png),output_width=520,output_height=520);fit_logo(im,png,(280,355,800,875))
        except:pass
    d.text((540,960),'VETERANOS 35+',font=font(42,1),fill=GOLD,anchor='mm');d.text((540,1020),'1916 · 2026',font=font(30,1),fill=WHITE,anchor='mm');d.text((540,1110),'Liga Municipal de Fútbol Juventino Rosas A.C.',font=font(22),fill=MUTED,anchor='mm');d.text((540,1180),'Plantilla lista para comunicados, jornadas y avisos.',font=font(18),fill=MUTED,anchor='mm')
    p=OUT/'comunicado-america-veteranos-35.png';im.convert('RGB').save(p,quality=94);png.unlink(missing_ok=True);return p
def main():
    made=[]
    for c in cats():
        if standings(c):made.append(str(table_card(c).relative_to(ROOT)))
        if fixtures(c):made.append(str(round_card(c).relative_to(ROOT)))
    made+=list(map(lambda p:str(p.relative_to(ROOT)),[summary('tablas',made),summary('jornada',made),america_card()]))
    idx={'build':'38-35','generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':made,'source':'data/official-live.json'}
    (OUT/'index.json').write_text(json.dumps(idx,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(idx,ensure_ascii=False))
if __name__=='__main__':main()

#!/usr/bin/env python3
# V38 FIX36 — PNG premium nocturnos: tablas, resultados y próximas jornadas con escudos/campo/fecha.
import json,re,datetime,unicodedata,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
try:
    import cairosvg
except Exception:
    cairosvg=None

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data'/'official-live.json').read_text(encoding='utf-8'))
OUT=ROOT/'publicaciones'/'latest';OUT.mkdir(parents=True,exist_ok=True)
W,H=1080,1350
NAVY=(5,12,36);NAVY2=(3,8,21);CARD=(8,20,48);CARD2=(7,25,25)
GREEN=(60,241,186);BLUE=(84,123,255);GOLD=(241,216,122);WHITE=(247,250,255);MUTED=(153,170,202);LINE=(49,73,132)
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def font(n,b=False):
    try:return ImageFont.truetype(BOLD if b else FONT,n)
    except:return ImageFont.load_default()
def norm(s):
    s=unicodedata.normalize('NFD',str(s or ''));s=''.join(c for c in s if unicodedata.category(c)!='Mn').upper()
    return re.sub(r'[^A-Z0-9+]+',' ',s).strip()
def slug(s):return re.sub(r'[^a-z0-9]+','-',norm(s).lower()).strip('-')
def cats():return sorted(DATA.get('categories',{}).values(),key=lambda c:c.get('id',0))
def rr(d,xy,r=22,fill=CARD,outline=LINE,w=2):d.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=w)

def fit_logo(im,path,box,pad=0):
    try:
        lg=Image.open(path).convert('RGBA')
        mw=max(1,box[2]-box[0]-pad*2);mh=max(1,box[3]-box[1]-pad*2)
        lg.thumbnail((mw,mh),Image.Resampling.LANCZOS)
        x=box[0]+pad+(mw-lg.width)//2;y=box[1]+pad+(mh-lg.height)//2
        im.alpha_composite(lg,(x,y));return True
    except:return False

def team_logo_path(team):
    for name,v in (DATA.get('team_logos') or {}).items():
        if norm(name)!=norm(team):continue
        if isinstance(v,dict):
            for k in ('local','path'):
                p=v.get(k)
                if p:
                    q=ROOT/str(p).lstrip('./')
                    if q.exists():return q
        elif isinstance(v,str) and not v.startswith(('http://','https://')):
            q=ROOT/v.lstrip('./')
            if q.exists():return q
    q=ROOT/'assets'/'official-logos'/f'{slug(team)}.png'
    if q.exists():return q
    aliases={'san jose fc':'san-jose-fc','san jose jrs':'san-jose-jrs','san antonio fc':'san-antonio-fc','san antonio jrs':'san-antonio-jrs','la canchita deportes':'la-canchita-deportes','toros de cuenda':'toros-de-cuenda','dep nopalero':'dep-nopalero','dep zapata':'dep-zapata','dep la luz':'dep-la-luz','dep maravillas':'dep-maravillas','franco fc':'franco-fc','lobos cdg':'lobos-cdg','tavera fc':'tavera-fc','pachangas fc':'pachangas-fc'}
    a=aliases.get(norm(team).lower())
    if a:
        q=ROOT/'assets'/'official-logos'/f'{a}.png'
        if q.exists():return q
    return None

def draw_team_logo(im,d,team,box):
    rr(d,box,16,(246,248,250),(255,255,255),1)
    p=team_logo_path(team)
    if p and fit_logo(im,p,box,7):return
    cx=(box[0]+box[2])//2;cy=(box[1]+box[3])//2
    initials=''.join(w[0] for w in str(team).split()[:2]).upper() or '?'
    d.text((cx,cy),initials,font=font(22,1),fill=(13,25,53),anchor='mm')

def background(im,d):
    g=Image.new('RGBA',(W,H),(0,0,0,0));gd=ImageDraw.Draw(g)
    for y in range(H):
        t=y/(H-1);col=tuple(int(NAVY[i]*(1-t)+NAVY2[i]*t) for i in range(3))+(255,)
        gd.line((0,y,W,y),fill=col)
    for i in range(10):
        x=70+i*118;gd.line((x,0,int(W-x*.08),H),fill=(83,121,255,44),width=2)
    for r in range(140,930,170):gd.arc((W//2-r,720-r,W//2+r,720+r),20,250,fill=(62,242,187,26),width=2)
    im.alpha_composite(g)

def header(im,d,title,sub):
    fit_logo(im,ROOT/'assets'/'liga-logo.webp',(48,40,158,150),7)
    d.text((178,66),'LIGA MUNICIPAL DE FÚTBOL',font=font(21,1),fill=GREEN)
    d.text((178,101),'JUVENTINO ROSAS A.C.',font=font(31,1),fill=WHITE)
    d.text((1015,74),datetime.date.today().strftime('%d/%m/%Y'),font=font(19,1),fill=GOLD,anchor='ra')
    d.text((55,205),title,font=font(51,1),fill=WHITE);d.text((57,268),sub,font=font(21),fill=MUTED)

def flat_blocks(c,key):
    out=[]
    for b in c.get(key,[]) or []:
        hs=b.get('headers',[])
        for r in b.get('rows',[]) or []:out.append((hs,r))
    return out
def val(hs,r,*names):
    ns=[norm(x) for x in hs]
    for name in names:
        try:i=ns.index(norm(name));return r[i] if i<len(r) else ''
        except:pass
    return ''
def standings(c):return flat_blocks(c,'standings')
def fixtures(c):
    out=[]
    for hs,r in flat_blocks(c,'fixtures'):
        goals=[r[i] if i<len(r) else '' for i,h in enumerate(hs) if norm(h)=='GOLES']
        out.append({'jornada':val(hs,r,'Jornada'),'fecha':val(hs,r,'Fecha/Hora','Fecha Hora','Fecha'),'local':val(hs,r,'Local'),'visitante':val(hs,r,'Visitante'),'campo':val(hs,r,'Campo'),'g1':goals[0] if len(goals)>0 else '','g2':goals[1] if len(goals)>1 else ''})
    return out
def is_score(v):return re.fullmatch(r'-?\d+',str(v or '').strip()) is not None
def round_number(v):
    m=re.search(r'\d+',str(v or ''));return int(m.group()) if m else 0
def pending_round(c):
    fs=fixtures(c);pend=[m for m in fs if not (is_score(m['g1']) and is_score(m['g2']))]
    if not pend:return fs[-8:]
    target=max([round_number(m['jornada']) for m in pend] or [0]);rows=[m for m in pend if round_number(m['jornada'])==target]
    return rows or pend[:8]
def result_round(c):
    done=[m for m in fixtures(c) if is_score(m['g1']) and is_score(m['g2'])]
    if not done:return []
    target=max([round_number(m['jornada']) for m in done] or [0]);rows=[m for m in done if round_number(m['jornada'])==target]
    return rows or done[-8:]

def table_card(c):
    im=Image.new('RGBA',(W,H),(0,0,0,255));d=ImageDraw.Draw(im);background(im,d);header(im,d,'TABLA DE POSICIONES',c.get('name','')+' · '+str(c.get('current_phase') or 'Torneo actual'))
    y=325;rr(d,(46,y,1034,y+62),18,(18,57,140),None,0);cols=[('#',82),('EQUIPO',156),('PJ',656),('PG',730),('PE',801),('PP',870),('DIF',936),('PTS',998)]
    for t,x in cols:d.text((x,y+31),t,font=font(16,1),fill=WHITE,anchor='lm' if t=='EQUIPO' else 'mm')
    y+=72
    for n,(hs,r) in enumerate(standings(c)[:13],1):
        rr(d,(46,y,1034,y+66),16,(12,31,64) if n>4 else (10,46,48),LINE,1);team=str(val(hs,r,'Equipo'));draw_team_logo(im,d,team,(62,y+9,110,y+57));d.text((126,y+34),str(n),font=font(16,1),fill=(126,168,255),anchor='mm');d.text((152,y+34),team,font=font(18,1),fill=WHITE,anchor='lm')
        values=[val(hs,r,'PJ','JJ'),val(hs,r,'PG','G'),val(hs,r,'PE','E'),val(hs,r,'PP','P'),val(hs,r,'DIF','DG')]
        for x,v in zip([656,730,801,870,936],values):d.text((x,y+34),str(v),font=font(17,1),fill=WHITE,anchor='mm')
        pts=str(val(hs,r,'PTS'));d.rounded_rectangle((969,y+13,1022,y+53),radius=10,fill=GOLD);d.text((995,y+33),pts,font=font(18,1),fill=(15,23,40),anchor='mm');y+=72
    d.text((55,1306),'Logo de Liga · fecha · escudos oficiales · datos públicos',font=font(15),fill=MUTED)
    p=OUT/f'tabla-{slug(c.get("name"))}.png';im.convert('RGB').save(p,quality=95);return p

def match_card(c,kind='jornada'):
    rows=pending_round(c) if kind=='jornada' else result_round(c);title='PRÓXIMA JORNADA' if kind=='jornada' else 'RESULTADOS'
    im=Image.new('RGBA',(W,H),(0,0,0,255));d=ImageDraw.Draw(im);background(im,d);header(im,d,title,c.get('name','')+' · '+str(c.get('current_phase') or 'Torneo actual'));y=330
    if not rows:d.text((540,690),'Sin partidos publicados para este filtro.',font=font(28,1),fill=MUTED,anchor='mm')
    for m in rows[:7]:
        rr(d,(48,y,1032,y+126),24,(8,20,48),LINE,2);draw_team_logo(im,d,str(m.get('local') or ''),(68,y+30,136,y+98));draw_team_logo(im,d,str(m.get('visitante') or ''),(944,y+30,1012,y+98));d.text((156,y+62),str(m.get('local') or '').upper(),font=font(19,1),fill=WHITE,anchor='lm');d.text((924,y+62),str(m.get('visitante') or '').upper(),font=font(19,1),fill=WHITE,anchor='rm')
        if kind=='resultados':center=f"{m.get('g1','')}  -  {m.get('g2','')}"
        else:
            parts=str(m.get('fecha') or '').split();center=parts[-1] if parts else '—'
        d.text((540,y+41),center,font=font(21,1),fill=GOLD,anchor='mm');d.text((540,y+73),'VS' if kind=='jornada' else 'FINAL',font=font(15,1),fill=GREEN,anchor='mm');d.text((540,y+102),str(m.get('campo') or 'Campo por confirmar'),font=font(15),fill=MUTED,anchor='mm')
        if m.get('fecha'):d.text((156,y+94),str(m.get('fecha')),font=font(11),fill=(110,130,166),anchor='lm')
        y+=142
    d.text((55,1306),'Fecha · hora · campo · nombres y logos de equipos',font=font(15),fill=MUTED)
    p=OUT/f'{kind}-{slug(c.get("name"))}.png';im.convert('RGB').save(p,quality=95);return p

def summary(kind):
    titles={'tablas':'RESUMEN DE TABLAS','jornada':'PRÓXIMA JORNADA','resultados':'RESUMEN DE RESULTADOS'};im=Image.new('RGBA',(W,H),(0,0,0,255));d=ImageDraw.Draw(im);background(im,d);header(im,d,titles[kind],'Todas las categorías con información pública');y=345
    for c in [x for x in cats() if x.get('standings') or x.get('fixtures')][:5]:
        rr(d,(58,y,1022,y+164),22,(8,24,42),LINE,2);d.text((82,y+34),c.get('name',''),font=font(24,1),fill=GREEN)
        if kind=='tablas':
            rows=standings(c);leader=val(rows[0][0],rows[0][1],'Equipo') if rows else 'Sin tabla';pts=val(rows[0][0],rows[0][1],'PTS') if rows else '';d.text((82,y+82),'Líder',font=font(15),fill=MUTED);d.text((82,y+118),leader,font=font(22,1),fill=WHITE);d.text((982,y+96),(str(pts)+' pts') if pts!='' else '—',font=font(22,1),fill=GOLD,anchor='ra')
        else:
            rs=pending_round(c) if kind=='jornada' else result_round(c);d.text((82,y+84),f'{len(rs)} partido(s)',font=font(21,1),fill=WHITE)
            if rs:
                m=rs[0];d.text((82,y+122),f"{m.get('local','')} vs {m.get('visitante','')}",font=font(15),fill=MUTED)
        y+=180
    p=OUT/f'resumen-{kind}.png';im.convert('RGB').save(p,quality=95);return p

def america_card():
    im=Image.new('RGBA',(W,H),(0,0,0,255));d=ImageDraw.Draw(im);background(im,d);header(im,d,'CLUB AMÉRICA','Veteranos 35+ · Juventino Rosas');png=OUT/'_america.png'
    if cairosvg:
        try:cairosvg.svg2png(url=str(ROOT/'assets'/'branding'/'america-veteranos-35.svg'),write_to=str(png),output_width=540,output_height=540);fit_logo(im,png,(270,350,810,890))
        except:pass
    d.text((540,970),'VETERANOS 35+',font=font(43,1),fill=GOLD,anchor='mm');d.text((540,1030),'1916 · 2026',font=font(30,1),fill=WHITE,anchor='mm');d.text((540,1120),'Liga Municipal de Fútbol Juventino Rosas A.C.',font=font(22),fill=MUTED,anchor='mm')
    p=OUT/'comunicado-america-veteranos-35.png';im.convert('RGB').save(p,quality=95);png.unlink(missing_ok=True);return p

def main():
    made=[]
    for c in cats():
        if standings(c):made.append(str(table_card(c).relative_to(ROOT)))
        if fixtures(c):
            made.append(str(match_card(c,'jornada').relative_to(ROOT)))
            if result_round(c):made.append(str(match_card(c,'resultados').relative_to(ROOT)))
    for kind in ('tablas','jornada','resultados'):made.append(str(summary(kind).relative_to(ROOT)))
    made.append(str(america_card().relative_to(ROOT)))
    idx={'build':'38-36','generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':made,'source':'data/official-live.json','style':'premium-night-tournament-team-logos-fields'}
    (OUT/'index.json').write_text(json.dumps(idx,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(idx,ensure_ascii=False))
if __name__=='__main__':main()

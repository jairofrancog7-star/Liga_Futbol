#!/usr/bin/env python3
# V38 FIX28 — sincronizador público AdminFut/Juventino Rosas.
# Solo recoge información visible públicamente: nombres deportivos, equipos,
# resultados, sanciones deportivas, tablas y logos. NO CURP/INE/domicilios.
import argparse, concurrent.futures, json, os, re, sys, time, unicodedata
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin

try:
    from bs4 import BeautifulSoup
except Exception:
    print('FALTA_DEPENDENCIA: beautifulsoup4', file=sys.stderr)
    sys.exit(22)

BASE='https://juventinorosasliga.com/'
UA={'User-Agent':'Mozilla/5.0 (compatible; LigaJR-FIX28/1.0; public-data-sync)'}
CATEGORIES={1:'Veteranos 50+',2:'Veteranos 35+',3:'Primera Fuerza',4:'Segunda Fuerza',5:'Intermedia'}
SEASONS={1:2,3:3,5:4,4:5}
CEDULA_RANGES={1:range(1,61),3:range(70,151),5:range(185,301),4:range(355,481)}

def norm(s):
    s=unicodedata.normalize('NFD',str(s or ''))
    s=''.join(c for c in s if unicodedata.category(c)!='Mn').upper()
    return re.sub(r'[^A-Z0-9]+',' ',s).strip()

def slug(s):
    return re.sub(r'[^a-z0-9]+','-',norm(s).lower()).strip('-') or 'equipo'

def get(url,binary=False):
    req=Request(url,headers=UA)
    with urlopen(req,timeout=30) as r:
        b=r.read()
        return b if binary else b.decode('utf-8','replace')

def soup_url(path):
    return BeautifulSoup(get(urljoin(BASE,path)),'html.parser')

def table_blocks(soup):
    out=[]
    for t in soup.find_all('table'):
        rows=[]
        for tr in t.find_all('tr'):
            cells=[x.get_text(' ',strip=True) for x in tr.find_all(['th','td'])]
            if cells: rows.append(cells)
        if rows: out.append({'headers':rows[0],'rows':rows[1:]})
    return out

def dashboard(cat):
    s=soup_url('?categoria='+str(cat)); text=s.get_text(' ',strip=True)
    counts={}
    for label in ['Equipos','Partidos Jugados','Partidos Pendientes','Jugadores']:
        m=re.search(r'(\d+)\s+'+re.escape(label),text,re.I)
        counts[label]=int(m.group(1)) if m else None
    ced=[]
    for a in s.find_all('a',href=True):
        m=re.search(r'/cedula-arbitral/(\d+)/',a['href'])
        if m: ced.append(int(m.group(1)))
    imgs=[]
    for img in s.find_all('img',src=True):
        src=img['src']
        if '/logos/' not in src: continue
        p=img
        txt=''
        for _ in range(5):
            p=p.parent if p else None
            if not p: break
            t=' '.join(p.get_text(' ',strip=True).split())
            if t and len(t)<140: txt=t
            if any(x in (p.get('class') or []) for x in ['match-team-col','team-card','card']): break
        imgs.append({'source':src,'near_text':txt})
    return {'counts':counts,'current_cedulas':sorted(set(ced)),'logo_candidates':imgs}

def report(path,cat,season=None):
    q='?categoria='+str(cat)
    if season is not None: q+='&temporada='+str(season)
    page=soup_url(path+q)
    blocks=table_blocks(page)
    if blocks:
        return blocks

    cards=page.select('.player-card-small')
    if path.startswith('tabla-goleo'):
        rows=[]
        for card in cards:
            name=card.select_one('.fw-bold')
            team=card.select_one('small.text-white-50')
            badge=card.select_one('.badge')
            rank_text=card.get_text(' ',strip=True)
            rank=re.search(r'#\s*(\d+)',rank_text)
            goals=re.search(r'(\d+)\s+GOLES?',badge.get_text(' ',strip=True) if badge else rank_text,re.I)
            if name and team:
                rows.append([
                    rank.group(1) if rank else '',
                    name.get_text(' ',strip=True),
                    team.get_text(' ',strip=True),
                    goals.group(1) if goals else ''
                ])
        if rows:
            return [{'headers':['#','Jugador','Equipo','Goles'],'rows':rows}]
        text=page.get_text(' ',strip=True)
        if 'No hay goles registrados' in text:
            return [{'headers':['Estado'],'rows':[['No hay goles registrados en esta temporada.']]}]

    if path.startswith('tabla-tarjetas'):
        rows=[]
        for card in cards:
            name=card.select_one('.fw-bold')
            team=card.select_one('small.text-white-50')
            badge=card.select_one('.badge')
            parent=card.find_parent(class_='card')
            parent_text=parent.get_text(' ',strip=True) if parent else ''
            kind='Roja' if 'Rojas' in parent_text else 'Amarilla' if 'Amarillas' in parent_text else 'Tarjeta'
            count=(badge.get_text(' ',strip=True) if badge else '').strip()
            if name and team:
                rows.append([kind,name.get_text(' ',strip=True),team.get_text(' ',strip=True),count])
        if rows:
            return [{'headers':['Tipo','Jugador','Equipo','Total'],'rows':rows}]
        text=page.get_text(' ',strip=True)
        status=[]
        if 'Sin tarjetas amarillas' in text: status.append(['Amarillas','Sin tarjetas amarillas.'])
        if 'Sin tarjetas rojas' in text: status.append(['Rojas','Sin tarjetas rojas.'])
        if status:
            return [{'headers':['Tipo','Estado'],'rows':status}]

    if path.startswith('tabla-castigados'):
        rows=[]
        for card in cards:
            name=card.select_one('.fw-bold')
            team=card.select_one('small.text-white-50')
            badges=card.select('.badge')
            sanction=''
            pending=''
            for b in badges:
                tx=' '.join(b.get_text(' ',strip=True).split())
                if 'Jornada' in tx and not sanction:
                    sanction=tx
            full=' '.join(card.get_text(' ',strip=True).split())
            m=re.search(r'Pendientes\s*\((\d+)\)',full,re.I)
            if m: pending=m.group(1)
            if name and team:
                rows.append([name.get_text(' ',strip=True),team.get_text(' ',strip=True),sanction,pending])
        if rows:
            return [{'headers':['Jugador','Equipo','Castigo','Pendientes'],'rows':rows}]
        text=page.get_text(' ',strip=True)
        if 'No hay jugadores castigados' in text:
            return [{'headers':['Estado'],'rows':[['No hay jugadores castigados.']]}]

    return []

def cedula(i):
    try: s=soup_url('cedula-arbitral/'+str(i)+'/')
    except Exception: return None
    title=s.title.get_text(' ',strip=True) if s.title else ''
    m=re.match(r'Cédula Arbitral\s*-\s*(.*?)\s*\((.*?)\)\s*vs\s*(.*?)\s*\((.*?)\)',title,re.I)
    if not m: return None
    local,cat1,away,cat2=[x.strip(' -') for x in m.groups()]
    tabs=table_blocks(s)
    def players(t):
        ans=[]
        if not t: return ans
        for r in t.get('rows',[]):
            if len(r)>=2 and r[1] and norm(r[1])!='JUGADOR': ans.append(r[1])
        return ans
    return {'id':i,'title':title,'local':local,'away':away,'category':cat1,
            'local_players':players(tabs[0] if len(tabs)>0 else None),
            'away_players':players(tabs[1] if len(tabs)>1 else None)}

def unique_names(seq):
    out=[]; seen=set()
    for x in seq:
        k=norm(x)
        if k and k not in seen: seen.add(k); out.append(x)
    return out

def collect_teams(category):
    teams=set(category.get('rosters',{}))
    for tab in category.get('fixtures',[]):
        for r in tab.get('rows',[]):
            if len(r)>=7: teams.update([r[2],r[6]])
    return {x for x in teams if x and x!='-'}

def map_logos(cat_id,category,dash):
    teams=collect_teams(category)
    mapped={}
    # First use nearby text.
    for item in dash.get('logo_candidates',[]):
        ntext=norm(item.get('near_text'))
        best=None
        for team in teams:
            nt=norm(team)
            if nt and nt in ntext and (best is None or len(nt)>len(norm(best))): best=team
        if best: mapped.setdefault(best,item['source'])
    # Then Cloudinary slug heuristic.
    for item in dash.get('logo_candidates',[]):
        src=item['source']
        public=src.split('/')[-1].split('_')[0]
        ns=norm(public).replace(' ','')
        for team in teams:
            nt=norm(team).replace(' ','')
            if ns and nt and (ns in nt or nt in ns): mapped.setdefault(team,src)
    return mapped


OFFICIAL_LOGO_PUBLIC_IDS={
'BOAVISTA':'Boavista_qiq0dy','MANCHESTER':'ManchesterU_zltkh0','TOROS DE CUENDA':'TorosCuenda_od8vcf',
'LA ESPERANZA':'LaEsperanzaFC_vazya7','DYNAMO':'Dinamo_rgamvy','TERRICOLAS':'Terricolas_ltbrzy',
'FRANCO FC':'FrancoFC_vtd8d7','HERRERAS FC':'HerreraFC_mnmlsd','LINCES':'Linces_l1lc7c','JUVENTUS':'Juventus_ntqr0b',
'HERMANOS':'Hermanos_kbfrmh','SAN JOSE FC':'SanJoseMonta%C3%B1a_ilen4d','LOBOS CDG':'Lobos_efloib','NAPOLI':'Napoli_cp25dv',
'ABEJAS':'Abejas_lxn6l9','DEP. NOPALERO':'Nopalero_skdsij','DEP. ZAPATA':'Dep.Zapata_a5dsaz',
'SAN JUAN FC':'SanJuanFC_jhprtf','TAPATIO':'tapatio_svt6lz','SAN ANTONIO FC':'SanAntonioFC_tw7bi1',
'CELTICOS':'CelticosFC_nv4ukd','SAN JULIAN':'SanJulianFC_wetv0z','DEP. LA LUZ':'DepLaLuz_wibidf',
'TAVERA FC':'TaveraFC_gpdbhg','PACHANGAS FC':'Pachangas_upqelg','SAN JOSE JRS':'SanJoseJR_dio2dt',
'BARZA':'Barcelona_amoaiq','MAZACOTES FC':'Mazacotes_ko8o0w','DEP. MARAVILLAS':'MAravillasFC_mnmhwx',
'POPULARES':'PopularesFC_onellt','PROMESAS FC':'PromesasFC_w4lwk8','CAPIBARAS':'Capibara_vocmbl',
'LA CUADRILLA':'CuadrillaFC_vpfbtr','LA CANCHITA DEPORTES':'LaCanchita_enf6ca','GALEANA':'Galeana_kujrh0',
'ALDAMA FC':'Aldama_mqm3r1','MALVINAS':'Malvinas_wdiwk9','OSASUNA':'Osasuna_lv6rsa',
'SAN ANTONIO JRS':'SanAntonioJR_jzmfka','LA HUERTA':'LaHuertaCuenda_bm4fxj'
}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',default='.')
    ap.add_argument('--fast',action='store_true')
    args=ap.parse_args()
    root=Path(args.root).resolve()
    data_dir=root/'data'; logos_dir=root/'assets'/'official-logos'
    data_dir.mkdir(parents=True,exist_ok=True); logos_dir.mkdir(parents=True,exist_ok=True)
    target=data_dir/'official-live.json'
    old={}
    if target.exists():
        try: old=json.loads(target.read_text(encoding='utf-8'))
        except Exception: old={}
    fast=args.fast and bool(old)
    data={'schema':1,'source':BASE,'captured_at_utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),
          'mode':'fast' if fast else 'full','categories':{},'team_logos':old.get('team_logos',{}) if fast else {},
          'notes':['Datos deportivos públicos; no se recopilan CURP, INE, domicilio ni documentos.',
                   'La fuente oficial juventinorosasliga.com prevalece sobre este snapshot.',
                   'No se inventan goles, alineaciones, estadísticas avanzadas ni sanciones.']}
    all_logo_urls={}
    for cat,name in CATEGORIES.items():
        dash=dashboard(cat)
        season=SEASONS.get(cat)
        prev=(old.get('categories') or {}).get(str(cat),{})
        c={'id':cat,'name':name,'season_id':season,'dashboard':dash,'counts':dash.get('counts',{}),
           'standings':[],'scorers':[],'cards':[],'suspensions':[],'fixtures':[],
           'rosters':prev.get('rosters',{}) if fast else {},
           'player_usage':prev.get('player_usage',{}) if fast else {},
           'cedulas':prev.get('cedulas',[]) if fast else [],
           'cedulas_scanned':prev.get('cedulas_scanned',[]) if fast else []}
        if season:
            c['standings']=report('tabla-posiciones/',cat,season)
            c['scorers']=report('tabla-goleo/',cat,season)
            c['cards']=report('tabla-tarjetas/',cat,season)
            c['suspensions']=report('tabla-castigados/',cat,season)
            c['fixtures']=report('reportes/jornadas/completo/',cat,season)
        if not fast and cat in CEDULA_RANGES:
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
                results=list(ex.map(cedula,CEDULA_RANGES[cat]))
            for x in results:
                if not x or norm(x['category'])!=norm(name): continue
                c['cedulas'].append({k:v for k,v in x.items() if k not in ['local_players','away_players']})
                c['cedulas_scanned'].append(x['id'])
                for team,key in ((x['local'],'local_players'),(x['away'],'away_players')):
                    for player in x[key]:
                        k=norm(player)
                        # La web pública tiene una variante con una "S" final en una cédula.
                        # El dashboard da 109; unificamos esa variante deportiva documentada.
                        if cat==1 and norm(team)=='LA ESPERANZA' and k=='GUMERSINDO GRANADOS RAMIREZ S':
                            player='Gumersindo Granados Ramirez'; k=norm(player)
                        c['rosters'].setdefault(team,[]).append(player)
                        u=c['player_usage'].setdefault(k,{'name':player,'team':team,'cedulas':0})
                        u['cedulas']+=1
            c['cedulas_scanned']=sorted(set(c['cedulas_scanned']))
            seen_c={}
            for x in c['cedulas']: seen_c[x['id']]=x
            c['cedulas']=[seen_c[k] for k in sorted(seen_c)]
            c['rosters']={team:unique_names(players) for team,players in c['rosters'].items()}
        c['public_player_count_scraped']=len({norm(p) for ps in c['rosters'].values() for p in ps})
        data['categories'][str(cat)]=c
        if not fast: all_logo_urls.update(map_logos(cat,c,dash))

    if not fast:
        for team,pub in OFFICIAL_LOGO_PUBLIC_IDS.items():
            all_logo_urls[team]='https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/'+pub
        # La fuente oficial muestra placeholder, no imagen, para estos clubes.
        all_logo_urls.pop('BOCA JRS',None)
        all_logo_urls.pop('GALACTICOS',None)
        manifest={}
        for team,src in sorted(all_logo_urls.items()):
            name=slug(team)+'.png'; dest=logos_dir/name
            transformed=src.replace('/image/upload/','/image/upload/f_png,q_auto/')
            try:
                b=get(transformed,binary=True)
                if len(b)>100:
                    dest.write_bytes(b)
                    manifest[team]={'local':'./assets/official-logos/'+name,'source':src}
                    continue
            except Exception: pass
            manifest[team]={'source':src}
        data['team_logos']=manifest
        all_teams=set()
        for c in data['categories'].values(): all_teams.update(collect_teams(c))
        data['missing_official_logo']=sorted(t for t in all_teams if t and t!='-' and t not in manifest)
    else:
        data['missing_official_logo']=old.get('missing_official_logo',[])

    primera=data['categories'].get('3',{})
    data['checks']={
        'primera_dashboard_players':primera.get('dashboard',{}).get('counts',{}).get('Jugadores'),
        'primera_roster_unique':primera.get('public_player_count_scraped'),
        'team_logos_known':len(data.get('team_logos',{})),
        'categories':len(data['categories'])
    }
    tmp=target.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    tmp.replace(target)
    print(json.dumps(data['checks'],ensure_ascii=False))
    if not fast and data['checks']['primera_dashboard_players'] and data['checks']['primera_roster_unique']!=data['checks']['primera_dashboard_players']:
        print('AVISO: el total registrado de Primera no coincide con los nombres reconstruidos desde cédulas públicas.',file=sys.stderr)
        # No se destruye el snapshot: un jugador registrado que aún no haya jugado puede no exponer su nombre públicamente.
    return 0

if __name__=='__main__':
    raise SystemExit(main())

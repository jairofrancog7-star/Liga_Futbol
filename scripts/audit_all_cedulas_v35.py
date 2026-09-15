#!/usr/bin/env python3
# FIX35: auditor amplio de cédulas públicas. Solo datos deportivos visibles; nunca CURP/INE/domicilios.
import argparse, concurrent.futures, json, re, unicodedata
from pathlib import Path
import requests
from bs4 import BeautifulSoup

BASE='https://www.juventinorosasliga.com/'
UA='Mozilla/5.0 (compatible; LigaJR-FIX35/1.0; public-cedula-audit)'

def norm(s):
    s=unicodedata.normalize('NFD',str(s or ''))
    s=''.join(c for c in s if unicodedata.category(c)!='Mn').upper()
    return re.sub(r'[^A-Z0-9]+',' ',s).strip()

def tables(soup):
    out=[]
    for t in soup.find_all('table'):
        rows=[]
        for tr in t.find_all('tr'):
            cells=[x.get_text(' ',strip=True) for x in tr.find_all(['th','td'])]
            if cells: rows.append(cells)
        if rows: out.append(rows)
    return out

def players(rows):
    out=[]
    for r in (rows[1:] if rows else []):
        if len(r)>=2 and r[1] and norm(r[1])!='JUGADOR': out.append(r[1].strip())
    return out

def fetch_cedula(i):
    try:
        r=requests.get(BASE+f'cedula-arbitral/{i}/',headers={'User-Agent':UA},timeout=10)
        if r.status_code!=200: return None
        s=BeautifulSoup(r.text,'html.parser')
        title=s.title.get_text(' ',strip=True) if s.title else ''
        m=re.match(r'Cédula Arbitral\s*-\s*(.*?)\s*\((.*?)\)\s*vs\s*(.*?)\s*\((.*?)\)',title,re.I)
        if not m: return None
        local,cat1,away,cat2=[x.strip(' -') for x in m.groups()]
        tb=tables(s)
        return {'id':i,'title':title,'local':local,'away':away,'category':cat1,
                'local_players':players(tb[0] if len(tb)>0 else []),
                'away_players':players(tb[1] if len(tb)>1 else [])}
    except Exception:
        return None

def unique(seq):
    out=[];seen=set()
    for x in seq:
        k=norm(x)
        if k and k not in seen: seen.add(k);out.append(x)
    return out

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',default='.');ap.add_argument('--max-id',type=int,default=650);ap.add_argument('--workers',type=int,default=8)
    a=ap.parse_args();root=Path(a.root).resolve();target=root/'data'/'official-live.json'
    data=json.loads(target.read_text(encoding='utf-8'))
    cats=data.get('categories',{});by_name={norm(c.get('name')):str(k) for k,c in cats.items()}
    found=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(a.workers,10))) as ex:
        for x in ex.map(fetch_cedula,range(1,a.max_id+1)):
            if x: found.append(x)
    bucket={k:[] for k in cats}
    for x in found:
        k=by_name.get(norm(x.get('category')))
        if k: bucket[k].append(x)
    summary={}
    for k,c in cats.items():
        xs=sorted(bucket.get(str(k),[]),key=lambda x:x['id'])
        if not xs:
            summary[c.get('name','?')]={'cedulas':0,'public_names':int(c.get('public_player_count_scraped') or 0),'kept_previous':True};continue
        rosters={};usage={};ced=[]
        for x in xs:
            ced.append({q:v for q,v in x.items() if q not in ('local_players','away_players')})
            for t,pkey in ((x['local'],'local_players'),(x['away'],'away_players')):
                for p in x[pkey]:
                    if norm(c.get('name'))=='VETERANOS 50' and norm(t)=='LA ESPERANZA' and norm(p)=='GUMERSINDO GRANADOS RAMIREZ S': p='Gumersindo Granados Ramirez'
                    rosters.setdefault(t,[]).append(p)
                    nk=norm(p);u=usage.setdefault(nk,{'name':p,'team':t,'cedulas':0});u['cedulas']+=1
        rosters={t:unique(ps) for t,ps in rosters.items()}
        new_count=len({norm(p) for ps in rosters.values() for p in ps})
        old_count=int(c.get('public_player_count_scraped') or 0)
        if new_count>=old_count:
            c['rosters']=rosters;c['player_usage']=usage;c['cedulas']=ced;c['cedulas_scanned']=[x['id'] for x in xs];c['public_player_count_scraped']=new_count
            kept=False
        else:
            kept=True
        summary[c.get('name','?')]={'cedulas':len(xs),'public_names':max(new_count,old_count),'kept_previous':kept}
    data['cedula_audit']={'build':'38-35','range':[1,a.max_id],'valid_public_cedulas':len(found),'summary':summary,'privacy':'public sports data only; no CURP/INE/address/document images'}
    target.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(data['cedula_audit'],ensure_ascii=False))
    return 0
if __name__=='__main__': raise SystemExit(main())

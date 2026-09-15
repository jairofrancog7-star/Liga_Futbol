#!/usr/bin/env python3
# FIX35: normaliza variantes documentadas del padrón público sin inventar jugadores.
import json,re,unicodedata
from pathlib import Path

def norm(s):
    s=unicodedata.normalize('NFD',str(s or ''))
    s=''.join(c for c in s if unicodedata.category(c)!='Mn').upper()
    return re.sub(r'[^A-Z0-9]+',' ',s).strip()

def unique(seq):
    out=[];seen=set()
    for x in seq:
        k=norm(x)
        if k and k not in seen:
            seen.add(k);out.append(x)
    return out

def main():
    root=Path(__file__).resolve().parents[1]
    target=root/'data'/'official-live.json'
    d=json.loads(target.read_text(encoding='utf-8'))
    for c in d.get('categories',{}).values():
        roster=c.get('rosters') or {}
        if norm(c.get('name'))=='VETERANOS 50':
            fixed={}
            for team,players in roster.items():
                arr=[]
                for p in players or []:
                    if norm(team)=='LA ESPERANZA' and norm(p)=='GUMERSINDO GRANADOS RAMIREZ S':
                        p='Gumersindo Granados Ramirez'
                    arr.append(p)
                fixed[team]=unique(arr)
            c['rosters']=fixed
        c['public_player_count_scraped']=len({norm(p) for ps in (c.get('rosters') or {}).values() for p in ps if norm(p)})
    audit=d.get('cedula_audit')
    if isinstance(audit,dict):
        summary=audit.get('summary') or {}
        for c in d.get('categories',{}).values():
            name=c.get('name','')
            if name in summary:
                summary[name]['public_names']=int(c.get('public_player_count_scraped') or 0)
    target.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
    print({c.get('name'):c.get('public_player_count_scraped') for c in d.get('categories',{}).values()})
if __name__=='__main__': main()

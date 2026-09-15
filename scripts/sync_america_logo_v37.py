#!/usr/bin/env python3
# FIX37: descarga el logo exacto que el usuario proporcionó y valida sus bytes.
import hashlib, pathlib, requests
URL='https://d2ol7oe51mr4n9.cloudfront.net/user_3JFWXON60GMBOz1CiR5CypSau9I/e472c275-02fa-4c45-a8f7-7bd4d7bbb5be.png'
EXPECTED='fdf8aaeee407737ff1dcac373c43fb721cd0cf804fa11aa3abfb356260fb11d6'
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'/'branding'/'america-veteranos-35-user.png'
OUT.parent.mkdir(parents=True,exist_ok=True)
r=requests.get(URL,timeout=30)
r.raise_for_status()
data=r.content
got=hashlib.sha256(data).hexdigest()
if got!=EXPECTED:
    raise SystemExit(f'Logo America no coincide. SHA256 {got}')
OUT.write_bytes(data)
print(f'Logo America exacto OK: {OUT} {len(data)} bytes SHA256 {got}')

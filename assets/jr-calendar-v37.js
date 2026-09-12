/* Adapted from World Cup 2026 Dashboard, MIT, Steven Hatch (2026).
 * Original and license: vendor/world-cup-dashboard/. Liga JR: UTC dates,
 * safe text escaping and UTF-8 folding; no invented fixture dates. */
(function(root){
  'use strict';
  const stamp=date=>new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const esc=s=>String(s??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/[;,]/g,c=>'\\'+c);
  function fold(line){
    let result='',chunk='',bytes=0;
    for(const char of line){const size=new TextEncoder().encode(char).length;
      if(bytes+size>73){result+=chunk+'\r\n';chunk=' ';bytes=1;}chunk+=char;bytes+=size;
    }return result+chunk;
  }
  function buildICS(games,now=Date.now()){
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//V37//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Liga Juventino Rosas'];
    games.filter(g=>Number.isFinite(Date.parse(g.kickoff))&&['scheduled','delayed'].includes(g.status)).forEach(g=>{
      const start=Date.parse(g.kickoff);
      lines.push('BEGIN:VEVENT',fold('UID:'+esc(g.id)+'@liga-jr'), 'DTSTAMP:'+stamp(now),'DTSTART:'+stamp(start),'DTEND:'+stamp(start+7200000),
        fold('SUMMARY:'+esc(g.home+' vs '+g.away)),fold('LOCATION:'+esc(g.field)),fold('DESCRIPTION:'+esc(g.category+'. '+(g.note||'Consulta el estado del campo antes de salir.'))),'END:VEVENT');
    });return lines.concat('END:VCALENDAR','').join('\r\n');
  }
  function download(games){
    const a=document.createElement('a'),url=URL.createObjectURL(new Blob([buildICS(games)],{type:'text/calendar;charset=utf-8'}));
    a.href=url;a.download='liga-jr-partidos.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  root.JRCalendarV37={buildICS,download};if(typeof module!=='undefined')module.exports={buildICS,fold,esc};
})(typeof window!=='undefined'?window:globalThis);

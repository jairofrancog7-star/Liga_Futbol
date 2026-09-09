/* MASTER V22 - organización real de liga */
(function(){
  "use strict";
  const CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
  const RULES="./docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf";
  const FB="https://www.facebook.com/share/1CZyigFDwR/";
  let deferredInstall=null;

  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const data=()=>window.LJR_V20||window.LJR_V20_API?.data||null;
  const activeCat=()=>window.LJR_V20_API?.getCategory?.()||localStorage.getItem("jrCategory")||"Veteranos 35+";

  function go(view){
    try{
      if(typeof window.showView==="function"){window.showView(view);return}
      q(`[data-view="${view}"]`)?.click();
    }catch(e){}
  }

  function modal(){
    let bg=q("#v22Modal");
    if(bg) return bg;
    bg=document.createElement("div");
    bg.id="v22Modal";bg.className="v22-modal-backdrop";
    bg.innerHTML=`<div class="v22-modal" role="dialog" aria-modal="true">
      <div class="v22-modal-head"><h3 id="v22ModalTitle">Liga Juventino Rosas</h3><button class="v22-modal-close" aria-label="Cerrar">✕</button></div>
      <div id="v22ModalBody"></div>
    </div>`;
    document.body.appendChild(bg);
    bg.querySelector(".v22-modal-close").onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};
    return bg;
  }
  function openModal(title,html){
    const bg=modal();
    q("#v22ModalTitle",bg).textContent=title;
    q("#v22ModalBody",bg).innerHTML=html;
    bg.classList.add("show");
    return bg;
  }

  function fixMainFinalVideo(){
    // Hide/remove duplicate V21 sections; leave just the full video in the main home block.
    ["#v21FinalVideoTeams","#v21FinalVideoMatches"].forEach(sel=>q(sel)?.remove());
    const sec=q("#v21FinalVideoHome");
    if(!sec) return;
    const v=q("video",sec);
    if(v){
      v.style.aspectRatio="4 / 5";
      v.style.objectFit="contain";
      v.style.height="auto";
      v.removeAttribute("poster");
      v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.controls=true;
      v.play().catch(()=>{});
    }
    // Make copy appear under the video, not at its side.
    q(".v21-final-copy",sec)?.querySelector("h2")?.replaceChildren(document.createTextNode("Video completo de la Gran Final"));
  }

  function mediaItems(kind){
    if(kind==="Cuartos de final") return [
      ["./media/cuartos-pozos-psv.mp4","Pozos FC vs PSV","Cuartos de final · Veteranos 35+"],
      ["./media/cuartos-boavista-cuenda.mp4","Boavista vs Cuenda","Cuartos de final · Veteranos 35+"]
    ];
    if(kind==="Semifinales") return [
      ["./media/semifinal-boavista-cerrito.mp4","Boavista vs C. de Gasca","Semifinal · 3:00 pm · Campo 1"],
      ["./media/semifinal-juventus-pozos.mp4","Juventus vs Pozos FC","Semifinal · 5:00 pm · Campo 1"]
    ];
    return [
      ["./media/gran-final-veteranos-35.mp4","C. de Gasca vs Pozos FC","Gran Final · 12 septiembre 2026 · 4:00 pm · Campo 1"]
    ];
  }

  function openMedia(kind){
    const rows=mediaItems(kind).map(([src,title,desc])=>`
      <article class="v22-video-item">
        <video controls playsinline preload="metadata" src="${src}"></video>
        <h4>${esc(title)}</h4><p>${esc(desc)}</p>
      </article>`).join("");
    openModal(kind,`<div class="v22-video-list">${rows}</div>
      <div class="v22-form-actions"><a class="primary-btn" href="${FB}" target="_blank" rel="noopener">Facebook oficial ↗</a></div>`);
  }

  function wireMediaCards(){
    const media=q("#view-media");
    if(!media) return;
    qa(".card",media).forEach(card=>{
      const h=card.querySelector("h3");
      if(!h) return;
      const t=h.textContent.trim();
      if(!["Cuartos de final","Semifinales","Finales"].includes(t)) return;
      card.classList.add("v22-media-card");
      card.tabIndex=0;
      card.onclick=()=>openMedia(t);
      card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openMedia(t)}};
      const p=card.querySelector("p");
      if(p) p.textContent=t==="Finales"?"Ver video completo de la Gran Final.":"Abrir videos guardados de esta fase.";
    });
  }

  function fixBracket(){
    const view=q("#view-cup");
    if(!view) return;
    const bracket=view.querySelector(".bracket-inner");
    if(!bracket) return;
    bracket.innerHTML=`
      <div class="round v22-bracket-stage">
        <h4>Cuartos</h4>
        <div class="v22-bracket-game"><b>C. de Gasca vs F. Tavera</b>Clasificó: C. de Gasca</div>
        <div class="v22-bracket-game"><b>Juventus vs A. Santiago</b>Clasificó: Juventus</div>
        <div class="v22-bracket-game"><b>Pozos FC vs PSV</b>Clasificó: Pozos FC</div>
        <div class="v22-bracket-game"><b>Cuenda vs Boavista</b>Clasificó: Boavista</div>
      </div>
      <div class="connector"></div>
      <div class="round v22-bracket-stage">
        <h4>Semifinales</h4>
        <div class="v22-bracket-game"><b>C. de Gasca vs Boavista</b>Clasificó: C. de Gasca</div>
        <div class="v22-bracket-game"><b>Juventus vs Pozos FC</b>Clasificó: Pozos FC</div>
      </div>
      <div class="connector"></div>
      <div class="round v22-bracket-stage">
        <h4>Final</h4>
        <div class="v22-bracket-game"><b>C. de Gasca vs Pozos FC</b>4:00 pm · Campo 1</div>
        <div class="bracket-card champion">
          <div class="eyebrow" style="color:var(--gold)">🏆 Campeón</div>
          <h3 class="v22-tbd" style="margin:8px 0 0">Por determinar</h3>
        </div>
      </div>`;
    const note=document.createElement("p");
    note.className="v22-bracket-note";
    note.textContent="No se publica campeón hasta que exista resultado oficial de la final.";
    bracket.parentElement.appendChild(note);
  }

  function installAccessHub(){
    const more=q("#view-more");
    if(!more || q("#v22AccessHub")) return;
    const hub=document.createElement("section");
    hub.id="v22AccessHub";hub.className="v22-access";
    hub.innerHTML=`<div class="eyebrow">Acceso</div><h3>Entrar a Liga Juventino Rosas</h3>
      <div class="v22-access-grid">
        <button class="v22-access-card" data-v22-access="guest"><span class="v22-access-icon">👁️</span><strong>Ver como visitante</strong><small>Consulta partidos, calendarios, equipos, tabla, videos y reglamento.</small></button>
        <button class="v22-access-card" data-v22-access="register"><span class="v22-access-icon">🔔</span><strong>Registrarse y recibir notificaciones</strong><small>Guarda tu categoría/equipo favorito en este dispositivo y activa avisos del navegador.</small></button>
        <button class="v22-access-card" data-v22-access="admin"><span class="v22-access-icon">🛠️</span><strong>Administrar la liga</strong><small>Abre JR Control para jugadores, equipos, calendarios, sanciones, árbitros, actas y reportes.</small></button>
      </div>`;
    more.insertBefore(hub,more.firstChild?.nextSibling||null);

    hub.querySelector('[data-v22-access="guest"]').onclick=()=>{
      localStorage.setItem("jrAccessMode","guest");
      go("home");
    };
    hub.querySelector('[data-v22-access="admin"]').onclick=()=>{
      localStorage.setItem("jrAccessMode","admin-local");
      go("admin");
    };
    hub.querySelector('[data-v22-access="register"]').onclick=openRegister;
  }

  function openRegister(){
    const d=data();
    const cat=activeCat();
    const teams=(d?.rosters?.[cat]||[]).map(t=>t.name);
    const bg=openModal("Registrarse y recibir notificaciones",`
      <p style="color:var(--muted);font-size:12px">Registro local de esta versión. No sustituye una cuenta segura de Supabase cuando se conecte producción.</p>
      <div class="v22-form-grid">
        <div class="v22-field"><label>Nombre</label><input id="v22RegName" placeholder="Tu nombre"></div>
        <div class="v22-field"><label>Correo (opcional)</label><input id="v22RegEmail" type="email" placeholder="correo@ejemplo.com"></div>
        <div class="v22-field"><label>Categoría favorita</label><select id="v22RegCat">${CATS.map(c=>`<option ${c===cat?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
        <div class="v22-field"><label>Equipo favorito</label><select id="v22RegTeam">${teams.map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
      </div>
      <div class="v22-form-actions"><button class="primary-btn" id="v22SaveReg">Guardar y activar avisos</button><button class="ghost-btn" id="v22CancelReg">Cancelar</button></div>`);
    const catSel=q("#v22RegCat",bg), teamSel=q("#v22RegTeam",bg);
    catSel.onchange=()=>{
      const names=(d?.rosters?.[catSel.value]||[]).map(t=>t.name);
      teamSel.innerHTML=names.map(t=>`<option>${esc(t)}</option>`).join("");
    };
    q("#v22CancelReg",bg).onclick=()=>bg.classList.remove("show");
    q("#v22SaveReg",bg).onclick=async()=>{
      const profile={
        name:q("#v22RegName",bg).value.trim(),
        email:q("#v22RegEmail",bg).value.trim(),
        category:catSel.value,team:teamSel.value,createdAt:new Date().toISOString()
      };
      if(!profile.name){alert("Escribe tu nombre.");return}
      localStorage.setItem("jrSupporterProfile",JSON.stringify(profile));
      localStorage.setItem("jrAccessMode","registered-local");
      try{
        if("Notification" in window && Notification.permission==="default"){
          await Notification.requestPermission();
        }
      }catch(e){}
      bg.classList.remove("show");
      go("home");
    };
  }

  function wirePWA(){
    window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e});
    const btn=q("#installHint");
    if(!btn) return;
    btn.onclick=async()=>{
      const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone=window.matchMedia("(display-mode: standalone)").matches || navigator.standalone===true;
      if(standalone){
        openModal("Aplicación instalada","<p>La Liga Juventino Rosas ya está abierta como aplicación/acceso directo.</p>");
        return;
      }
      if(deferredInstall){
        deferredInstall.prompt();
        try{await deferredInstall.userChoice}catch(e){}
        deferredInstall=null;return;
      }
      if(isIOS){
        openModal("Instalar en iPhone / iPad",`<div class="v22-pwa-box">
          <div class="v22-pwa-platform"><b>Safari en iOS</b><p>1. Abre esta página en Safari.<br>2. Toca Compartir.<br>3. Toca “Agregar a pantalla de inicio”.<br>4. Confirma “Agregar”.</p></div>
        </div>`);
      }else{
        openModal("Instalar en Android / computadora",`<div class="v22-pwa-box">
          <div class="v22-pwa-platform"><b>Chrome / Edge</b><p>Busca “Instalar aplicación” o “Agregar a pantalla de inicio” en el menú del navegador. La página ya incluye manifest y modo standalone.</p></div>
        </div>`);
      }
    };
  }

  function installRules(){
    const panel=q("#admin-rules");
    if(panel){
      panel.innerHTML=`<div class="section-title"><div><div class="eyebrow">Documento oficial</div><h3>Reglamento 2026–2027</h3></div></div>
        <div class="card v22-rules-card">
          <div class="v22-rules-actions">
            <a class="primary-btn" href="${RULES}" target="_blank" rel="noopener">Abrir reglamento PDF</a>
            <a class="ghost-btn" href="${RULES}" download>Descargar PDF</a>
          </div>
          <iframe class="v22-rules-frame" src="${RULES}#view=FitH" title="Reglamento de Liga Juventino Rosas"></iframe>
        </div>`;
    }
    const more=q("#view-more .more-grid");
    if(more && !q("#v22PublicRules")){
      const b=document.createElement("button");
      b.className="more-link";b.id="v22PublicRules";
      b.innerHTML="<span>📘</span><b>Reglamento oficial</b>";
      b.onclick=()=>window.open(RULES,"_blank","noopener");
      more.appendChild(b);
    }
  }

  function adminClickContains(text){
    const btn=qa("#adminMenu button").find(b=>norm(b.textContent).includes(norm(text)));
    if(btn){go("admin");setTimeout(()=>btn.click(),80)}
  }

  function reportCurrentCategory(){
    const d=data(), cat=activeCat();
    const bulletins=[...(d?.bulletins||[])].sort((a,b)=>a.order-b.order);
    const latest=bulletins.find(b=>b.groups.some(g=>g.category===cat));
    if(!latest){alert("No hay jornada registrada.");return}
    const groups=latest.groups.filter(g=>g.category===cat);
    const rows=groups.flatMap(g=>g.games.map(x=>({...x,title:g.title})));
    const w=window.open("","_blank");
    if(!w) return;
    w.document.write(`<title>Reporte ${esc(cat)}</title><div class="v22-report">
      <h1>Liga Municipal de Fútbol Juventino Rosas A.C.</h1><h2>${esc(cat)} · ${esc(groups[0]?.title||latest.title)}</h2>
      <p>Reporte de programación generado desde JR Control.</p>
      <table><thead><tr><th>Local</th><th>Visitante</th><th>Hora</th><th>Campo / nota</th></tr></thead><tbody>
      ${rows.map(r=>r.rest?`<tr><td colspan="4">DESCANSA: ${esc(r.rest)}</td></tr>`:`<tr><td>${esc(r.home)}</td><td>${esc(r.away)}</td><td>${esc(r.time||"—")}</td><td>${esc(r.note||r.field||"—")}</td></tr>`).join("")}
      </tbody></table><p><button onclick="window.print()">Imprimir / Guardar PDF</button></p></div>`);
    w.document.close();
  }

  function printableMatchSheet(){
    const d=data(),cat=activeCat();
    const teams=(d?.rosters?.[cat]||[]).map(t=>t.name);
    openModal("Acta de partido",`<p style="color:var(--muted);font-size:12px">Plantilla imprimible. Selecciona equipos y después usa Imprimir/Guardar PDF.</p>
      <div class="v22-form-grid">
        <div class="v22-field"><label>Local</label><select id="v22ActaHome">${teams.map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
        <div class="v22-field"><label>Visitante</label><select id="v22ActaAway">${teams.map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
        <div class="v22-field"><label>Campo</label><input id="v22ActaField" placeholder="Campo"></div>
        <div class="v22-field"><label>Hora</label><input id="v22ActaTime" placeholder="Hora"></div>
      </div>
      <div class="v22-form-actions"><button class="primary-btn" id="v22PrintActa">Generar acta</button></div>`);
    q("#v22PrintActa").onclick=()=>{
      const home=q("#v22ActaHome").value,away=q("#v22ActaAway").value,field=q("#v22ActaField").value,time=q("#v22ActaTime").value;
      const w=window.open("","_blank");if(!w)return;
      w.document.write(`<title>Acta ${esc(home)} vs ${esc(away)}</title><div style="font-family:Arial;padding:30px;color:#111">
        <h1>Liga Municipal de Fútbol Juventino Rosas A.C.</h1><h2>Acta de partido · ${esc(cat)}</h2>
        <p><b>${esc(home)} vs ${esc(away)}</b> · ${esc(time||"Hora pendiente")} · ${esc(field||"Campo pendiente")}</p>
        <hr><h3>Alineaciones</h3><div style="height:220px;border:1px solid #999"></div>
        <h3>Goles / tarjetas / cambios / incidencias</h3><div style="height:320px;border:1px solid #999"></div>
        <h3>Árbitros y firmas</h3><div style="height:130px;border:1px solid #999"></div>
        <p><button onclick="window.print()">Imprimir / Guardar PDF</button></p></div>`);
      w.document.close();
    };
  }

  function installAdminHub(){
    const admin=q("#view-admin");
    if(!admin || q("#v22AdminHub")) return;
    const shell=q(".admin-shell",admin);
    const hub=document.createElement("section");
    hub.id="v22AdminHub";hub.className="v22-admin-hub";
    hub.innerHTML=`<div class="eyebrow">JR Control · Organización</div><h3>Centro de control de jornada</h3>
      <p style="color:var(--muted);font-size:12px">Checklist local para no olvidar publicaciones, árbitros, sanciones, campos, actas y respaldo.</p>
      <div class="v22-admin-kpis">
        <div class="v22-admin-kpi"><b>5</b><small>Categorías activas</small></div>
        <div class="v22-admin-kpi"><b>1</b><small>Final por jugar</small></div>
        <div class="v22-admin-kpi"><b>J6/J5</b><small>Copa actual</small></div>
        <div class="v22-admin-kpi"><b>PDF</b><small>Reglamento cargado</small></div>
      </div>
      <div class="v22-admin-checklist">
        ${["Publicar jornada actual","Revisar conflictos de campo","Asignar árbitros y oficiales","Revisar sanciones vigentes","Preparar actas de partidos","Publicar cambio de horario/campo","Respaldar datos antes de editar","Cerrar resultados y revisar tabla"].map((t,i)=>`<label class="v22-check"><input type="checkbox" data-v22-check="${i}"><span>${esc(t)}</span></label>`).join("")}
      </div>
      <div class="v22-admin-actions">
        <button class="v22-admin-action" data-v22-admin-go="calendar">📅 Calendario</button>
        <button class="v22-admin-action" data-v22-admin-go="árbitros">🧑‍⚖️ Árbitros</button>
        <button class="v22-admin-action" data-v22-admin-go="sanciones">🟥 Sanciones</button>
        <button class="v22-admin-action" data-v22-admin-go="campos">🏟️ Campos</button>
        <button class="v22-admin-action" id="v22AdminReport">📄 Reporte de jornada</button>
        <button class="v22-admin-action" id="v22AdminActa">📋 Acta de partido</button>
        <button class="v22-admin-action" data-v22-admin-go="reglamento">📘 Reglamento</button>
      </div>`;
    if(shell) admin.insertBefore(hub,shell); else admin.prepend(hub);

    qa("[data-v22-check]",hub).forEach(ch=>{
      const key="jrAdminCheck-"+ch.dataset.v22Check;
      ch.checked=localStorage.getItem(key)==="1";
      ch.onchange=()=>localStorage.setItem(key,ch.checked?"1":"0");
    });
    qa("[data-v22-admin-go]",hub).forEach(b=>b.onclick=()=>adminClickContains(b.dataset.v22AdminGo));
    q("#v22AdminReport",hub).onclick=reportCurrentCategory;
    q("#v22AdminActa",hub).onclick=printableMatchSheet;
  }

  function wireOldReportButtons(){
    // Replace "not available in database" placeholders with useful local output.
    qa("button").forEach(b=>{
      const t=norm(b.textContent);
      if(t.includes("reporte de jornada")) b.onclick=reportCurrentCategory;
      if(t.includes("acta de partido")) b.onclick=printableMatchSheet;
    });
  }

  function tableSourceNote(){
    const table=q("#view-table");
    if(!table || q("#v22TableSource")) return;
    const note=document.createElement("div");
    note.id="v22TableSource";note.className="v22-table-source";
    note.innerHTML=`<b>Tablas oficiales recibidas:</b> actualmente está capturada la tabla de Veteranos 35+ (17 juegos). Para las demás categorías se muestran sus jornadas oficiales, pero no se inventan puntos si no hay una tabla general recibida.`;
    const title=q(".section-title",table);
    title?.insertAdjacentElement("afterend",note);
  }

  function mutationGuard(){
    const mo=new MutationObserver(()=>{
      q("#v21FinalVideoTeams")?.remove();
      q("#v21FinalVideoMatches")?.remove();
      fixMainFinalVideo();
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  function boot(){
    fixMainFinalVideo();
    wireMediaCards();
    fixBracket();
    installAccessHub();
    wirePWA();
    installRules();
    installAdminHub();
    wireOldReportButtons();
    tableSourceNote();
    mutationGuard();

    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("./sw.js?v=22",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,60));
  else setTimeout(boot,60);
})();
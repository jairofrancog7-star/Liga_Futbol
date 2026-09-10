/* MASTER V21 - botones funcionales + calendario PNG + video de final */
(function(){
  "use strict";

  const CATEGORIES=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
  let activeCategory="Veteranos 35+";
  let statusFilter="Todos";
  let searchFilter="";

  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

  function api(){return window.LJR_V20_API||null}
  function data(){return window.LJR_V20||window.LJR_V20_API?.data||null}

  function currentView(){
    return document.querySelector(".view.active")?.id||"view-home";
  }

  function showView(view){
    try{
      if(typeof window.showView==="function"){window.showView(view);return}
      if(typeof showViewSafe==="function"){showViewSafe(view);return}
      const button=document.querySelector(`[data-view="${view}"]`);
      if(button) button.click();
    }catch(e){}
  }

  function syncActiveClasses(){
    document.querySelectorAll("[data-category]").forEach(el=>{
      el.classList.toggle("active",el.dataset.category===activeCategory);
    });
    document.querySelectorAll("[data-v20-cat]").forEach(el=>{
      el.classList.toggle("active",el.dataset.v20Cat===activeCategory);
    });
    document.querySelectorAll("[data-v21-cat]").forEach(el=>{
      el.classList.toggle("active",el.dataset.v21Cat===activeCategory);
    });
    document.querySelectorAll(".categoryText").forEach(el=>el.textContent=activeCategory);
  }

  function chooseCategory(cat,opts={}){
    if(!CATEGORIES.includes(cat)) return;
    activeCategory=cat;
    try{localStorage.setItem("jrCategory",cat)}catch(e){}
    if(api()) api().setCategory(cat);
    try{
      if(typeof currentCategory!=="undefined") currentCategory=cat;
    }catch(e){}
    syncActiveClasses();
    renderArchives();
    installFinalVideo();
    if(currentView()==="view-table") api()?.renderStandings?.();
    if(currentView()==="view-teams") api()?.renderTeams?.();
    if(opts.navigate){
      showView(opts.navigate);
      setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),60);
    }
  }

  function categoryTabs(){
    return `<div class="v21-category-tabs">${CATEGORIES.map(cat=>
      `<button type="button" data-v21-cat="${esc(cat)}" class="${cat===activeCategory?'active':''}">${esc(cat)}</button>`
    ).join("")}</div>`;
  }

  function wireGlobalCategoryButtons(){
    // Override the original top chips using capture, so the V20 category and old category stay in sync.
    document.addEventListener("click",e=>{
      const chip=e.target.closest("[data-category]");
      if(!chip) return;
      const cat=chip.dataset.category;
      if(!CATEGORIES.includes(cat)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      chooseCategory(cat);
    },true);

    document.addEventListener("click",e=>{
      const b=e.target.closest("[data-v21-cat]");
      if(!b) return;
      e.preventDefault();
      chooseCategory(b.dataset.v21Cat);
    });
  }

  function fixTicker(){
    const track=document.querySelector("#v14CinematicHero .v14-track");
    if(!track) return;
    track.innerHTML=`
      <span class="v21-ticker-link" tabindex="0" data-v21-go="matches"><b>GRAN FINAL</b> · C. DE GASCA VS POZOS FC · 04:00 · CAMPO 1</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Primera Fuerza">PRIMERA FUERZA · COPA J5</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Intermedia">INTERMEDIA · COPA J5</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Segunda Fuerza">SEGUNDA FUERZA · COPA J5</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Veteranos 35+">VETERANOS 35+ · FINAL</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Veteranos 50+">VETERANOS 50+ · COPA J6</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-go="matches"><b>GRAN FINAL</b> · C. DE GASCA VS POZOS FC · 04:00 · CAMPO 1</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Primera Fuerza">PRIMERA FUERZA · COPA J5</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Intermedia">INTERMEDIA · COPA J5</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Segunda Fuerza">SEGUNDA FUERZA · COPA J5</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Veteranos 35+">VETERANOS 35+ · FINAL</span>
      <span class="v21-ticker-link" tabindex="0" data-v21-ticker-cat="Veteranos 50+">VETERANOS 50+ · COPA J6</span>`;

    const activate=el=>{
      if(el.dataset.v21TickerCat){
        chooseCategory(el.dataset.v21TickerCat,{navigate:"teams"});
      }else{
        chooseCategory("Veteranos 35+");
        showView("matches");
        setTimeout(()=>document.getElementById("v21FinalVideoMatches")?.scrollIntoView({behavior:"smooth",block:"start"}),100);
      }
    };
    track.querySelectorAll(".v21-ticker-link").forEach(el=>{
      el.onclick=()=>activate(el);
      el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate(el)}};
    });
  }

  const TEAM_LOGOS_V32={
    "c. de gasca":"./assets/teams/deportivo-cg.webp",
    "pozos fc":"./assets/teams/pozos-fc.webp",
    "juventus":"./assets/teams/juventus.webp",
    "boavista":"./assets/teams/boavista-fc.webp",
    "psv":"./assets/teams/psv.webp",
    "a. santiago":"./assets/teams/atletico-santiago.webp",
    "f. tavera":"./assets/teams/franco-tavera-jr-veteranos.webp",
    "hermanos":"./assets/teams/club-deportivo-hermanos.webp",
    "linces":"./assets/teams/linces.webp",
    "lobos cdg":"./assets/teams/lobos-cdg.webp",
    "franco fc":"./assets/teams/franco-fc.webp",
    "terricolas":"./assets/teams/terricolas-fc.webp",
    "galacticos":"./assets/teams/galacticos-pozos.webp",
    "herreras fc":"./assets/teams/herrera-fc.webp",
    "galeana":"./assets/teams/atletico-galeana.webp",
    "aldama fc":"./assets/teams/aldama.webp",
    "la canchita deportes":"./assets/teams/la-canchita.webp",
    "la huerta":"./assets/teams/la-huerta-cuenda.webp",
    "san antonio jrs":"./assets/teams/san-antonio-jr.webp",
    "promesas fc":"./assets/teams/promesas-fc-pozos.webp",
    "san jose jrs":"./assets/teams/san-jose-jr.webp",
    "san jose fc":"./assets/teams/san-jose.webp",
    "san julian":"./assets/teams/san-julian-fc.webp",
    "tavera fc":"./assets/teams/tavera-fc.webp",
    "dep. nopalero":"./assets/teams/deportivo-nopalero.webp",
    "la esperanza":"./assets/teams/la-esperanza-fc.webp",
    "manchester":"./assets/teams/manchester-united.webp",
    "toros de cuenda":"./assets/teams/tc-cuenda.webp"
  };

  function teamLogoSrcV32(name,category){
    const key=norm(name);
    if(key==="pozos fc" && category==="Veteranos 35+") return "./assets/teams/veteranos-pozos-fc.webp";
    return TEAM_LOGOS_V32[key]||"";
  }

  function teamBadgeV32(name,category){
    const src=teamLogoSrcV32(name,category);
    if(!src) return `<span class="v32-team-inline" data-jr31-team="${esc(name)}"><span>${esc(name)}</span></span>`;
    return `<span class="v32-team-inline" data-jr31-team="${esc(name)}"><img class="v32-team-logo" src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()"><span>${esc(name)}</span></span>`;
  }
  function gameState(g){
    if(g.live===true) return "En vivo";
    if(g.note && /^gana\b/i.test(g.note.trim())) return "Finalizados";
    return "Próximos";
  }

  function gameMatches(g){
    if(g.rest){
      return statusFilter==="Todos" && (!searchFilter || norm(g.rest).includes(norm(searchFilter)));
    }
    if(statusFilter!=="Todos" && gameState(g)!==statusFilter) return false;
    if(searchFilter){
      const q=norm(searchFilter);
      if(!norm(g.home).includes(q) && !norm(g.away).includes(q) && !norm(g.field).includes(q)) return false;
    }
    return true;
  }

  function filteredGroups(bulletin,category){
    const cats=category==="Todas"?null:new Set([category]);
    return bulletin.groups.map(group=>{
      if(cats && !cats.has(group.category)) return null;
      // Amistosos only appear when "Todas" is explicitly selected.
      if(group.category==="Amistosos" && category!=="Todas") return null;
      const games=group.games.filter(gameMatches);
      if(!games.length) return null;
      return {...group,games};
    }).filter(Boolean);
  }

  function gameRow(g,category){
    if(g.rest) return `<div class="v20-rest">DESCANSA: <b>${esc(g.rest)}</b></div>`;
    const state=gameState(g);
    return `<div class="v20-game" data-v21-state="${esc(state)}">
      <span class="v20-team-name">${teamBadgeV32(g.home,category)}</span><b>VS</b>
      <span class="v20-team-name">${teamBadgeV32(g.away,category)}</span>
      <span class="v20-time">${esc(g.time||"—")}</span>
      <span class="v20-field">${esc(g.field||g.note||"—")}</span>
      ${g.note?`<small>${esc(g.note)}</small>`:""}
    </div>`;
  }

  function groupCard(group,bulletinId){
    return `<section class="v20-sheet-group">
      <div class="v20-group-head">
        <span>${esc(group.category)}</span>
        <div class="v21-group-head-right">
          <b>${esc(group.title)}</b>
          <button type="button" class="v21-group-download" data-v21-group-download="${esc(bulletinId)}" data-v21-group-category="${esc(group.category)}">Descargar PNG</button>
        </div>
      </div>
      <div class="v20-game-head"><span>Local</span><span></span><span>Visitante</span><span>Hora</span><span>Campo / nota</span></div>
      ${group.games.map(g=>gameRow(g,group.category)).join("")}
    </section>`;
  }

  function bulletinCard(b,category){
    const groups=filteredGroups(b,category);
    if(!groups.length) return "";
    return `<article class="v20-calendar-sheet color-${esc(b.color)}" data-v21-bulletin="${esc(b.id)}">
      <div class="v20-sheet-head">
        <div><span class="v20-sheet-label">${esc(b.label)}</span><h3>${esc(b.title)}</h3><p>${esc(b.subtitle)}</p></div>
        <div class="v21-toolbar-actions">
          <button type="button" class="v21-download-btn v21-sheet-download" data-v21-sheet-download="${esc(b.id)}">Descargar imagen</button>
          <span class="v20-sheet-order">#${b.order}</span>
        </div>
      </div>
      ${groups.map(g=>groupCard(g,b.id)).join("")}
    </article>`;
  }

  function archiveMarkup(kind){
    const d=data();
    if(!d) return "";
    const category=activeCategory;
    const bulletins=[...d.bulletins].sort((a,b)=>a.order-b.order);
    const cards=bulletins.map(b=>bulletinCard(b,category)).filter(Boolean).join("");
    return `<div class="v20-calendar-toolbar">
      <div>
        <div class="eyebrow">Calendario oficial · ${esc(category)}</div>
        <h2>Más actual → más antiguo</h2>
        <p>Programaciones clasificadas por categoría. Usa los botones para descargar una imagen y compartirla con jugadores.</p>
      </div>
      <div class="v21-toolbar-actions">
        <select class="search v21-calendar-category" style="max-width:210px" aria-label="Elegir categoría">
          ${CATEGORIES.map(c=>`<option ${c===category?"selected":""}>${esc(c)}</option>`).join("")}
        </select>
        <button type="button" class="v21-download-btn" data-v21-latest-download>Descargar calendario PNG</button>
      </div>
    </div>
    ${categoryTabs()}
    ${cards||`<div class="v21-empty-filter">No hay partidos que coincidan con este filtro.</div>`}`;
  }

  function renderArchiveHost(host,kind){
    if(!host) return;
    host.innerHTML=archiveMarkup(kind);
    host.querySelectorAll(".v21-calendar-category").forEach(sel=>{
      sel.onchange=()=>chooseCategory(sel.value);
    });
    host.querySelectorAll("[data-v21-latest-download]").forEach(btn=>{
      btn.onclick=()=>{
        const latest=[...data().bulletins].sort((a,b)=>a.order-b.order).find(b=>filteredGroups(b,activeCategory).length);
        if(latest) downloadCalendarPng(latest.id,activeCategory);
      };
    });
    host.querySelectorAll("[data-v21-sheet-download]").forEach(btn=>{
      btn.onclick=()=>downloadCalendarPng(btn.dataset.v21SheetDownload,activeCategory);
    });
    host.querySelectorAll("[data-v21-group-download]").forEach(btn=>{
      btn.onclick=()=>downloadCalendarPng(btn.dataset.v21GroupDownload,btn.dataset.v21GroupCategory);
    });
  }

  function renderArchives(){
    const matches=document.getElementById("v20CalendarArchiveMatches");
    const calendar=document.getElementById("v20CalendarArchive");
    renderArchiveHost(matches,"matches");
    renderArchiveHost(calendar,"calendar");
  }

  function wireMatchFilters(){
    const filter=document.getElementById("matchFilter");
    const search=document.getElementById("matchSearch");
    const oldList=document.getElementById("matchesList");
    if(oldList) oldList.style.display="none";

    if(filter){
      filter.value=statusFilter;
      filter.onchange=()=>{
        statusFilter=filter.value;
        renderArchives();
      };
    }
    if(search){
      search.oninput=()=>{
        searchFilter=search.value||"";
        renderArchives();
      };
    }

    const toolbar=filter?.closest(".toolbar");
    if(toolbar && !toolbar.querySelector(".v21-match-filter-note")){
      const note=document.createElement("div");
      note.className="v21-match-filter-note";
      note.textContent="Los filtros se aplican a las programaciones registradas. Si eliges En vivo y no hay un partido marcado en vivo, se mostrará vacío.";
      toolbar.insertAdjacentElement("afterend",note);
    }
  }

  function loadImage(src){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=src;
    });
  }

  function wrapText(ctx,text,maxWidth){
    const words=String(text).split(/\s+/);
    const lines=[];let line="";
    for(const w of words){
      const test=line?line+" "+w:w;
      if(ctx.measureText(test).width>maxWidth && line){
        lines.push(line);line=w;
      }else line=test;
    }
    if(line) lines.push(line);
    return lines;
  }

  async function downloadCalendarPng(bulletinId,category){
    const d=data();
    const bulletin=d?.bulletins.find(b=>b.id===bulletinId);
    if(!bulletin) return;
    const groups=filteredGroups(bulletin,category);
    if(!groups.length) return;

    const width=1400;
    let rows=0;
    groups.forEach(g=>rows+=2+g.games.length);
    const height=Math.max(720,300+rows*62+groups.length*40);
    const canvas=document.createElement("canvas");
    canvas.width=width;canvas.height=height;
    const x=canvas.getContext("2d");

    x.fillStyle="#f7f7f8";x.fillRect(0,0,width,height);
    x.fillStyle="#0b1722";x.fillRect(0,0,width,210);
    x.fillStyle="#22e07a";x.fillRect(0,205,width,5);

    try{
      const logo=await loadImage("./assets/liga-logo.webp");
      x.drawImage(logo,45,35,140,140);
    }catch(e){}

    x.fillStyle="#ffffff";x.font="800 38px Arial";x.fillText("LIGA MUNICIPAL DE FUTBOL",215,75);
    x.font="900 50px Arial";x.fillText("JUVENTINO ROSAS A.C.",215,135);
    x.fillStyle="#a8b0bc";x.font="600 22px Arial";x.fillText(bulletin.title,215,175);

    let y=245;
    for(const group of groups){
      x.fillStyle="#0d8f50";x.fillRect(45,y,width-90,52);
      x.fillStyle="#fff";x.font="900 24px Arial";x.fillText(group.category,65,y+34);
      x.textAlign="right";x.fillText(group.title,width-65,y+34);x.textAlign="left";
      y+=65;

      x.fillStyle="#e9eaed";x.fillRect(45,y,width-90,38);
      x.fillStyle="#5d6370";x.font="800 16px Arial";
      x.fillText("LOCAL",65,y+25);x.fillText("VISITANTE",520,y+25);x.fillText("HORA",930,y+25);x.fillText("CAMPO / NOTA",1060,y+25);
      y+=40;

      for(const g of group.games){
        x.fillStyle="#ffffff";x.fillRect(45,y,width-90,54);
        x.strokeStyle="#dedfe3";x.beginPath();x.moveTo(45,y+54);x.lineTo(width-45,y+54);x.stroke();
        if(g.rest){
          x.fillStyle="#d82f48";x.font="900 19px Arial";x.fillText("DESCANSA: "+g.rest,65,y+34);
        }else{
          x.fillStyle="#111319";x.font="800 19px Arial";
          wrapText(x,g.home,400).slice(0,1).forEach(t=>x.fillText(t,65,y+33));
          x.fillStyle="#7b8290";x.font="800 16px Arial";x.fillText("VS",465,y+33);
          x.fillStyle="#111319";x.font="800 19px Arial";
          wrapText(x,g.away,360).slice(0,1).forEach(t=>x.fillText(t,520,y+33));
          x.fillStyle="#111319";x.font="700 18px Arial";x.fillText(g.time||"—",930,y+33);
          x.fillStyle=g.note?"#c82d42":"#111319";x.font=g.note?"800 16px Arial":"700 17px Arial";
          x.fillText(g.note||g.field||"—",1060,y+33);
        }
        y+=55;
      }
      y+=22;
    }

    x.fillStyle="#111319";x.font="700 17px Arial";x.fillText("Liga Juventino Rosas · MASTER V21",45,height-38);
    x.textAlign="right";x.fillStyle="#6a707b";x.fillText(category,width-45,height-38);

    canvas.toBlob(blob=>{
      if(!blob) return;
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      const safeName=(category+"-"+bulletin.title).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase();
      a.download=`liga-juventino-rosas-${safeName}.png`;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),2000);
    },"image/png");
  }

  function finalVideoHtml(id){
    return `<section class="v21-final-video" id="${id}">
      <div class="v21-final-video-grid">
        <div>
          <video controls playsinline preload="metadata" poster="./media/gran-final-veteranos-35.png">
            <source src="./media/gran-final-veteranos-35.mp4" type="video/mp4">
            Tu navegador no puede reproducir este video.
          </video>
        </div>
        <div class="v21-final-copy">
          <div class="eyebrow">Veteranos 35+ · Gran Final</div>
          <h2>Video de la Gran Final</h2>
          <p>C. de Gasca vs Pozos FC. Video promocional de la final incorporado directamente a la página de Veteranos 35+.</p>
          <div class="v21-final-meta">
            <span><b>Sábado 12 de septiembre de 2026</b></span>
            <span>4:00 pm · Campo 1 · Unidad Deportiva Sur</span>
          </div>
          <div class="v21-final-actions">
            <button type="button" class="primary-btn" data-v21-go-matches>Ver calendario de Veteranos 35+</button>
            <a class="ghost-btn v21-video-link" href="https://www.facebook.com/share/1CZyigFDwR/" target="_blank" rel="noopener">Página de la liga en Facebook</a>
          </div>
        </div>
      </div>
    </section>`;
  }

  function installFinalVideo(){
    const home=document.getElementById("view-home");
    if(home && !document.getElementById("v21FinalVideoHome")){
      const current=document.getElementById("v20CurrentSeason");
      const holder=document.createElement("div");
      holder.innerHTML=finalVideoHtml("v21FinalVideoHome");
      const sec=holder.firstElementChild;
      if(current) current.insertAdjacentElement("afterend",sec); else home.prepend(sec);
    }

    const teams=document.getElementById("view-teams");
    if(teams){
      let existing=document.getElementById("v21FinalVideoTeams");
      if(activeCategory==="Veteranos 35+"){
        if(!existing){
          const holder=document.createElement("div");holder.innerHTML=finalVideoHtml("v21FinalVideoTeams");
          existing=holder.firstElementChild;
          const panel=document.getElementById("v20CategoryPanel");
          if(panel) panel.insertAdjacentElement("afterend",existing); else teams.prepend(existing);
        }
        existing.style.display="";
      }else if(existing){
        existing.style.display="none";
      }
    }

    const matches=document.getElementById("view-matches");
    if(matches && !document.getElementById("v21FinalVideoMatches")){
      const holder=document.createElement("div");holder.innerHTML=finalVideoHtml("v21FinalVideoMatches");
      const sec=holder.firstElementChild;
      const archive=document.getElementById("v20CalendarArchiveMatches");
      if(archive) archive.insertAdjacentElement("beforebegin",sec); else matches.appendChild(sec);
    }

    document.querySelectorAll("[data-v21-go-matches]").forEach(b=>b.onclick=()=>{
      chooseCategory("Veteranos 35+");
      showView("matches");
      setTimeout(()=>document.getElementById("v20CalendarArchiveMatches")?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    });

    const finalCard=document.querySelector(".v20-final-card");
    if(finalCard && !finalCard.querySelector(".v21-final-card-button")){
      const btn=document.createElement("button");
      btn.type="button";btn.className="primary-btn v21-final-card-button";btn.textContent="Ver video de la Gran Final";
      btn.onclick=()=>document.getElementById("v21FinalVideoHome")?.scrollIntoView({behavior:"smooth",block:"center"});
      finalCard.querySelector("div")?.appendChild(btn);
    }
  }

  function addCalendarDownloadButton(){
    const view=document.getElementById("view-calendar");
    const oldIcs=document.getElementById("icsBtn");
    if(oldIcs) oldIcs.style.display="none";
    if(view && !document.getElementById("v21CalendarPngTop")){
      const title=view.querySelector(".section-title");
      const btn=document.createElement("button");
      btn.id="v21CalendarPngTop";btn.type="button";btn.className="primary-btn";btn.textContent="Descargar calendario PNG";
      btn.onclick=()=>{
        const latest=[...data().bulletins].sort((a,b)=>a.order-b.order).find(b=>filteredGroups(b,activeCategory).length);
        if(latest) downloadCalendarPng(latest.id,activeCategory);
      };
      if(title) title.appendChild(btn);
    }
  }

  function wireDataViewFallback(){
    // Ensures all visible data-view buttons continue working, even if an old handler was lost.
    document.addEventListener("click",e=>{
      const b=e.target.closest("[data-view]");
      if(!b || b.matches("[data-category]")) return;
      const view=b.dataset.view;
      if(!view) return;
      try{
        if(typeof window.showView==="function") window.showView(view);
      }catch(err){}
    });
  }

  function boot(){
    const stored=localStorage.getItem("jrCategory");
    activeCategory=CATEGORIES.includes(stored)?stored:(api()?.getCategory?.()||"Veteranos 35+");
    if(!CATEGORIES.includes(activeCategory)) activeCategory="Veteranos 35+";
    api()?.setCategory?.(activeCategory);

    wireGlobalCategoryButtons();
    wireDataViewFallback();
    fixTicker();
    renderArchives();
    wireMatchFilters();
    installFinalVideo();
    addCalendarDownloadButton();
    syncActiveClasses();

    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("./sw.js?v=21",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
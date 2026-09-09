/* MASTER V18 - logos de categorias y equipos importados del ZIP del usuario */
(function(){
  "use strict";

  const clubCatalogV18 = [
  {name:"Terricolas FC",slug:"terricolas-fc",logo:"./assets/teams/terricolas-fc.webp"},
  {name:"Herrera FC",slug:"herrera-fc",logo:"./assets/teams/herrera-fc.webp"},
  {name:"Club Deportivo Hermanos",slug:"club-deportivo-hermanos",logo:"./assets/teams/club-deportivo-hermanos.webp"},
  {name:"San Jos\u00e9",slug:"san-jose",logo:"./assets/teams/san-jose.webp"},
  {name:"Oklahoma City FC",slug:"oklahoma-city-fc",logo:"./assets/teams/oklahoma-city-fc.webp"},
  {name:"La Esperanza FC",slug:"la-esperanza-fc",logo:"./assets/teams/la-esperanza-fc.webp"},
  {name:"Promesas FC Pozos",slug:"promesas-fc-pozos",logo:"./assets/teams/promesas-fc-pozos.webp"},
  {name:"Veteranos Pozos FC",slug:"veteranos-pozos-fc",logo:"./assets/teams/veteranos-pozos-fc.webp"},
  {name:"Deportivo CG Cerrito de Gasca",slug:"deportivo-cg",logo:"./assets/teams/deportivo-cg.webp"},
  {name:"Lobos JR Cerrito de Gasca",slug:"lobos-jr-cerrito-gasca",logo:"./assets/teams/lobos-jr-cerrito-gasca.webp"},
  {name:"Lobos CDG",slug:"lobos-cdg",logo:"./assets/teams/lobos-cdg.webp"},
  {name:"La Huerta de Cuenda",slug:"la-huerta-cuenda",logo:"./assets/teams/la-huerta-cuenda.webp"},
  {name:"Atl\u00e9tico Galeana",slug:"atletico-galeana",logo:"./assets/teams/atletico-galeana.webp"},
  {name:"Franco FC",slug:"franco-fc",logo:"./assets/teams/franco-fc.webp"},
  {name:"San Antonio JR",slug:"san-antonio-jr",logo:"./assets/teams/san-antonio-jr.webp"},
  {name:"Tavera FC",slug:"tavera-fc",logo:"./assets/teams/tavera-fc.webp"},
  {name:"El Cerri",slug:"el-cerri",logo:"./assets/teams/el-cerri.webp"},
  {name:"Gal\u00e1cticos Pozos",slug:"galacticos-pozos",logo:"./assets/teams/galacticos-pozos.webp"},
  {name:"Linces",slug:"linces",logo:"./assets/teams/linces.webp"},
  {name:"Atl\u00e9tico Santa Cruz",slug:"atletico-santa-cruz",logo:"./assets/teams/atletico-santa-cruz.webp"},
  {name:"Deportivo Nopalero",slug:"deportivo-nopalero",logo:"./assets/teams/deportivo-nopalero.webp"},
  {name:"Cebolleros FC Cuenda",slug:"cebolleros-fc-cuenda",logo:"./assets/teams/cebolleros-fc-cuenda.webp"},
  {name:"Mineros FC",slug:"mineros-fc",logo:"./assets/teams/mineros-fc.webp"},
  {name:"San Juli\u00e1n FC",slug:"san-julian-fc",logo:"./assets/teams/san-julian-fc.webp"},
  {name:"La Canchita",slug:"la-canchita",logo:"./assets/teams/la-canchita.webp"},
  {name:"San Jos\u00e9 JR",slug:"san-jose-jr",logo:"./assets/teams/san-jose-jr.webp"},
  {name:"Aldama",slug:"aldama",logo:"./assets/teams/aldama.webp"},
  {name:"Boavista FC",slug:"boavista-fc",logo:"./assets/teams/boavista-fc.webp"},
  {name:"Franco Tavera JR Veteranos",slug:"franco-tavera-jr-veteranos",logo:"./assets/teams/franco-tavera-jr-veteranos.webp"},
  {name:"PSV",slug:"psv",logo:"./assets/teams/psv.webp"},
  {name:"Deportivo Santiago de Cuenda FC",slug:"deportivo-santiago-cuenda",logo:"./assets/teams/deportivo-santiago-cuenda.webp"},
  {name:"Manchester United",slug:"manchester-united",logo:"./assets/teams/manchester-united.webp"},
  {name:"Atl\u00e9tico Santiago",slug:"atletico-santiago",logo:"./assets/teams/atletico-santiago.webp"},
  {name:"Pozos FC",slug:"pozos-fc",logo:"./assets/teams/pozos-fc.webp"},
  {name:"San Jos\u00e9 FC de San Jos\u00e9 de la Monta\u00f1a",slug:"san-jose-montana",logo:"./assets/teams/san-jose-montana.webp"},
  {name:"TC Cuenda",slug:"tc-cuenda",logo:"./assets/teams/tc-cuenda.webp"},
  {name:"Juventus",slug:"juventus",logo:"./assets/teams/juventus.webp"}
  ];

  const categoriesV18 = [
    {name:"Primera Fuerza",logo:"./assets/liga-logo.webp"},
    {name:"Intermedia",logo:"./assets/categories/intermedia.webp"},
    {name:"Segunda Fuerza",logo:"./assets/categories/segunda-fuerza.webp"},
    {name:"Veteranos 35+",logo:"./assets/categories/veteranos-35.webp"},
    {name:"Veteranos 50+",logo:"./assets/categories/veteranos-50.webp"}
  ];

  const aliases = {
    "Pozos FC":"pozos-fc",
    "Juventus":"juventus",
    "Boavista":"boavista-fc",
    "Boavista FC":"boavista-fc",
    "Cerrito de Gasca":"deportivo-cg",
    "Deportivo CG Cerrito de Gasca":"deportivo-cg"
  };

  const bySlug = Object.fromEntries(clubCatalogV18.map(c => [c.slug,c]));
  const byName = Object.fromEntries(clubCatalogV18.map(c => [c.name.toLowerCase(),c]));

  function logoFor(name){
    const slug = aliases[name] || byName[(name||"").toLowerCase()]?.slug;
    return slug && bySlug[slug] ? bySlug[slug].logo : null;
  }

  function safe(s){
    return String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function logoImg(src,name,small){
    if(!src) return '<span class="v18-logo-fallback">FC</span>';
    return `<img class="${small?'v18-team-logo small':'v18-team-logo'}" src="${src}" alt="Escudo de ${safe(name)}" loading="lazy" decoding="async">`;
  }

  function buildCategoryStrip(){
    return `<div class="v18-category-panel">
      <div class="v18-panel-head">
        <div><div class="eyebrow">Categor&iacute;as</div><h3>Competencias de la liga</h3></div>
        <span class="v18-count">5 categor&iacute;as</span>
      </div>
      <div class="v18-category-grid">
        ${categoriesV18.map(c=>`
          <button class="v18-category-card" data-v18-category="${safe(c.name)}">
            <img src="${c.logo}" alt="Logo ${safe(c.name)}" loading="lazy">
            <span>${safe(c.name)}</span>
          </button>`).join("")}
      </div>
    </div>`;
  }

  function installTeamsPanel(){
    const search = document.getElementById("teamSearch");
    if(!search) return;
    if(!document.getElementById("v18Categories")){
      const wrap=document.createElement("div");
      wrap.id="v18Categories";
      wrap.innerHTML=buildCategoryStrip();
      search.parentNode.insertBefore(wrap,search);
    }

    document.querySelectorAll("[data-v18-category]").forEach(btn=>{
      btn.onclick=()=>{
        const cat=btn.dataset.v18Category;
        if(typeof currentCategory!=="undefined") currentCategory=cat;
        try{localStorage.setItem("jrCategory",cat)}catch(e){}
        document.querySelectorAll(".categoryText").forEach(x=>x.textContent=cat);
        document.querySelectorAll("[data-v18-category]").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
        if(typeof toast==="function") toast("Categor&iacute;a seleccionada: "+cat);
      };
    });
  }

  function openClub(club){
    if(typeof openModal!=="function") return;
    openModal("Equipo",`
      <div class="v18-club-modal">
        <img src="${club.logo}" alt="Escudo de ${safe(club.name)}">
        <div>
          <div class="eyebrow">Club de la liga</div>
          <h2>${safe(club.name)}</h2>
          <p style="color:var(--muted)">Escudo importado del archivo de logos de la Liga Juventino Rosas.</p>
          <div class="notice">La asignaci&oacute;n exacta equipo-categor&iacute;a se puede completar en JR Control sin volver a cargar el escudo.</div>
        </div>
      </div>`);
  }

  function renderClubCatalog(){
    const grid=document.getElementById("teamsGrid");
    if(!grid) return;
    const q=(document.getElementById("teamSearch")?.value||"").trim().toLowerCase();
    const custom = (typeof state!=="undefined" && Array.isArray(state.teams)) ? state.teams : [];
    const imported=clubCatalogV18.filter(c=>c.name.toLowerCase().includes(q));
    const customFiltered=custom.filter(c=>(c.name||"").toLowerCase().includes(q));

    if(!imported.length && !customFiltered.length){
      grid.innerHTML='<div class="empty"><div class="empty-title">Sin equipos</div>No hay clubes que coincidan con la b&uacute;squeda.</div>';
      return;
    }

    grid.innerHTML =
      imported.map(c=>`
        <article class="card v18-club-card clickable" role="listitem" tabindex="0" data-v18-club="${c.slug}">
          <div class="v18-logo-shell">${logoImg(c.logo,c.name,false)}</div>
          <div class="v18-club-copy">
            <b>${safe(c.name)}</b>
            <small>Escudo oficial/importado</small>
          </div>
          <span class="v18-open">Ver</span>
        </article>`).join("") +
      customFiltered.map(c=>`
        <article class="card v18-club-card">
          <div class="v18-logo-shell"><span class="v18-logo-fallback">FC</span></div>
          <div class="v18-club-copy"><b>${safe(c.name)}</b><small>Equipo capturado en JR Control</small></div>
        </article>`).join("");

    grid.querySelectorAll("[data-v18-club]").forEach(el=>{
      const club=bySlug[el.dataset.v18Club];
      el.onclick=()=>openClub(club);
      el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openClub(club)}};
    });
  }

  function installHomeShowcase(){
    const home=document.getElementById("view-home");
    if(!home || document.getElementById("v18ClubShowcase")) return;
    const sponsors=[...home.querySelectorAll(".section")].find(s=>/Patrocinadores/i.test(s.textContent||""));
    const section=document.createElement("section");
    section.className="section";
    section.id="v18ClubShowcase";
    section.innerHTML=`
      <div class="section-title">
        <div><div class="eyebrow">Identidad de la liga</div><h2>Categor&iacute;as y clubes</h2></div>
        <button class="ghost-btn" data-view="teams">Ver todos los equipos</button>
      </div>
      <div class="v18-home-categories">
        ${categoriesV18.map(c=>`<div class="v18-home-category"><img src="${c.logo}" alt=""><span>${safe(c.name)}</span></div>`).join("")}
      </div>
      <div class="v18-club-rail" aria-label="Escudos de equipos">
        ${clubCatalogV18.map(c=>`<button class="v18-rail-club" data-v18-home-club="${c.slug}" title="${safe(c.name)}"><img src="${c.logo}" alt="Escudo de ${safe(c.name)}" loading="lazy"><span>${safe(c.name)}</span></button>`).join("")}
      </div>
      <p class="v18-source-note">${clubCatalogV18.length} escudos de equipos cargados desde el archivo proporcionado para la liga.</p>`;
    if(sponsors) home.insertBefore(section,sponsors); else home.appendChild(section);

    section.querySelectorAll("[data-v18-home-club]").forEach(el=>{
      el.onclick=()=>openClub(bySlug[el.dataset.v18HomeClub]);
    });
  }

  function upgradeStandings(){
    if(typeof renderStandings!=="function" || typeof baseTeams==="undefined") return;
    window.renderStandingsV18 = function(){
      const teamRows = baseTeams.map((t,i)=>{
        const logo=logoFor(t.name);
        const visual=logo ? logoImg(logo,t.name,true) : `<span class="v18-table-icon">${t.icon||"FC"}</span>`;
        return `<tr><td>${i+1}</td><td><strong class="v18-team-cell">${visual}<span>${safe(t.name)}</span></strong></td><td>${t.jj}</td><td>${t.g}</td><td>${t.e}</td><td>${t.p}</td><td>${t.gf}</td><td>${t.gc}</td><td>${t.gf-t.gc}</td><td><span class="form-pill">${t.form.map(x=>`<i class="${x==="G"?"w":x==="E"?"d":"l"}">${x}</i>`).join("")}</span></td><td class="pts">${t.pts}</td></tr>`;
      }).join("");
      const full=document.getElementById("fullStandings");
      if(full) full.innerHTML=teamRows;
      const mini=document.getElementById("miniStandings");
      if(mini) mini.innerHTML=baseTeams.slice(0,4).map((t,i)=>{
        const logo=logoFor(t.name);
        const visual=logo ? logoImg(logo,t.name,true) : `<span class="v18-table-icon">${t.icon||"FC"}</span>`;
        return `<tr><td>${i+1}</td><td><strong class="v18-team-cell">${visual}<span>${safe(t.name)}</span></strong></td><td><span class="form-pill">${t.form.map(x=>`<i class="${x==="G"?"w":x==="E"?"d":"l"}">${x}</i>`).join("")}</span></td><td class="pts">${t.pts}</td></tr>`;
      }).join("");
    };
    renderStandings = window.renderStandingsV18;
    renderStandings();
  }

  function upgradeGrandFinal(){
    const final=document.getElementById("gran-final-veteranos-v16");
    if(!final) return;
    const teams=final.querySelectorAll(".team");
    if(teams[0]){
      const logo=teams[0].querySelector(".team-logo");
      if(logo) logo.outerHTML=`<div class="team-logo v18-final-logo">${logoImg("./assets/teams/pozos-fc.webp","Pozos FC",false)}</div>`;
    }
    if(teams[1]){
      const logo=teams[1].querySelector(".team-logo");
      if(logo) logo.outerHTML=`<div class="team-logo v18-final-logo">${logoImg("./assets/teams/juventus.webp","Juventus",false)}</div>`;
    }
  }

  function fixVisibleLabels(){
    const fixed={themeBtn:"Tema",globalSearchBtn:"Buscar",tvModeBtn:"TV"};
    Object.entries(fixed).forEach(([id,label])=>{const el=document.getElementById(id);if(el)el.textContent=label});
    document.querySelectorAll('[data-view="notifications"]').forEach(el=>el.textContent="Avisos");
    document.querySelectorAll('.bottom-nav [data-view="home"]').forEach(el=>el.textContent="Inicio");
    document.querySelectorAll('.bottom-nav [data-view="matches"]').forEach(el=>el.textContent="Partidos");
    document.querySelectorAll('.bottom-nav [data-view="table"]').forEach(el=>el.textContent="Tabla");
    document.querySelectorAll('.bottom-nav [data-view="stats"]').forEach(el=>el.textContent="Estadisticas");
    document.querySelectorAll('.bottom-nav [data-view="more"]').forEach(el=>el.textContent="Mas");
  }

  function installSearch(){
    const search=document.getElementById("teamSearch");
    if(search){
      search.removeEventListener?.("input",renderTeams);
      search.addEventListener("input",renderClubCatalog);
    }
  }

  function boot(){
    installTeamsPanel();
    installHomeShowcase();
    installSearch();
    upgradeStandings();
    upgradeGrandFinal();
    fixVisibleLabels();
    if(typeof renderTeams!=="undefined") renderTeams=renderClubCatalog;
    renderClubCatalog();

    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("./sw.js?v=18",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();

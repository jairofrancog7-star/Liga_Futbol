/* MASTER V19 - temporada actual por categorias, equipos y jornadas */
(function(){
  "use strict";

  const seasonV19 = {"season":"2026","source":"Tablas e imágenes enviadas por el usuario el 9 de septiembre de 2026","categories_order":["Veteranos 35+","Veteranos 50+","Primera Fuerza","Intermedia","Segunda Fuerza"],"categories":{"Veteranos 35+":{"scope":"Categoría por edad","current_phase":"Final","teams":["C. de Gasca","Juventus","Cuenda","Pozos FC","Boavista","PSV","A. Santiago","F. Tavera","América","Huracán"],"standings":[{"pos":1,"team":"C. de Gasca","jj":17,"g":13,"e":1,"p":3,"gf":54,"gc":17,"dg":37,"pts":40},{"pos":2,"team":"Juventus","jj":17,"g":10,"e":4,"p":3,"gf":47,"gc":27,"dg":20,"pts":34},{"pos":3,"team":"Cuenda","jj":17,"g":11,"e":0,"p":6,"gf":41,"gc":22,"dg":19,"pts":33},{"pos":4,"team":"Pozos FC","jj":17,"g":10,"e":2,"p":5,"gf":48,"gc":36,"dg":12,"pts":32},{"pos":5,"team":"Boavista","jj":17,"g":8,"e":3,"p":6,"gf":38,"gc":27,"dg":11,"pts":27},{"pos":6,"team":"PSV","jj":17,"g":9,"e":0,"p":8,"gf":49,"gc":40,"dg":9,"pts":27},{"pos":7,"team":"A. Santiago","jj":17,"g":7,"e":1,"p":9,"gf":36,"gc":57,"dg":-21,"pts":22},{"pos":8,"team":"F. Tavera","jj":17,"g":4,"e":2,"p":11,"gf":27,"gc":50,"dg":-23,"pts":14},{"pos":9,"team":"América","jj":17,"g":4,"e":1,"p":12,"gf":22,"gc":48,"dg":-26,"pts":13},{"pos":10,"team":"Huracán","jj":17,"g":2,"e":0,"p":15,"gf":19,"gc":69,"dg":-50,"pts":6}],"knockout":{"Cuartos de final":[{"home":"C. de Gasca","away":"F. Tavera","time":"03:30","field":"1"},{"home":"Juventus","away":"A. Santiago","time":"05:00","field":"2"},{"home":"Pozos FC","away":"PSV","time":"05:00","field":"3"},{"home":"Cuenda","away":"Boavista","time":"05:00","field":"1"}],"Semifinal":[{"home":"C. de Gasca","away":"Boavista","time":"03:00","field":"1"},{"home":"Juventus","away":"Pozos FC","time":"05:00","field":"1"}],"Final":[{"home":"C. de Gasca","away":"Pozos FC","time":"04:00","field":"1"}]}},"Veteranos 50+":{"scope":"Categoría por edad","current_phase":"Torneo de Copa J6","teams":["La Esperanza","Dynamo","Boca Jrs","Toros de Cuenda","Boavista","Manchester"],"rounds":{"J1":[{"home":"La Esperanza","away":"Dynamo","time":"05:00","field":"2"},{"home":"Boca Jrs","away":"Toros de Cuenda","time":"03:30","field":"2"},{"home":"Boavista","away":"Manchester","time":"03:30","field":"1"}],"J3":[{"home":"La Esperanza","away":"Manchester","time":"03:30","field":"3"},{"home":"Boca Jrs","away":"Boavista","note":"Gana Boavista"},{"home":"Toros de Cuenda","away":"Dynamo","time":"03:30","field":"2"}],"J4":[{"home":"Manchester","away":"Toros de Cuenda","time":"03:30","field":"1"},{"home":"Boca Jrs","away":"Dynamo","note":"Gana Dynamo"},{"home":"Boavista","away":"La Esperanza","time":"05:00","field":"3"}],"J5":[{"home":"La Esperanza","away":"Boca Jrs","note":"Gana La Esperanza"},{"home":"Dynamo","away":"Manchester","time":"03:30","field":"2"},{"home":"Toros de Cuenda","away":"Boavista","time":"05:00","field":"2"}],"J6":[{"home":"La Esperanza","away":"Dynamo","time":"05:00","field":"3"},{"home":"Boca Jrs","away":"Toros de Cuenda","note":"Gana Toros de Cuenda"},{"home":"Boavista","away":"Manchester","time":"03:00","field":"3"}]}},"Primera Fuerza":{"scope":"Categoría abierta por nivel","current_phase":"Torneo de Copa J5","teams":["Hermanos","San José FC","Linces","Juventus","Napoli","Lobos CDG","Terrícolas","Galácticos","Franco FC","Herreras FC","Abejas"],"rounds":{"J1":[{"home":"Galácticos","away":"San José FC","note":"Gana San José"},{"home":"Lobos CDG","away":"Juventus","time":"08:00","field":"1"},{"home":"Hermanos","away":"Franco FC","time":"10:00","field":"Romerillo"},{"home":"Linces","away":"Abejas","time":"08:00","field":"Fraccionamiento"},{"home":"Napoli","away":"Herreras FC","time":"10:00","field":"2"},{"rest":"Terrícolas"}],"J3":[{"home":"Lobos CDG","away":"Galácticos","note":"Gana Lobos CDG"},{"home":"Hermanos","away":"Herreras FC","time":"10:00","field":"1"},{"home":"Napoli","away":"San José FC","time":"12:00","field":"San José"},{"home":"Terrícolas","away":"Juventus","time":"10:00","field":"2"},{"home":"Franco FC","away":"Abejas","time":"10:00","field":"Pozos"},{"rest":"Linces"}],"J4":[{"home":"Abejas","away":"Lobos CDG","time":"10:00","field":"Pozos"},{"home":"Galácticos","away":"Napoli","note":"Gana Napoli"},{"home":"Herreras FC","away":"Linces","time":"10:00","field":"1"},{"home":"Juventus","away":"Hermanos","time":"08:00","field":"Romerillo"},{"home":"San José FC","away":"Terrícolas","time":"12:00","field":"San José"},{"rest":"Franco FC"}],"J5":[{"home":"Hermanos","away":"San José FC","time":"10:00","field":"3"},{"home":"Linces","away":"Juventus","time":"08:00","field":"3"},{"home":"Napoli","away":"Lobos CDG","time":"12:00","field":"Cerrito de Gasca"},{"home":"Terrícolas","away":"Galácticos","note":"Gana Terrícolas"},{"home":"Franco FC","away":"Herreras FC","time":"08:00","field":"Romerillo"},{"rest":"Abejas"}]}},"Intermedia":{"scope":"Categoría abierta por nivel","current_phase":"Torneo de Copa J5","teams":["La Canchita Deportes","Galeana","Aldama FC","Malvinas","Capibaras","La Cuadrilla","Mazacotes FC","Dep. Maravillas","Osasuna","San Antonio Jrs","Populares","Promesas FC","La Huerta"],"rounds":{"J1":[{"home":"Aldama FC","away":"Galeana","time":"10:00","field":"4"},{"home":"Capibaras","away":"Mazacotes FC","time":"10:00","field":"Tavera"},{"home":"La Huerta","away":"La Canchita Deportes","time":"10:00","field":"Fraccionamiento"},{"home":"Osasuna","away":"Dep. Maravillas","time":"08:00","field":"4"},{"home":"Populares","away":"Malvinas","time":"08:00","field":"2"},{"home":"Promesas FC","away":"La Cuadrilla","time":"09:00","field":"Rincón de Centeno"},{"rest":"San Antonio Jrs"}],"J3":[{"home":"Aldama FC","away":"La Canchita Deportes","time":"10:00","field":"Fraccionamiento"},{"home":"Capibaras","away":"Dep. Maravillas","time":"10:00","field":"Tavera"},{"home":"La Huerta","away":"Malvinas","time":"10:00","field":"3"},{"home":"Mazacotes FC","away":"Galeana","time":"08:00","field":"2"},{"home":"Osasuna","away":"La Cuadrilla","time":"09:00","field":"Rincón de Centeno"},{"home":"Promesas FC","away":"San Antonio Jrs","time":"10:00","field":"Romerillo"},{"rest":"Populares"}],"J4":[{"home":"La Cuadrilla","away":"La Huerta","time":"12:00","field":"2"},{"home":"Dep. Maravillas","away":"Aldama FC","time":"08:00","field":"Fraccionamiento"},{"home":"San Antonio Jrs","away":"Populares","time":"10:00","field":"Romerillo"},{"home":"La Canchita Deportes","away":"Mazacotes FC","time":"08:00","field":"2"},{"home":"Galeana","away":"Promesas FC","time":"10:00","field":"4"},{"home":"Malvinas","away":"Capibaras","time":"10:00","field":"2"},{"rest":"Osasuna"}],"J5":[{"home":"La Canchita Deportes","away":"Galeana","time":"10:00","field":"2"},{"home":"Aldama FC","away":"Malvinas","time":"10:00","field":"1"},{"home":"Capibaras","away":"La Cuadrilla","time":"10:00","field":"Tavera"},{"home":"Mazacotes FC","away":"Dep. Maravillas","time":"08:00","field":"1"},{"home":"Osasuna","away":"San Antonio Jrs","time":"12:00","field":"1"},{"home":"Populares","away":"Promesas FC","time":"08:00","field":"Fraccionamiento"},{"rest":"La Huerta"}]}},"Segunda Fuerza":{"scope":"Categoría abierta por nivel","current_phase":"Torneo de Copa J5","teams":["Tavera FC","Pachangas FC","San Juan FC","Tapatío","Dep. La Luz","San Julián","Barza","San José Jrs","San Antonio FC","Célticos FC","Dep. Nopalero","Dep. Zapata"],"rounds":{"J1":[{"home":"El Alto","away":"Pachangas FC","note":"Gana Pachangas"},{"home":"Barza","away":"San Juan FC","time":"12:00","field":"Fraccionamiento"},{"home":"San Antonio FC","away":"Tavera FC","time":"12:00","field":"4"},{"home":"Dep. Nopalero","away":"Tapatío","time":"12:00","field":"1"},{"home":"Dep. Zapata","away":"San Julián","time":"10:00","field":"1"},{"home":"Célticos","away":"San José Jrs","time":"12:00","field":"2"}],"J3":[{"home":"San Juan FC","away":"Pachangas FC","time":"08:00","field":"1"},{"home":"Dep. La Luz","away":"Tavera FC","time":"08:00","field":"Fraccionamiento"},{"home":"Barza","away":"Tapatío","time":"12:00","field":"3"},{"home":"San Antonio FC","away":"San Julián","time":"10:00","field":"San Julián"},{"home":"Dep. Nopalero","away":"San José Jrs","time":"12:00","field":"1"},{"home":"Dep. Zapata","away":"Célticos FC","time":"08:00","field":"3"}],"J4":[{"home":"Pachangas FC","away":"Dep. Zapata","time":"08:00","field":"1"},{"home":"Célticos FC","away":"Dep. Nopalero","time":"12:00","field":"Fraccionamiento"},{"home":"San José Jrs","away":"San Antonio FC","time":"10:00","field":"San José"},{"home":"San Julián","away":"Barza","time":"10:00","field":"Fraccionamiento"},{"home":"Tapatío","away":"Dep. La Luz","time":"12:00","field":"1"},{"home":"Tavera FC","away":"San Juan FC","time":"12:00","field":"S. Juan de la Cruz"}],"J5":[{"home":"Tavera FC","away":"Pachangas FC","time":"12:00","field":"Tavera"},{"home":"San Juan FC","away":"Tapatío","time":"08:00","field":"San Juan"},{"home":"Dep. La Luz","away":"San Julián","time":"10:00","field":"San Julián"},{"home":"Barza","away":"San José Jrs","time":"12:00","field":"San José"},{"home":"San Antonio FC","away":"Célticos FC","time":"10:00","field":"Fraccionamiento"},{"home":"Dep. Nopalero","away":"Dep. Zapata","time":"08:00","field":"2"}]},"notes":["El Alto aparece en J1 pero ya no aparece en la jornada actual J5, por eso no se incluye en la lista vigente."]}}};
  const logoMapV19 = {"C. de Gasca":"./assets/teams/deportivo-cg.webp","Juventus":"./assets/teams/juventus.webp","Pozos FC":"./assets/teams/pozos-fc.webp","Boavista":"./assets/teams/boavista-fc.webp","PSV":"./assets/teams/psv.webp","A. Santiago":"./assets/teams/atletico-santiago.webp","F. Tavera":"./assets/teams/franco-tavera-jr-veteranos.webp","La Esperanza":"./assets/teams/la-esperanza-fc.webp","Manchester":"./assets/teams/manchester-united.webp","Hermanos":"./assets/teams/club-deportivo-hermanos.webp","San José FC":"./assets/teams/san-jose.webp","Linces":"./assets/teams/linces.webp","Lobos CDG":"./assets/teams/lobos-cdg.webp","Terrícolas":"./assets/teams/terricolas-fc.webp","Galácticos":"./assets/teams/galacticos-pozos.webp","Franco FC":"./assets/teams/franco-fc.webp","Herreras FC":"./assets/teams/herrera-fc.webp","La Canchita Deportes":"./assets/teams/la-canchita.webp","Galeana":"./assets/teams/atletico-galeana.webp","Aldama FC":"./assets/teams/aldama.webp","San Antonio Jrs":"./assets/teams/san-antonio-jr.webp","Promesas FC":"./assets/teams/promesas-fc-pozos.webp","La Huerta":"./assets/teams/la-huerta-cuenda.webp","Tavera FC":"./assets/teams/tavera-fc.webp","San Julián":"./assets/teams/san-julian-fc.webp","San José Jrs":"./assets/teams/san-jose-jr.webp","Dep. Nopalero":"./assets/teams/deportivo-nopalero.webp"};
  const categoryLogosV19 = {"Veteranos 35+":"./assets/categories/veteranos-35.webp","Veteranos 50+":"./assets/categories/veteranos-50.webp","Primera Fuerza":"./assets/liga-logo.webp","Intermedia":"./assets/categories/intermedia.webp","Segunda Fuerza":"./assets/categories/segunda-fuerza.webp"};

  let selectedCategoryV19 = (() => {
    try {
      const saved = localStorage.getItem("jrCurrentCategoryV19");
      return seasonV19.categories[saved] ? saved : "Veteranos 35+";
    } catch (e) {
      return "Veteranos 35+";
    }
  })();

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const initials = name => String(name||"FC").replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]/g," ").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "FC";

  function logoForV19(name) {
    return logoMapV19[name] || null;
  }

  function teamVisualV19(name, cls="") {
    const src = logoForV19(name);
    if (src) return `<img class="v19-team-logo ${cls}" src="${src}" alt="Escudo de ${esc(name)}" loading="lazy" decoding="async">`;
    return `<span class="v19-team-fallback ${cls}" title="Escudo pendiente">${esc(initials(name))}</span>`;
  }

  function currentRoundKey(cat) {
    const cfg = seasonV19.categories[cat];
    if (!cfg) return null;
    if (cfg.knockout) return "Final";
    const keys = Object.keys(cfg.rounds || {});
    return keys[keys.length - 1] || null;
  }

  function currentMatches(cat) {
    const cfg = seasonV19.categories[cat];
    if (!cfg) return [];
    if (cfg.knockout) return cfg.knockout["Final"] || [];
    const key = currentRoundKey(cat);
    return key ? (cfg.rounds[key] || []) : [];
  }

  function categoryButtonsV19(compact=false) {
    return `<div class="v19-category-tabs ${compact ? "compact":""}">
      ${seasonV19.categories_order.map(cat => {
        const cfg = seasonV19.categories[cat];
        return `<button class="v19-category-tab ${cat===selectedCategoryV19?"active":""}" data-v19-cat="${esc(cat)}">
          <img src="${categoryLogosV19[cat] || "./assets/liga-logo.webp"}" alt="Logo ${esc(cat)}">
          <span><b>${esc(cat)}</b><small>${cfg.teams.length} equipos · ${esc(cfg.current_phase)}</small></span>
        </button>`;
      }).join("")}
    </div>`;
  }

  function matchRowV19(match) {
    if (match.rest) {
      return `<div class="v19-match-row rest"><span>Descansa</span><strong>${esc(match.rest)}</strong></div>`;
    }
    const note = match.note ? `<span class="v19-result-note">${esc(match.note)}</span>` : "";
    const meta = [match.time, match.field ? "Campo " + match.field : ""].filter(Boolean).join(" · ");
    return `<div class="v19-match-row">
      <div class="v19-side">${teamVisualV19(match.home,"small")}<strong>${esc(match.home)}</strong></div>
      <div class="v19-match-center"><b>VS</b><small>${esc(meta || "Horario por confirmar")}</small>${note}</div>
      <div class="v19-side away"><strong>${esc(match.away)}</strong>${teamVisualV19(match.away,"small")}</div>
    </div>`;
  }

  function selectCategoryV19(cat) {
    if (!seasonV19.categories[cat]) return;
    selectedCategoryV19 = cat;
    try { localStorage.setItem("jrCurrentCategoryV19", cat); } catch (e) {}
    try { if (typeof currentCategory !== "undefined") currentCategory = cat; } catch (e) {}
    document.querySelectorAll(".categoryText").forEach(x => x.textContent = cat);
    renderCurrentSeasonPanelV19();
    renderTeamsV19();
    renderOfficialStandingsV19();
    renderKnockoutV19();
    renderMatchdayBarV19();
    if (typeof toast === "function") toast("Categoría actualizada: " + cat);
  }

  function wireCategoryButtonsV19(scope=document) {
    scope.querySelectorAll("[data-v19-cat]").forEach(btn => {
      btn.onclick = () => selectCategoryV19(btn.dataset.v19Cat);
    });
  }

  function renderCurrentSeasonPanelV19() {
    const home = document.getElementById("view-home");
    if (!home) return;

    let panel = document.getElementById("v19-current-season");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "v19-current-season";
      panel.className = "section v19-current-season";
      const anchor = document.getElementById("v14CinematicHero") || document.getElementById("gran-final-veteranos-v16");
      if (anchor && anchor.parentNode === home) anchor.after(panel);
      else home.prepend(panel);
    }

    const cfg = seasonV19.categories[selectedCategoryV19];
    const matches = currentMatches(selectedCategoryV19);

    panel.innerHTML = `
      <div class="section-title v19-title-row">
        <div>
          <div class="eyebrow">Temporada actual · información de las tablas recibidas</div>
          <h2>Así va la Liga Juventino Rosas</h2>
        </div>
        <span class="v19-season-badge">MASTER V19</span>
      </div>
      ${categoryButtonsV19()}
      <div class="v19-current-grid">
        <article class="card v19-phase-card">
          <div class="v19-phase-head">
            <img src="${categoryLogosV19[selectedCategoryV19] || "./assets/liga-logo.webp"}" alt="">
            <div><span class="eyebrow">${esc(cfg.scope)}</span><h3>${esc(selectedCategoryV19)}</h3></div>
          </div>
          <div class="v19-phase">${esc(cfg.current_phase)}</div>
          <p>${cfg.teams.length} equipos vigentes registrados en esta categoría.</p>
          <button class="ghost-btn" data-view="teams">Ver equipos</button>
        </article>
        <article class="card v19-round-card">
          <div class="section-title"><div><div class="eyebrow">Jornada / fase más reciente</div><h3>${esc(cfg.current_phase)}</h3></div></div>
          <div class="v19-current-matches">${matches.map(matchRowV19).join("")}</div>
        </article>
      </div>
      <div class="v19-source-box">
        <b>Estado actual registrado:</b> Veteranos 35+ está en Final; Veteranos 50+ en Copa J6; Primera, Intermedia y Segunda Fuerza en Copa J5.
        Donde la hoja sólo dice “Gana X” se conserva ese dato sin inventar marcador.
      </div>
    `;

    wireCategoryButtonsV19(panel);
    panel.querySelectorAll('[data-view]').forEach(btn => {
      btn.onclick = () => { if (typeof showView === "function") showView(btn.dataset.view); };
    });
  }

  function ensureTeamsPanelV19() {
    const search = document.getElementById("teamSearch");
    if (!search) return null;
    let panel = document.getElementById("v19TeamsCategories");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "v19TeamsCategories";
      panel.className = "v18-category-panel v19-teams-header";
      search.parentNode.insertBefore(panel, search);
    }
    const cfg = seasonV19.categories[selectedCategoryV19];
    panel.innerHTML = `
      <div class="v18-panel-head">
        <div><div class="eyebrow">Equipos vigentes · temporada actual</div><h3>${esc(selectedCategoryV19)}</h3></div>
        <span class="v18-count">${cfg.teams.length} equipos</span>
      </div>
      ${categoryButtonsV19(true)}`;
    wireCategoryButtonsV19(panel);
    return panel;
  }

  function renderTeamsV19() {
    const grid = document.getElementById("teamsGrid");
    if (!grid) return;
    ensureTeamsPanelV19();

    const cfg = seasonV19.categories[selectedCategoryV19];
    const search = (document.getElementById("teamSearch")?.value || "").trim().toLocaleLowerCase("es");
    const teams = cfg.teams.filter(name => name.toLocaleLowerCase("es").includes(search));

    grid.innerHTML = teams.length ? teams.map((name, i) => {
      const logo = logoForV19(name);
      return `<article class="card v18-club-card v19-roster-card">
        <div class="v18-logo-shell">${teamVisualV19(name)}</div>
        <div class="v18-club-copy">
          <span class="v19-roster-number">#${String(i+1).padStart(2,"0")}</span>
          <b>${esc(name)}</b>
          <small>${esc(selectedCategoryV19)} · ${logo ? "Escudo cargado" : "Escudo pendiente de archivo"}</small>
        </div>
        <span class="v18-open">${logo ? "Logo" : "Pendiente"}</span>
      </article>`;
    }).join("") : `<div class="empty"><div class="empty-title">Sin coincidencias</div>No hay equipos con ese nombre en ${esc(selectedCategoryV19)}.</div>`;
  }

  function renderOfficialStandingsV19() {
    const full = document.getElementById("fullStandings");
    const mini = document.getElementById("miniStandings");
    const cfg = seasonV19.categories[selectedCategoryV19];

    if (cfg?.standings?.length) {
      if (full) full.innerHTML = cfg.standings.map(row => `<tr>
        <td>${row.pos}</td>
        <td><strong class="v18-team-cell">${teamVisualV19(row.team,"small")}<span>${esc(row.team)}</span></strong></td>
        <td>${row.jj}</td><td>${row.g}</td><td>${row.e}</td><td>${row.p}</td>
        <td>${row.gf}</td><td>${row.gc}</td><td>${row.dg}</td><td>—</td><td class="pts">${row.pts}</td>
      </tr>`).join("");

      if (mini) mini.innerHTML = cfg.standings.slice(0,4).map(row => `<tr>
        <td>${row.pos}</td>
        <td><strong class="v18-team-cell">${teamVisualV19(row.team,"small")}<span>${esc(row.team)}</span></strong></td>
        <td><span class="form-pill"><i class="d">JJ ${row.jj}</i></span></td>
        <td class="pts">${row.pts}</td>
      </tr>`).join("");
    } else {
      const message = `La tabla general de ${esc(selectedCategoryV19)} no fue incluida en las imágenes actuales; no se muestran puntos inventados.`;
      if (full) full.innerHTML = `<tr><td colspan="11"><div class="v19-no-table">${message}</div></td></tr>`;
      if (mini) mini.innerHTML = `<tr><td colspan="4"><div class="v19-no-table">${message}</div></td></tr>`;
    }
  }

  function renderKnockoutV19() {
    const old = document.getElementById("v19-v35-path");
    if (old) old.remove();
    if (selectedCategoryV19 !== "Veteranos 35+") return;

    const panel = document.getElementById("v19-current-season");
    if (!panel) return;
    const cfg = seasonV19.categories["Veteranos 35+"];

    const section = document.createElement("div");
    section.id = "v19-v35-path";
    section.className = "card v19-knockout";
    section.innerHTML = `
      <div class="section-title"><div><div class="eyebrow">Veteranos 35+</div><h3>Camino a la final</h3></div><span class="v19-season-badge">Fase final</span></div>
      <div class="v19-knockout-grid">
        ${Object.entries(cfg.knockout).map(([stage,games])=>`
          <div class="v19-knockout-stage"><b>${esc(stage)}</b>${games.map(matchRowV19).join("")}</div>
        `).join("")}
      </div>`;
    panel.appendChild(section);
  }


  function fixStaticFinalCardV19() {
    const final = document.getElementById("gran-final-veteranos-v16");
    if (!final) return;
    final.setAttribute("aria-label","Gran Final Veteranos 35+");
    final.innerHTML = `
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 75% 20%,rgba(34,224,122,.10),transparent 38%);pointer-events:none"></div>
      <div style="position:relative;z-index:1">
        <div style="display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap">
          <div>
            <div class="eyebrow">EVENTO PRINCIPAL · VETERANOS 35+</div>
            <h2 style="margin:4px 0 0">Gran Final Veteranos 35+</h2>
            <p style="color:var(--muted);margin:8px 0 0">C. de Gasca vs Pozos FC · 04:00 · Campo 1</p>
          </div>
          <span class="chip active">Final</span>
        </div>
        <div class="match-hero" style="margin:22px 0 12px">
          <div class="team">
            <div class="team-logo v18-final-logo">${teamVisualV19("C. de Gasca")}</div>
            <b>C. de Gasca</b>
          </div>
          <div class="score"><strong class="score-3d">VS</strong><small>GRAN FINAL</small></div>
          <div class="team">
            <div class="team-logo v18-final-logo">${teamVisualV19("Pozos FC")}</div>
            <b>Pozos FC</b>
          </div>
        </div>
        <div class="hero-actions">
          <button class="primary-btn" data-view="matchcenter">Abrir Match Center</button>
          <button class="ghost-btn" data-view="matches">Ver jornada</button>
          <button class="ghost-btn" data-view="table">Ver tabla</button>
        </div>
      </div>`;
    final.querySelectorAll('[data-view]').forEach(btn=>{
      btn.onclick=()=>{ if(typeof showView==="function") showView(btn.dataset.view); };
    });
  }

  function renderMatchdayBarV19() {
    const bar = document.getElementById("matchdayBar");
    if (!bar) return;
    bar.innerHTML = seasonV19.categories_order.map(cat=>{
      const cfg=seasonV19.categories[cat];
      const first=currentMatches(cat)[0];
      const detail=first ? `${first.home||""} vs ${first.away||""}` : cfg.current_phase;
      return `<button class="matchday-item ${cat===selectedCategoryV19?"active":""}" data-v19-matchday="${esc(cat)}" role="listitem">
        <small>${esc(cat)} · ${esc(cfg.current_phase)}</small>
        <b>${esc(detail)}</b>
      </button>`;
    }).join("");
    bar.querySelectorAll("[data-v19-matchday]").forEach(btn=>{
      btn.onclick=()=>selectCategoryV19(btn.dataset.v19Matchday);
    });
  }

  function updateHeroV19() {
    const ticker = document.querySelector("#v14CinematicHero .v14-track");
    if (ticker) ticker.innerHTML = `
      <span class="live">GRAN FINAL VETERANOS 35+</span>
      <span><b>C. DE GASCA VS POZOS FC</b> · 04:00 · CAMPO 1</span>
      <span>VETERANOS 50+ · COPA J6</span>
      <span>PRIMERA FUERZA · COPA J5</span>
      <span>INTERMEDIA · COPA J5</span>
      <span>SEGUNDA FUERZA · COPA J5</span>
      <span class="live">GRAN FINAL VETERANOS 35+</span>
      <span><b>C. DE GASCA VS POZOS FC</b> · 04:00 · CAMPO 1</span>
      <span>VETERANOS 50+ · COPA J6</span>
      <span>PRIMERA FUERZA · COPA J5</span>
      <span>INTERMEDIA · COPA J5</span>
      <span>SEGUNDA FUERZA · COPA J5</span>`;

    document.querySelectorAll("#v14CinematicHero .v14-chip").forEach((chip, i) => {
      if (i === 0) chip.innerHTML = `<strong>5</strong> categorías actuales`;
      if (i === 1) chip.innerHTML = `<strong>FINAL</strong> Veteranos 35+`;
      if (i === 2) chip.innerHTML = `<strong>COPA</strong> J5 / J6`;
    });

    const footer = document.querySelector("footer");
    if (footer) footer.textContent = "Liga Juventino Rosas · MASTER V19 · Temporada actual registrada por categorías";
  }

  function hideDemoScorersV19() {
    const h = [...document.querySelectorAll("h1,h2,h3")].find(el => /Top goleadores/i.test(el.textContent || ""));
    if (!h) return;
    const parent = h.parentElement?.parentElement || h.parentElement;
    if (!parent || parent.dataset.v19Cleaned) return;
    parent.dataset.v19Cleaned = "1";
    parent.querySelectorAll(".card").forEach(card => card.style.display = "none");
    const note = document.createElement("div");
    note.className = "v19-scorers-note";
    note.innerHTML = `<b>Goleo oficial pendiente de cargar</b><span>No se recibió una tabla actual de goleadores en estas imágenes, así que se retiraron los nombres demo para no mezclar datos.</span>`;
    parent.appendChild(note);
  }

  function clearOldV18PanelsV19() {
    const old = document.getElementById("v18Categories");
    if (old) old.remove();
    const oldShowcase = document.getElementById("v18ClubShowcase");
    if (oldShowcase) oldShowcase.remove();
  }

  function bootV19() {
    clearOldV18PanelsV19();
    updateHeroV19();
    fixStaticFinalCardV19();
    renderCurrentSeasonPanelV19();
    ensureTeamsPanelV19();
    renderTeamsV19();
    renderOfficialStandingsV19();
    renderKnockoutV19();
    renderMatchdayBarV19();
    hideDemoScorersV19();

    const search = document.getElementById("teamSearch");
    if (search) search.addEventListener("input", renderTeamsV19);

    try {
      if (typeof renderTeams !== "undefined") renderTeams = renderTeamsV19;
      if (typeof renderStandings !== "undefined") renderStandings = renderOfficialStandingsV19;
    } catch (e) {}

    window.JR_CURRENT_SEASON_V19 = seasonV19;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js?v=19", {updateViaCache:"none"}).then(reg => reg.update()).catch(()=>{});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootV19);
  else bootV19();
})();

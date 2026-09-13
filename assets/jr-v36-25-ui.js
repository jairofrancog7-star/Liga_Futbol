/* Legacy entry point retained for cached integrations; V38 hero presentation. */
(function () {
  'use strict';
  function restoreHero() {
    const hero = document.getElementById('v14CinematicHero');
    if (!hero) return;
    const title = hero.querySelector('.v14-title');
    if (title && !title.dataset.jr38) {
      title.innerHTML = '<span class="outline">FÚTBOL</span><span class="electric">QUE SE SIENTE</span><span class="live">EN VIVO.</span>';
      title.dataset.jr38 = '1';
      const fitTitle = () => {
        title.style.removeProperty('font-size');
        const available = title.clientWidth;
        if (!available) return;
        const widest = Math.max(...Array.from(title.children, line => line.scrollWidth));
        if (widest > available) title.style.setProperty('font-size', (parseFloat(getComputedStyle(title).fontSize) * available / widest * .98) + 'px', 'important');
      };
      window.addEventListener('resize', fitTitle, { passive: true });
      document.fonts?.ready.then(fitTitle);
      fitTitle();
    }
    document.getElementById('jrV3625Heritage')?.remove();
    const actions = hero.querySelector('.v14-actions');
    if (actions && !actions.dataset.jr38) {
      actions.dataset.jr38 = '1';
      actions.innerHTML = '<button type="button" class="primary-btn" data-jr38-view="matches">Ver jornada <span aria-hidden="true">↗</span></button>';
      const shortcuts = document.createElement('nav'); shortcuts.className = 'jr38-hero-shortcuts'; shortcuts.setAttribute('aria-label', 'Accesos de la liga');
      shortcuts.innerHTML = '<button type="button" data-jr38-view="matchcenter"><span class="jr38-live-dot" aria-hidden="true"></span> LIVE</button><button type="button" data-jr38-view="matches">JORNADA</button><button type="button" data-jr38-fields>CAMPOS</button>';
      actions.insertAdjacentElement('afterend', shortcuts);
      hero.addEventListener('click', event => {
        const button = event.target.closest('[data-jr38-view],[data-jr38-fields]');
        if (!button) return;
        event.preventDefault();
        if (button.hasAttribute('data-jr38-fields')) window.JRFieldsV38?.navigate();
        else window.showView?.(button.dataset.jr38View);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restoreHero, { once: true });
  else restoreHero();
  window.addEventListener('pageshow', restoreHero);
})();

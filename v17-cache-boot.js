(function(){
  const VERSION = '17';

  async function forceUpdate() {
    try {
      if (!('serviceWorker' in navigator)) return;

      const registration = await navigator.serviceWorker.register('./sw.js?v=' + VERSION, {
        updateViaCache: 'none'
      });

      await registration.update();

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!sessionStorage.getItem('jr-v17-reloaded')) {
          sessionStorage.setItem('jr-v17-reloaded', '1');
          location.reload();
        }
      });
    } catch (err) {
      console.warn('Service worker update:', err);
    }
  }

  window.addEventListener('load', forceUpdate);
})();

const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`;

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(serviceWorkerUrl, {
      scope: import.meta.env.BASE_URL,
    }).catch(() => {
      // Keep startup quiet if the browser blocks service workers in this context.
    });
  });
}

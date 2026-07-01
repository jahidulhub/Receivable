/**
 * Service Worker Update Checker
 * Checks for service worker updates and notifies the user
 */

export const checkForUpdates = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistrations();
    for (const reg of registration) {
      reg.update();
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
};

export const handleServiceWorkerUpdate = () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Notify user of app update
    window.dispatchEvent(new CustomEvent('app:updated'));
  });
};

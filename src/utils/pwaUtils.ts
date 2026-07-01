/**
 * PWA Installation Detection and Promotion
 * This module handles install prompts and app installation detection
 */

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: InstallPromptEvent | null = null;

export const initializeInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as InstallPromptEvent;
    notifyInstallReady();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
    notifyAppInstalled();
  });
};

export const canInstallApp = (): boolean => {
  return deferredPrompt !== null;
};

export const installApp = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Installation failed:', error);
    return false;
  }
};

const notifyInstallReady = () => {
  // Dispatch custom event for app to handle install prompt
  window.dispatchEvent(new CustomEvent('app:installReady'));
};

const notifyAppInstalled = () => {
  // Dispatch custom event for app to handle app installed
  window.dispatchEvent(new CustomEvent('app:installed'));
};

export const isAppInstalled = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

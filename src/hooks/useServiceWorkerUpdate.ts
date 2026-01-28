import { useState, useEffect } from 'react';

interface UseServiceWorkerUpdateReturn {
  newVersionAvailable: boolean;
  updateInstalling: boolean;
  updateServiceWorker: () => void;
  dismissUpdate: () => void;
}

export const useServiceWorkerUpdate = (): UseServiceWorkerUpdateReturn => {
  const [newVersionAvailable, setNewVersionAvailable] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [updateInstalling, setUpdateInstalling] = useState<boolean>(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Nuevo Service Worker encontrado');

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('Nueva versión disponible');
                  setNewVersionAvailable(true);
                  setWaitingWorker(newWorker);
                }
              });
            }
          });

          if (registration.waiting) {
            console.log('Service Worker esperando para activarse');
            setNewVersionAvailable(true);
            setWaitingWorker(registration.waiting);
          }
        })
        .catch((error) => {
          console.log('Error al registrar Service Worker:', error);
        });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Controller cambiado, recargando página');
        window.location.reload();
      });
    }
  }, []);

  const updateServiceWorker = (): void => {
    if (waitingWorker) {
      setUpdateInstalling(true);
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const dismissUpdate = (): void => {
    setNewVersionAvailable(false);
  };

  return {
    newVersionAvailable,
    updateInstalling,
    updateServiceWorker,
    dismissUpdate
  };
};

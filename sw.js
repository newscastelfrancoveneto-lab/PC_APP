// Unico handler PUSH
self.addEventListener('push', event => {
  const data = event.data?.json() || {};

  const title = data.title || 'Nuova Allerta';
  const options = {
    body: data.body || '',
    tag: data.tag || 'arpav',
    icon: '/PC_APP/icon-192.png', // usa la tua icona PWA
    badge: 'badge.png',           // opzionale: metti il path corretto o rimuovi
    vibrate: [200, 100, 200],
    data: { url: data.url || '/PC_APP/' }
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      saveAndBroadcastNotification(data)
    ])
  );
});

// Click sulla notifica: apre l'app
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/PC_APP/')
  );
});

// TODO: implementa davvero openDB() con IndexedDB
async function openDB() {
  // Qui va la tua implementazione IndexedDB (idb, ecc.).
  // Per ora, stub che non rompe nulla.
  return {
    transaction() {
      return {
        objectStore() {
          return { add() {} };
        }
      };
    }
  };
}

// Salva + Broadcast al client
async function saveAndBroadcastNotification(data) {
  const notif = {
    title: data.title || 'Nuova Allerta',
    body: data.body || '',
    timestamp: new Date().toLocaleString('it-IT')
  };

  // 1. Salva in IndexedDB (quando implementi openDB)
  try {
    const db = await openDB();
    const tx = db.transaction('notifications', 'readwrite');
    tx.objectStore('notifications').add(notif);
  } catch (e) {
    // se IndexedDB non è ancora implementata, ignoriamo l'errore
    console.error('Salvataggio IndexedDB fallito', e);
  }

  // 2. Invia alla pagina aperta (se c'è)
  const channel = new BroadcastChannel('notifications-channel');
  channel.postMessage(notif);
}

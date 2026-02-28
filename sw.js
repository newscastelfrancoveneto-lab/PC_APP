self.addEventListener('push', e => {
  const d = e.data?.json() || {};
  e.waitUntil(self.registration.showNotification(d.title || 'ARPAV Alert', {
    body: d.body || '',
    tag:  d.tag  || 'arpav',
    icon: '/PC_APP/icon-192.png',
    vibrate: [200, 100, 200]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/PC_APP/'));
});

self.addEventListener('push', function(event) {
    const data = event.data.json();
    
    // Mostra la notifica di sistema
    const title = data.title || 'Nuova Allerta';
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png',
        data: { url: data.url }
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            // Invia il messaggio alla pagina attiva per aggiornare il menu
            saveAndBroadcastNotification(data)
        ])
    );
});

async function saveAndBroadcastNotification(data) {
    const channel = new BroadcastChannel('notifications-channel');
    const newNotif = {
        title: data.title,
        body: data.body,
        timestamp: new Date().toLocaleString('it-IT')
    };
    
    // Invia alla pagina HTML
    channel.postMessage(newNotif);
}

// In sw.js — aggiungi salvataggio in IndexedDB
async function saveAndBroadcastNotification(data) {
  const notif = {
    title: data.title,
    body: data.body,
    timestamp: new Date().toLocaleString('it-IT')
  };

  // 1. Salva in IndexedDB
  const db = await openDB();
  const tx = db.transaction('notifications', 'readwrite');
  tx.objectStore('notifications').add(notif);

  // 2. Broadcast alla pagina (se aperta)
  const channel = new BroadcastChannel('notifications-channel');
  channel.postMessage(notif);
}


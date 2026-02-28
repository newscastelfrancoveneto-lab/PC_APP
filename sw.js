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

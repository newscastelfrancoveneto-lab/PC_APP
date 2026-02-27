self.addEventListener('push', e => {
  const d = e.data?.json() || {};
  e.waitUntil(self.registration.showNotification(d.title || 'ARPAV Alert', {
    body: d.body || '',
    tag:  d.tag  || 'arpav',
    icon: '/PC_APP/icon-192.png',
    badge: '/PC_APP/icon-192.png',
    vibrate: [200, 100, 200]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/PC_APP/'));
});

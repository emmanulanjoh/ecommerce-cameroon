import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const PushNotifications: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is default and user hasn't been asked recently
      const lastPrompt = localStorage.getItem('notificationPromptShown');
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
      if (Notification.permission === 'default' && 
          (!lastPrompt || now - parseInt(lastPrompt) > oneWeek)) {
        setTimeout(() => setShowPrompt(true), 5000); // Show after 5 seconds
      }
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        
        if (permission === 'granted') {
          // Register for push notifications
          const registration = await navigator.serviceWorker.ready;
          
          // Subscribe to push notifications (would need VAPID keys in production)
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              'BEl62iUYgUivxIkv69yViEuiBIa40HI80NqIUHI80NqIUHI80NqIUHI80NqIUHI80NqIUHI80NqI' // Demo key
            )
          });
          
          // Send subscription to server
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          });
          
          console.log('Push notification subscription successful');
        }
        
        localStorage.setItem('notificationPromptShown', Date.now().toString());
        setShowPrompt(false);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!('Notification' in window)) return null;

  return (
    <Snackbar
      open={showPrompt && permission === 'default'}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="info"
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<Notifications />}
            onClick={requestPermission}
            sx={{ fontWeight: 600 }}
          >
            Enable
          </Button>
        }
        onClose={() => setShowPrompt(false)}
      >
        Get notified about new products and offers!
      </Alert>
    </Snackbar>
  );
};

export default PushNotifications;
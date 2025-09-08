import express, { Request, Response } from 'express';
const webpush = require('web-push');

const router = express.Router();

// Configure web-push only if keys are provided
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@findallsourcing.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Store subscriptions (in production, use database)
const subscriptions: any[] = [];

// Subscribe to push notifications
router.post('/subscribe', (req: Request, res: Response) => {
  const subscription = req.body;
  
  // Store subscription
  subscriptions.push(subscription);
  
  res.status(201).json({ message: 'Subscription successful' });
});

// Send notification to all subscribers
router.post('/send', async (req: Request, res: Response) => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(503).json({ error: 'Push notifications not configured' });
  }

  const { title, body, url } = req.body;
  
  const payload = JSON.stringify({
    title: title || 'Findall Sourcing',
    body: body || 'New notification!',
    url: url || '/',
    icon: '/logo192.png'
  });

  try {
    const promises = subscriptions.map(subscription =>
      webpush.sendNotification(subscription, payload)
    );
    
    await Promise.all(promises);
    res.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// Send notification for new order
router.post('/order-update', async (req: Request, res: Response) => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(503).json({ error: 'Push notifications not configured' });
  }

  const { orderId, status } = req.body;
  
  const payload = JSON.stringify({
    title: 'Order Update',
    body: `Your order #${orderId.slice(-8)} is now ${status}`,
    url: '/dashboard',
    icon: '/logo192.png'
  });

  try {
    const promises = subscriptions.map(subscription =>
      webpush.sendNotification(subscription, payload)
    );
    
    await Promise.all(promises);
    res.json({ message: 'Order notification sent' });
  } catch (error) {
    console.error('Error sending order notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export { router };
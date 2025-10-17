// import { useEffect } from 'react';

export const useActivityTracker = () => {
  const trackActivity = async (productId: string, action: 'view' | 'cart' | 'purchase' | 'wishlist') => {
    try {
      const sessionId = getOrCreateSessionId();
      
      await fetch('/api/search/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action,
          sessionId
        })
      });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  };

  const getOrCreateSessionId = (): string => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  return { trackActivity };
};
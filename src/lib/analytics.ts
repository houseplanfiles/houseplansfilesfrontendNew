import { config } from './config';

export const trackAnalytics = async (
  type: 'user' | 'product' | 'plan' | 'sellerProduct',
  id: string,
  action: 'view' | 'contact' | 'whatsapp_click' | 'call_click'
) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, id, action }),
    });

    if (!response.ok) {
      console.error('Failed to track analytics');
    }
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
};

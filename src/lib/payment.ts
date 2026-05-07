export const PAYMENT_API_KEY = import.meta.env.VITE_PAYMENT_API_KEY || 'd0d945b8684f414ea3fe363944e9c474';
export const PAYMENT_RECIPIENT = import.meta.env.VITE_PAYMENT_RECIPIENT || 'susankufakunesu@gmail.com';

export async function createPaymentOrder(orderId: string, amount: number, sender: string = '+263780070488', currency: string = 'ZWG', returnUrl?: string) {
  const roundedAmount = Number(amount.toFixed(2));
  
  const response = await fetch('/api/payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': PAYMENT_API_KEY,
    },
    body: JSON.stringify({
      order_id: orderId,
      sender: sender,
      recipient: PAYMENT_RECIPIENT,
      amount: roundedAmount,
      currency: currency,
      redirect_url: returnUrl,
    }),
  });

  const data = await response.json();
  return data;
}

export async function checkPaymentStatus(orderId: string) {
  const response = await fetch('/api/payment/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': PAYMENT_API_KEY,
    },
    body: JSON.stringify({
      order_id: orderId,
      recipient: PAYMENT_RECIPIENT,
    }),
  });

  const data = await response.json();
  return data;
}

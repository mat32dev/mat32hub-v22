
export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'succeeded' | 'processing' | 'requires_payment_method';
  clientSecret: string;
}

class StripeService {
  async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    // Simulate API call to Stripe
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      status: 'requires_payment_method',
      clientSecret: `secret_${Math.random().toString(36).substr(2, 20)}`
    };
  }

  async confirmPayment(paymentMethodId: string): Promise<boolean> {
    // Simulate card processing logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 95% success rate for simulation
    return Math.random() < 0.95;
  }

  validateCard(number: string, expiry: string, cvc: string): boolean {
    const cleanNumber = number.replace(/\s+/g, '');
    return cleanNumber.length >= 15 && expiry.includes('/') && cvc.length >= 3;
  }
}

export const stripeService = new StripeService();

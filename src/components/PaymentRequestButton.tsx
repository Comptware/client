// components/PaymentRequestButton.tsx
'use client';

import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { Stripe, PaymentRequest, StripeError, PaymentIntent } from '@stripe/stripe-js';

// Define interface for payment status
interface PaymentStatus {
  type: 'success' | 'error';
  message: string;
  intentId?: string;
  amount?: number;
  created?: number;
}

// Define props interface
interface PaymentRequestButtonProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
}

const PaymentRequestButton = ({ clientSecret, amount, currency,onSuccess }: PaymentRequestButtonProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    if (!stripe || !elements) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: currency.toLowerCase(),
      total: {
        label: 'SunCore Purchase',
        amount: Math.round(amount * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
        console.log('canMakePayment result:', result);
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (ev) => {
        console.log('PaymentMethodEvent:', ev);
      setLoading(true);
      try {
        // const { paymentIntent, error } = await stripe.confirmPayment({
        const result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: ev.paymentMethod.id, // Move payment_method inside confirmParams
            return_url: `${window.location.origin}/dashboard`,
          },
        });

        console.log(result,'response from apple/google-pay===')

        // if (error) {
        //   setStatus({ type: 'error', message: error.message || 'Payment failed' });
        //   ev.complete('fail');
        // } else if (paymentIntent) {
        //   setStatus({
        //     type: 'success',
        //     message: 'Payment successful!',
        //     intentId: paymentIntent.id,
        //     amount: paymentIntent.amount,
        //     created: paymentIntent.created,
        //   });
        //   ev.complete('success');
        // }
      } catch (err) {
        setStatus({ type: 'error', message: 'Unexpected error during payment' });
        ev.complete('fail');
      } finally {
        setLoading(false);
      }
    });
  }, [stripe, elements, clientSecret, amount, currency]);

  if (!paymentRequest) return null;

  return (
    <div className="space-y-4">
      <PaymentRequestButtonElement options={{ paymentRequest }} />
      {status && (
        <div
          className={`flex items-start gap-2 text-sm font-medium rounded-lg p-3 ${
            status.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
          )}
          <div>
            <p>{status.message}</p>
            {status.type === 'success' && (
              <div className="mt-1 text-gray-600 space-y-1 text-xs">
                <p><strong>Payment ID:</strong> {status.intentId}</p>
                <p><strong>Amount:</strong> ${(status.amount! / 100).toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(status.created! * 1000).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>Processing payment...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentRequestButton;
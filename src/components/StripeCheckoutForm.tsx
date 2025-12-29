// // components/StripeCheckoutForm.tsx
'use client';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PaymentStatus = {
  type: 'success' | 'error';
  message: string;
  intentId?: string;
  amount?: number;
  created?: number;
};
interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess?: () => void;
}

const StripeCheckoutForm = ({ clientSecret, onSuccess }: StripeCheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setStatus(null);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.paymentIntent?.status === 'succeeded') {
    onSuccess?.();
  }

    if (result.error) {
      setStatus({ type: 'error', message: result.error.message || 'Payment failed.' });
    } else if (result.paymentIntent?.status === 'succeeded') {
      const intent = result.paymentIntent;

      setStatus({
        type: 'success',
        message: 'Payment successful!',
        intentId: intent.id,
        amount: intent.amount,
        created: intent.created,
      });

      // Clear card form
      elements.getElement(CardElement)?.clear();

      // Redirect after 3 seconds
      setTimeout(() => {
        // router.push('/dashboard');
      }, 6000);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-200 mb-8"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  fontFamily: 'Arial, sans-serif',
                  '::placeholder': {
                    color: '#a0aec0',
                  },
                },
                invalid: {
                  color: '#e53e3e',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full inline-flex items-center justify-center bg-blue-600 text-white border px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing…
          </>
        ) : (
          'Pay Now'
        )}
      </button>

      {status && (
        <div
          className={`flex items-start gap-2 text-sm font-medium rounded-lg p-3 ${
            status.type === 'success'
              ? 'text-green-700 bg-green-100'
              : 'text-red-700 bg-red-100'
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
    </form>
  );
};

export default StripeCheckoutForm;





// // components/StripeCheckoutForm.tsx
// 'use client';

// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { useState } from 'react';
// import { Loader2, CheckCircle, XCircle } from 'lucide-react'; // Optional: icon feedback

// const StripeCheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     setStatus(null);

//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement)!,
//       },
//     });

//     if (result.error) {
//       setStatus({ type: 'error', message: result.error.message || 'Payment failed.' });
//     } else if (result.paymentIntent?.status === 'succeeded') {
//       setStatus({ type: 'success', message: 'Payment successful!' });
//     }

//     setLoading(false);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md w-full bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-200"
//     >
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Card Details</label>
//         <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: '16px',
//                   color: '#32325d',
//                   fontFamily: 'Arial, sans-serif',
//                   '::placeholder': {
//                     color: '#a0aec0',
//                   },
//                 },
//                 invalid: {
//                   color: '#e53e3e',
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className="w-full inline-flex items-center justify-center bg-blue-600 text-blue px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
//       >
//         {loading ? (
//           <>
//             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//             Processing…
//           </>
//         ) : (
//           'Pay Now'
//         )}
//       </button>

//       {status && (
//         <div
//           className={`flex items-center gap-2 text-sm font-medium rounded-lg p-3 ${
//             status.type === 'success'
//               ? 'text-green-700 bg-green-100'
//               : 'text-red-700 bg-red-100'
//           }`}
//         >
//           {status.type === 'success' ? (
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           ) : (
//             <XCircle className="w-5 h-5 text-red-500" />
//           )}
//           {status.message}
//         </div>
//       )}
//     </form>
//   );
// };

// export default StripeCheckoutForm;
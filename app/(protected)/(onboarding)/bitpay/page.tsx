'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { useGetCartQuery } from '@/store/features/cart/cartApi';
import { useCreateBitpayInvoiceMutation } from '@/store/features/payment/paymentApi';
import { formatCurrency } from '@/utils/formatCurrency';

export default function BitPayPageClient() {
  const { token, user } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const { data: cart } = useGetCartQuery(undefined, { skip: !token });
  const [createBitpayInvoice] = useCreateBitpayInvoiceMutation();
  const [loading, setLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');

  const handleBitPay = async () => {
    setLoading(true);
    try {
      if (!user?.depositPaid) {
        alert('You can only use BitPay for remaining balance payments.');
        router.push('/payment');
        return;
      }

      const { paymentUrl } = await createBitpayInvoice().unwrap();
      setInvoiceUrl(paymentUrl);
      window.open(paymentUrl, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold">Pay with BitPay</h2>

      {invoiceUrl ? (
        <p className="text-green-600 font-medium">
          Invoice created successfully. Please check the opened tab to complete your payment.
        </p>
      ) : (
        <>
          <p className="text-gray-600">
            Remaining Balance:{' '}
            {cart
              ? `${cart.currencySymbol}${formatCurrency(cart.remainingAmount)}`
              : '--'}
          </p>

          <button
            onClick={handleBitPay}
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Creating BitPay Invoice…' : 'Pay via BitPay'}
          </button>
        </>
      )}
        <Link
                  href="/payment"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Pay with Stripe
                </Link>
    </motion.div>
  );
}



// import BitPayPageClient from './BitPayPageClient';

// export default function BitPayPage() {
//   return <BitPayPageClient />;
// }

//app/(protected)/(onboarding)/payment/PaymentPageClient.tsx
'use client';

import PaymentRequestButton from '@/components/PaymentRequestButton';
import StripeCheckoutForm from '@/components/StripeCheckoutForm';
import {
    useGetCartQuery,
    useRemoveCartItemMutation,
    useUpdateCartItemMutation,
} from '@/store/features/cart/cartApi';
import {
    useCreateDepositIntentMutation,
    useCreatePaymentIntentMutation,
} from '@/store/features/payment/paymentApi';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PaymentPageClient() {
  const { token, user } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'deposit' | 'balance' | null>(null);

  const [createDepositIntent] = useCreateDepositIntentMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [updateCartItem, { isLoading: updating }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: removing }] = useRemoveCartItemMutation();

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(undefined, {
    skip: !token,
  });

  const cart = cartData ?? {
    items: [],
    totalAmount: 0,
    remainingAmount: 0,
    currency: 'USD',
    currencySymbol: '$',
    depositApplied: 0,
    status: 'ABANDONED',
  };

  const paymentAmount = user?.depositPaid
    ? cart.remainingAmount ?? cart.totalAmount
    : user?.depositAmount ?? 0;

  const loading = cartLoading || updating || removing;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPayment(true);

    try {
      if (!user) throw new Error('User not found');

      // Redirect if KYC not approved
      if (user.kycStatus !== 'APPROVED') {
        router.push('/kyc');
        return;
      }

      // Step 1: Deposit (Stripe only)
      if (!user.depositPaid) {
        setPaymentStep('deposit');
        const { clientSecret } = await createDepositIntent().unwrap();
        setClientSecret(clientSecret);
        return;
      }

      // Step 2: Balance payment (Stripe)
      setPaymentStep('balance');
      const { clientSecret } = await createPaymentIntent().unwrap();
      setClientSecret(clientSecret);
    } finally {
      setLoadingPayment(false);
    }
  };

  const updateItem = async (item: CartItem, newQuantity: number) => {
    await updateCartItem({
      productType: item.productType,
      quantity: newQuantity,
      asicSpec: item.asicSpec ?? undefined,
    }).unwrap();
  };

  const removeItem = async (item: CartItem) => {
    await removeCartItem({
      productType: item.productType,
      asicSpec: item.asicSpec ?? undefined,
    }).unwrap();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold">Stripe Checkout</h2>

      <div className="space-y-4">
        {cart.items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          cart.items.map((item) => (
            <div
              key={`${item.productType}-${item.asicSpec?.model ?? 'default'}`}
              className="flex justify-between border-b py-2"
            >
              <div>
                <p className="font-medium">{item.productType}</p>
                {item.asicSpec && (
                  <p className="text-gray-500 text-sm">
                    {item.asicSpec.model} — {item.asicSpec.hashRate}
                  </p>
                )}
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                <p className="text-gray-600 text-sm">
                  Sub-Total: {cart.currencySymbol}
                  {formatCurrency(item.totalPrice ?? 0)}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => updateItem(item, item.quantity + 1)}
                  disabled={loading}
                  className="text-blue-600 hover:underline"
                >
                  +1
                </button>
                <button
                  onClick={() => updateItem(item, Math.max(1, item.quantity - 1))}
                  disabled={loading}
                  className="text-blue-600 hover:underline"
                >
                  -1
                </button>
                <button
                  onClick={() => removeItem(item)}
                  disabled={loading}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        <p className="font-bold text-lg mt-2">
          {user?.depositPaid
            ? `Remaining Balance: ${cart.currencySymbol}${formatCurrency(cart.remainingAmount)}`
            : `Deposit: ${cart.currencySymbol}${formatCurrency(paymentAmount)}`}
        </p>
      </div>

      {clientSecret ? (
        <>
          <PaymentRequestButton
            clientSecret={clientSecret}
            amount={paymentAmount}
            currency={cart.currency}
            onSuccess={() =>
              router.push(paymentStep === 'deposit' ? '/sign-agreement' : '/dashboard')
            }
          />

          <StripeCheckoutForm
            clientSecret={clientSecret}
            onSuccess={() =>
              router.push(paymentStep === 'deposit' ? '/sign-agreement' : '/dashboard')
            }
          />
        </>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <button
            type="submit"
            disabled={loadingPayment || cart.items.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingPayment
              ? 'Processing…'
              : user?.depositPaid
              ? 'Pay Remaining Balance (Stripe)'
              : `Pay Deposit ${cart.currencySymbol}${formatCurrency(paymentAmount)}`}
          </button>
        </form>
      )}

      {user?.depositPaid && (
        <div className="text-center mt-4">
          <Link href="/bitpay" className="text-blue-600 hover:underline">
            Prefer Bitcoin / BitPay instead?
          </Link>
        </div>
      )}

      <Link href="/auth/logout" className="ml-4 hover:underline">
        Logout
      </Link>
    </motion.div>
  );
}
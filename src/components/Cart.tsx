'use client';

import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '@/store/features/cart/cartApi';
import { CartItem } from '@/types';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function Cart() {
  const router = useRouter();

  // ✅ Fetch cart data (automatically refetches when invalidated)
 const { token } = useAppSelector((state) => state.auth);

  const {
    data: cart,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCartQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  // ✅ Mutations
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  // ✅ Handlers
  const handleUpdateItem = async (item: CartItem, newQuantity: number) => {
  await updateCartItem({
    productType: item.productType,
    quantity: newQuantity,
    asicSpec: item.asicSpec ?? undefined,
  }).unwrap();
};

const handleRemoveItem = async (item: CartItem) => {
await removeCartItem({
productType: item.productType,
asicSpec: item.asicSpec ?? undefined,
}).unwrap();
};

  const handleClearCart = async () => {
await clearCart().unwrap();
};

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="bg-white text-center rounded-xl shadow-lg md:p-8 p-2 max-w-xl w-full">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  // ✅ Error state
  if (isError) {
    return (
      <div className="bg-white text-center rounded-xl shadow-lg md:p-8 p-2 max-w-xl w-full">
        <p className="text-red-600 text-sm">
          {(error as any)?.data?.message || 'Failed to load cart'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-center rounded-xl shadow-lg md:p-8 p-2 max-w-xl w-full">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      {!cart || cart.items?.length === 0 ? (
        <div>
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              key={`${item.productType}-${item.asicSpec?.model ?? 'default'}`}
              className="flex justify-between border-b pb-2"
            >
              <div className="text-left">
                <p className="font-medium">{item.productType}</p>
                {item.asicSpec && (
                  <p className="text-gray-500 text-sm">
                    {item.asicSpec.model} — {item.asicSpec.hashRate}
                  </p>
                )}
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <p className="text-gray-600">
                  Unit: {cart.currencySymbol}
                  {formatCurrency(item.unitPrice ?? 0)}
                </p>
                <p className="text-gray-600 text-sm">
                  Sub-Total: {cart.currencySymbol}
                  {formatCurrency(item.totalPrice ?? 0)}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleUpdateItem(item, item.quantity + 1)}
                  disabled={isUpdating}
                  className="text-blue-600 hover:underline"
                >
                  +1
                </button>
                <button
                  onClick={() =>
                    handleUpdateItem(item, Math.max(1, item.quantity - 1))
                  }
                  disabled={isUpdating}
                  className="text-blue-600 hover:underline"
                >
                  -1
                </button>
                <button
                  onClick={() => handleRemoveItem(item)}
                  disabled={isRemoving}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <p className="font-bold text-lg mt-4">
            Total: {cart.currencySymbol}
            {formatCurrency(cart.totalAmount)}
          </p>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push('/products')}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Back to Products
            </button>
            <button
              onClick={() => router.push('/payment')}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
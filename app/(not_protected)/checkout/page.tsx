// app/(not_protected)/checkout/page.tsx
'use client';

import { useGetCartQuery, useGetProductsQuery, useRemoveCartItemMutation,
  useUpdateCartItemMutation } from "@/store/features/cart/cartApi";
import { removeGuestCartItem, updateGuestCartItem } from "@/store/features/cart/guestCartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CartItem, ProductsResponse } from "@/types";
import { handleError } from "@/utils/errorHandler";
import { formatCart } from "@/utils/formatCart";
import { formatCurrency } from "@/utils/formatCurrency";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, user } = useAppSelector((s) => s.auth);
  const { user: authUser, isLoading: authLoading } = useUser();

  const guestCart = useAppSelector((s) => s.guestCart);
  const {
    data: cart,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCartQuery(undefined, { skip: !token });

  const userCart = user ? cart : guestCart;

  const { data, error: productError } = useGetProductsQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  // State for inline editing
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [savingCart, setSavingCart] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  if (productError)
    return (
      <p className="text-red-600">{handleError(error, { showToast: true, forUI: true })}</p>
    );
  if (!data) return null;

  const { products } = data as ProductsResponse;

  const updatedCart = formatCart(userCart, products);

  const getItemKey = (item: CartItem) => {
    return item.productType + (item.asicSpec?.model || "");
  };

  const handleEdit = (item: CartItem) => {
    setEditingItem(getItemKey(item));
    setEditQuantity(item.quantity);
  };

  const handleSaveEdit = async (item: CartItem) => {
    if (editQuantity > 0) {
      const itemKey = getItemKey(item);
      try {
        setUpdatingItem(itemKey);
        if (user) {
          await updateCartItem({
            productType: item.productType,
            quantity: editQuantity,
            asicSpec: item.asicSpec ?? undefined,
          }).unwrap();
        } else {
          dispatch(updateGuestCartItem({
            productType: item.productType,
            unitPrice: item.unitPrice,
            quantity: editQuantity,
            asicSpec: item.asicSpec ?? undefined,
          }));
        }
        setEditingItem(null);
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setUpdatingItem(null);
      }
    }
  };

  const handleRemove = async (item: CartItem) => {
    const itemKey = getItemKey(item);
    try {
      setRemovingItem(itemKey);
      if (user) {
        await removeCartItem({
          productType: item.productType,
          asicSpec: item.asicSpec ?? undefined,
        }).unwrap();
      } else {
        dispatch(removeGuestCartItem(item));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setRemovingItem(null);
    }
  };

  const handleNext = async () => {
    try {
      setNavigating(true);
      if ((!authUser && !authLoading) && (!token || !user)) {
        router.push("/auth/login");
      } else {
        router.push("/wallet");
      }
    } finally {
      // Note: We don't set navigating to false because the page will unmount during navigation
    }
  };

  const handleBackToProducts = () => {
    router.push("/bundles");
  };

  const handleSave = async () => {
    try {
      setSavingCart(true);
      // Cart is already saved via Redux/API mutations
      console.log("Cart saved", updatedCart);
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error saving cart:", error);
    } finally {
      setSavingCart(false);
    }
  };

  return (
    <>
      <section id="Cart" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-dark font-normal mb-4 font-caslon md:text-left text-center">
                Self-guided purchase
              </p>
            </div>
            <div className="flex-1 text-right my-auto">
              <button
                onClick={handleSave}
                disabled={savingCart}
                className="inline-block bg-cyan-400 text-white font-black rounded-full hover:bg-cyan-500 px-10 py-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
              >
                {savingCart ? <LoadingSpinner size="sm" /> : "Save"}
              </button>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />

          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-xl font-black text-gray-500">Loading cart...</p>
            </div>
          ) : (
            <>
              <div className="mx-4 mt-8">
                <h2 className="md:text-2xl text-xl font-black mb-6">Your bundle:</h2>

                {isError && <p className="text-red-600 w-full text-center mb-4">{(error as any)?.data?.message || 'Failed to load cart'}</p>}

                {updatedCart && updatedCart.items.length > 0 ? (
                  updatedCart.items.map((item, index) => {
                    const itemKey = getItemKey(item);
                    const isEditing = editingItem === itemKey;

                    return (
                      <div key={index} className="mb-8 border-b border-gray-200 pb-6">
                        <h3 className="md:text-xl text-lg font-black text-blue mb-2">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {item.description}
                        </p>
                        {item.asicSpec && (
                          <p className="text-sm text-gray-600 mb-4">
                            {item.asicSpec.model} — {item.asicSpec.hashRate}
                          </p>
                        )}

                        {isEditing ? (
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-bold">Qty:</label>
                              <input
                                type="number"
                                min="1"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                                className="border border-gray-300 rounded px-3 py-1 w-20"
                              />
                            </div>
                            <div>
                              <p className="text-sm">
                                Unit: {updatedCart.currencySymbol}
                                {formatCurrency(item.unitPrice)}
                              </p>
                              <p className="text-sm font-bold">
                                Subtotal: {updatedCart.currencySymbol}
                                {formatCurrency(item.unitPrice * editQuantity)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 mb-4">
                            <p className="text-sm">Qty: {item.quantity}</p>
                            <p className="text-sm">
                              Unit: {updatedCart.currencySymbol}
                              {formatCurrency(item.unitPrice)}
                            </p>
                            <p className="text-sm font-bold">
                              Subtotal: {updatedCart.currencySymbol}
                              {formatCurrency(item.totalPrice)}
                            </p>
                          </div>
                        )}

                        <div className="flex space-x-4">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(item)}
                                disabled={updatingItem === itemKey}
                                className="bg-primary text-white font-black rounded-full hover:bg-blue-700 px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
                              >
                                {updatingItem === itemKey ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  "Save"
                                )}
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                disabled={updatingItem === itemKey}
                                className="bg-gray-300 text-dark font-black rounded-full hover:bg-gray-400 px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={removingItem === itemKey}
                                className="bg-primary text-white font-black rounded-full hover:bg-blue-700 px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleRemove(item)}
                                disabled={removingItem === itemKey}
                                className="bg-primary text-white font-black rounded-full hover:bg-blue-700 px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
                              >
                                {removingItem === itemKey ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  "Remove"
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full p-4 text-center">
                      <p className="text-red-600 text-sm mb-4">Cart Empty</p>
                      <Link
                        href="/bundles"
                        className="inline-block bg-primary text-white font-medium rounded-full hover:bg-blue-700 px-10 py-2"
                      >
                        Go to Bundle
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="mx-4 mt-8 mb-10">
                <h2 className="md:text-3xl text-2xl font-black mb-8">
                  Your bundle total: {updatedCart.currencySymbol}
                  {formatCurrency(updatedCart.totalAmount)}
                </h2>

                <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
                  <button
                    onClick={handleBackToProducts}
                    className="bg-primary text-white font-black rounded-full hover:bg-blue-700 px-10 py-2"
                  >
                    Back to Products
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={navigating || updatedCart.items.length <= 0}
                    className="bg-primary text-white font-black rounded-full hover:bg-blue-700 px-10 py-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
                  >
                    {navigating ? <LoadingSpinner size="sm" /> : "Next"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

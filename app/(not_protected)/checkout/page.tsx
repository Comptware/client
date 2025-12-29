// app/(protected)/checkout/page.tsx
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
import { useEffect } from "react";

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
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

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

  const onUpdateCart = async (item: CartItem, newQuantity: number) => {
    if (user) {
      await updateCartItem({
        productType: item.productType,
        quantity: newQuantity,
        asicSpec: item.asicSpec ?? undefined,
      }).unwrap();
    } else {
      dispatch(updateGuestCartItem({
        productType: item.productType,
        unitPrice: item.unitPrice,
        quantity: newQuantity,
        asicSpec: item.asicSpec ?? undefined,
      }));
    }
  }

  const onRemoveCart = async (item: CartItem) => {
    if (user) {
      await removeCartItem({
        productType: item.productType,
        asicSpec: item.asicSpec ?? undefined,
      }).unwrap();
    } else {
      dispatch(removeGuestCartItem(item));
    }
  }
  
  const onClickNext = () => {
    if ((!authUser && !authLoading) && (!token || !user)) {
      router.push("/auth/login");
    } else {
      router.push(`/wallet`);
    }
  }

  return ( 
    <>
      <section id="Intro" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-dark font-normal mb-4 font-caslon md:text-left text-center">Self-guided purchase</p>
            </div>
            <div className="flex-1 text-right my-auto">
              <button
                disabled={updatedCart.items.length <= 0 || isLoading}
                onClick={() => onClickNext()}
                className="disabled:opacity-50 disabled:cursor-not-allowed inline-block bg-primary text-white font-black rounded-full hover:bg-light-blue px-10 py-2 mr-4"
              >
                Next
              </button>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-dark font-black font-gibson mb-4 md:text-left text-center ">Your bundle:</p>
            </div>
          </div>
          {isError && <p className="text-red-600 w-full text-center">{(error as any)?.data?.message || 'Failed to load cart'}</p>}
          {isLoading && <p className="text-black w-full text-center">Loading Cart...</p>}
          {updatedCart || updatedCart.items.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="w-full py-4">
                {[...updatedCart.items].reverse().map((item, index) => (
                <div key={index} className="mb-8">
                  <h1 className="md:text-2xl text-xl font-black text-primary">{item.label}</h1>
                  <p className="text-lg text-dark">{item.description}</p>
                  {item.asicSpec ? (
                    <p className="text-lg text-dark">{item.asicSpec?.model} — {item.asicSpec?.hashRate}, </p>
                  ) : (<></>) }
                  <p className="md:text-xl text-lg mt-4">Unit: {updatedCart.currencySymbol} {formatCurrency(item.unitPrice ?? 0)}</p>
                  <p className="md:text-xl text-lg mb-4"><strong>Total: {updatedCart.currencySymbol} {formatCurrency(item.totalPrice ?? 0)}</strong></p>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div>
                      <div className="flex items-center space-x-4">
                        { item.quantity === 1 ? (
                        <button 
                          disabled={isRemoving}
                          onClick={() => onRemoveCart(item)}
                          className="border border-gray-600 text-dark px-4 py-1 rounded hover:bg-gray-100">
                          - 
                        </button>) : (
                          <button 
                          disabled={isUpdating}
                          onClick={() => onUpdateCart(item, Math.max(1, item.quantity - 1))}
                          className="border border-gray-600 text-dark px-4 py-1 rounded hover:bg-gray-100">
                          - 
                        </button>
                        )}
  
                        <span id="counter" className="md:text-xl text-lg w-10 text-center">{item.quantity}</span>
  
                        <button 
                          disabled={isUpdating}
                          onClick={() => onUpdateCart(item, item.quantity + 1)}
                          className="border border-gray-600 text-dark px-4 py-1 rounded hover:bg-gray-100">
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <button 
                        disabled={isRemoving}
                        onClick={() => onRemoveCart(item)}
                        className="inline-block bg-primary text-white rounded-full hover:bg-blue-700 px-8 py-1">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                ))}
                
              </div>
              <div className="w-full py-4">
                <div className="mb-8">
                  <p className="md:text-5xl text-3xl text-dark font-normal mb-4 md:text-left text-center">Your bundle total is: {updatedCart.currencySymbol} {formatCurrency(updatedCart.totalAmount)}</p>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link href="/bundles" className="rounded-full bg-primary px-8 py-2 text-lg font-black text-white duration-300 ease-in-out hover:bg-light-blue">
                    Back To Products
                  </Link>
                  </div>
                </div>
              </div>
            </div>
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
      </section>
    </>
  )
}
'use client';

import { useAddToCartMutation, useGetCartQuery, useGetProductsQuery } from "@/store/features/cart/cartApi";
import { addGuestCartItem } from "@/store/features/cart/guestCartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Product, ProductsResponse } from "@/types";
import { handleError } from "@/utils/errorHandler";
import { formatCart } from "@/utils/formatCart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BundlesDetails = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.auth);
  const boosterRef = useRef<HTMLInputElement>(null);
  const guestCart = useAppSelector((s) => s.guestCart);
  const [localError, setLocalError] = useState('');

  const {
    data: cart,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCartQuery(undefined, { skip: !token });

  const userCart = user ? cart : guestCart;

  const { data, error: productError, isLoading: isProductLoading } = useGetProductsQuery();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);
  
  const onAddBooster = () => {
    if (boosterRef.current) {
      boosterRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      boosterRef.current.focus();
    }
  }

  const onAddToCart = async (product: Product, asicId?: string) => {
    const selectedProduct = product;
    const selectedAsicSpecId = asicId ?? null;

    try {
      const selectedSpec =
          selectedAsicSpecId && asicSpecs.find((s) => s.id === selectedAsicSpecId);
          
      if (!user) {
        dispatch(addGuestCartItem({
          productType: selectedProduct.value,
          quantity: 1,
          prices: selectedProduct.prices,
          country: selectedProduct.country,
          currency: selectedProduct.currency,
          currencySymbol: selectedProduct.currencySymbol,
          asicSpec: selectedSpec
            ? {
                model: selectedSpec.model,
                hashRate: selectedSpec.hashRate,
                power: selectedSpec.power,
                efficiency: selectedSpec.efficiency,
              }
            : undefined,
        }));
      } else {
        await addToCart({
          productType: selectedProduct.value,
          quantity: 1,
          country: selectedProduct.country,
          currency: selectedProduct.currency,
          asicSpec: selectedSpec
            ? {
                model: selectedSpec.model,
                hashRate: selectedSpec.hashRate,
                power: selectedSpec.power,
                efficiency: selectedSpec.efficiency,
              }
            : undefined,
        }).unwrap();
      }
      router.push('/checkout');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to add item');
    }
  }

  if (productError)
    return (
      <p className="text-red-600">{handleError(error, { showToast: true, forUI: true })}</p>
    );
  if (!data) return null;

  const { products, asicSpecs } = data as ProductsResponse;
  const boosters = products.filter((p) => p.isBooster);

  const updatedCart = formatCart(userCart, products);

  return (
    <>
      <section id="Intro" className="pt-20 pb-4">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-gray-font font-normal mb-4 font-caslon md:text-left text-center ">Self-guided purchase</p>
            </div>
            <div className="flex-1 text-right my-auto">
              <button
                onClick={() => onAddBooster()}
                className="inline-block bg-primary text-white font-black rounded-full hover:bg-light-blue px-10 py-2 mr-4"
              >
                Add Booster
              </button>
              <Link
                href="/checkout"
                className="inline-block bg-primary text-white font-black rounded-full hover:bg-light-blue px-10 py-2 mr-4"
              >
                Checkout
              </Link>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-gray-font font-normal mb-4 md:text-left text-center ">Confirm Bundle Selection</p>
            </div>
          </div>
        </div>
      </section>

      <section id="selection" className="pb-4">
        <div className="container">
          {isError && <p className="text-red-600 w-full text-center">{(error as any)?.data?.message || 'Failed to load cart'}</p>}
          {isLoading && <p className="text-black w-full text-center">Loading Cart...</p>}
          {!updatedCart || updatedCart.items?.length === 0 ? (
            <p className="text-black w-full text-center">Cart Empty</p>
          ) : (
            <div className="relative mb-10">
              {[...updatedCart.items].reverse().map((item, index) => {
                return (<div key={index} className="relative bg-sky-blue border border-primary hover:shadow-md rounded-2xl p-5 flex space-x-6 mb-4">
                  <div className="rounded-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/products/prod_slide1.png`}
                      alt="Product Image"
                      width={250}
                      height={250}
                      className="inline"
                      loading='lazy'
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="rounded-full absolute right-5 top-5 text-right">
                      <Link
                        href="/bundles"
                        className="inline-block bg-primary text-white font-medium rounded-full hover:bg-blue-700 px-10 py-2"
                      >
                        Go to Bundle
                      </Link>
                    </div>
                    <h1 className="md:text-3xl text-2xl text-dark mb-4">Your Bundle</h1>
                    <h2 className="md:text-2xl text-xl font-medium mb-2 md:leading-[1.2] text-blue-600">{item.label}</h2>
                    <p className="text-lg text-dark">{item.description}</p>
                    {item.asicSpec ? (
                    <p className="text-lg text-dark">{item.asicSpec?.model} — {item.asicSpec?.hashRate}, </p>
                    ) : (<></>) }
                    {item.asicSpec ? (
                      <>
                        <p className="md:text-2xl text-xl text-dark my-4">Fully turnkey solution:</p>
                        <ul className="space-y-2 md:text-lg text-sm list-disc pl-5 text-dark-gray ">
                          <li>{item.quantity} High-performance {item.asicSpec?.model}</li>
                          <li>Integrated solar energy and infrastructure</li>
                          <li>Battery energy storage system (BESS)</li>
                          <li>Land, insurance, security, proprietary-enterprise grade technology</li>
                        </ul>
                      </>
                    ) : (<></>)}
                  </div>
                </div>)
                })}
            </div>
          )}
          <hr className="border-primary my-4 w-full" />
        </div>
      </section>

      <section id="Option" className="pb-4">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-gray-font font-normal mb-4 md:text-left text-center">
                <span className="text-blue font-medium">Optional:</span> Add Solar Boost Power Packs for faster returns and immediate access to next-generation ASICs.
              </p>
            </div>
          </div>
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <div className="relative flex space-x-12 mb-4">
                <div className="rounded-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/about/about_img3.jpg`}
                    alt="Slide Image"
                    width={500}
                    height={250}
                    className="inline"
                    loading='lazy'
                  />
                </div>
                <div className="flex flex-col w-full pr-5">
                  <p className="md:text-lg text-sm text-dark-gray mb-2">
                    <span className="text-dark">Accelerate returns</span> — begin mining with new ASICs immediately instead of waiting for solar panel installation
                  </p>
                  <p className="md:text-lg text-sm text-dark-gray mb-2">
                    <span className="text-dark">Cut the line</span> — priority access to the most powerful ASICs as soon as they’re released
                  </p>
                  <p className="md:text-lg text-sm text-dark-gray mb-2">
                    <span className="text-dark">Future-proof your bundle</span> — have energy capacity ready for upgrades and expansions
                  </p>
                  <p className="md:text-lg text-sm text-dark-gray mb-2">
                    <span className="text-dark">No impact on panel life</span> — additional capacity does not shorten the lifespan of your solar infrastructure
                  </p>
                  <p className="md:text-lg text-sm text-dark-gray mb-2">
                    <span className="text-dark">Maximize flexibility</span> — add miners to your portfolio at your pace without infrastructure delays
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="Booster" className="pt-4 pb-20" ref={boosterRef}>
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-gray-font font-normal mb-4 md:text-left text-center">
                Choose from one of the three options below:
              </p>
            </div>
          </div>
          {localError && <p className="text-red-600 w-full text-center">{localError}</p>}
          {isProductLoading ? (
            <p className="text-black w-full text-center">Loading products...</p>
          ) : ( 
            <div className="flex flex-col md:flex-row w-full gap-8 mb-8">
              {boosters.length > 0 && 
                boosters.map((product: Product) => {
                const displayPrice = product.prices.default;
                return (
                  <div key={product.value} className="p-12 m-1 flex-1 flex-col justify-center rounded-2xl shadow-md bg-light-gray">
                    <h1 className="md:text-2xl text-xl font-medium mb-2 md:leading-[1.2] text-blue">{product.label}</h1>
                    <p className="md:text-xl text-lg font-normal mb-4">{product.description}</p>
                    <p className="md:text-xl text-lg font-black mb-4">{product.currencySymbol}{displayPrice.toLocaleString()}</p>
                    <button
                      disabled={isAdding}
                      onClick={() => onAddToCart(product)}
                      className="inline-block bg-primary text-white font-medium rounded-full hover:bg-blue-700 px-10 py-2"
                    >
                      Add to bundle
                    </button>
                  </div>
                  )
              })}        
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BundlesDetails;
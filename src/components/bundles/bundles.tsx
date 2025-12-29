'use client';

import { useAddToCartMutation, useGetProductsQuery } from "@/store/features/cart/cartApi";
import { addGuestCartItem } from "@/store/features/cart/guestCartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AsicSpec, Product, ProductsResponse } from "@/types";
import { handleError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Bundles = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((s) => s.auth);
  const [ localError, setLocalError ] = useState('');
  const { data, error, isLoading } = useGetProductsQuery();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const onAddToCart = async (product: Product, asicId?: string) => {
    const selectedProduct = product;
    const selectedAsicSpecId = asicId ?? null;

    try {
      const selectedSpec =
          selectedAsicSpecId && asicSpecs.find((s) => s.id === selectedAsicSpecId);
          
      if (user) {
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
      } else {
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
      }
      router.push('/bundles/details');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to add item');
    }
  }

  if (error)
    return (
      <p className="text-red-600">{handleError(error, { showToast: true, forUI: true })}</p>
    );
  if (!data) return null;

  const { products, asicSpecs } = data as ProductsResponse;
  const bundles = products.filter((p) => !p.isBooster);

  return (
    <section id="Product" className="py-4">
      <div className="container">
      <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
          <div className="flex-1 relative">
            <p className="md:text-5xl text-3xl text-gray-font font-normal font-caslon">Choose your SunCore Custom Mining Bundle</p>
          </div>
        </div>
        <hr className="border-primary my-8 w-full" />
        {localError && <p className="text-red-600 w-full text-center">{localError}</p>}
        {isLoading ? (
          <p className="text-black w-full text-center">Loading products...</p>
        ) : ( 
          <div className="flex flex-col md:flex-row w-full gap-8 px-10 mb-8">
            {asicSpecs.map((spec:AsicSpec, index) => {
              const specProducts = bundles.filter((p: { specRefs: string | string[]; }) => {
                const refs = Array.isArray(p.specRefs) ? p.specRefs : [p.specRefs];
                return spec.id !== undefined && refs.includes(spec.id);
              });
              if (!specProducts.length) return null;
              return (
                <div key={spec.id} className={`flex-1 p-12 m-1 flex flex-col items-center justify-center rounded-2xl shadow-md 
                ${index % 2 === 0 ? 'bg-sky-blue': 'bg-ice-blue'}`}>
                  <h1 className="md:text-2xl text-xl font-medium mb-1 md:leading-[1.2] text-black">{spec.model}</h1>
                  <p className="md:text-xl text-lg">{spec.hashRate}, {spec.power}, {spec.efficiency}</p>
                  <hr className="border-primary mt-4 mb-8 w-full" />
                  {specProducts.map((product) => {
                    const specPrice = product.prices[spec.model] ?? product.prices.default;
                    return (
                    <div key={product.value + spec.id} className={`hover:bg-white hover:shadow-md border border-primary rounded-2xl p-6 flex flex-col md:flex-row gap-6 w-full md:mx-auto mx-4 shadow-md relative mb-8
                    ${index % 2 === 0 ? 'bg-sky-blue': 'bg-ice-blue'}`}>
                      <div className="flex-1 flex-col justify-center">
                        <h1 className="md:text-2xl text-xl font-medium mb-2 md:leading-[1.2] text-blue">{product.label}</h1>
                        <p className="md:text-xl text-lg font-normal mb-4">{product.description}</p>
                        <h1 className="md:text-2xl text-xl font-medium mb-1 md:leading-[1.2] mb-4">
                          {product.currencySymbol }{specPrice.toLocaleString()}
                          </h1>
                        <button
                          disabled={isAdding}
                          onClick={() => onAddToCart(product, spec.id)}
                          className="inline-block bg-primary text-white font-medium rounded-full hover:bg-blue-700 px-10 py-2"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Bundles;
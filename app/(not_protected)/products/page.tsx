// // app/(not_protected)/products/page.tsx public page
'use client';
import {useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useUser } from '@auth0/nextjs-auth0';
import { ProductsResponse, Product, AsicSpec } from '@/types';
import { handleError } from '@/utils/errorHandler';
import { useGetProductsQuery, useAddToCartMutation, } from '@/store/features/cart/cartApi';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { token, user } = useAppSelector((s) => s.auth);
  const { user: authUser, isLoading: authLoading } = useUser();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [selectedAsicSpecId, setSelectedAsicSpecId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [localError, setLocalError] = useState('');

   const { data, error, isLoading } = useGetProductsQuery();
   const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const openModal = (p: Product, asicId?: string) => {
    setSelectedProduct(p);
    setSelectedAsicSpecId(asicId ?? null);
    setQuantity('1');
    setProductModalOpen(true);
  };

  const handleImageError = (id: string) =>
    setImageErrors((prev) => ({ ...prev, [id]: true }));

  const handleAddToCart = async () => {
  if ((!authUser && !authLoading) && (!token || !user)) {
    window.location.href = `/auth/login`;
    return;
  }

  if (!selectedProduct) return;

  try {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) throw new Error('Invalid quantity');

    const selectedSpec =
      selectedAsicSpecId &&
      data?.asicSpecs.find((s) => s.id === selectedAsicSpecId);

    await addToCart({
      productType: selectedProduct.value,
      quantity: qty,
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

    setProductModalOpen(false);
    router.push('/cart');
  } catch (err: any) {
    setLocalError(err.message || 'Failed to add item');
  }
};

  if (isLoading) return <p className="text-center mt-10">Loading…</p>;
  if (error)
    return (
      <p className="text-red-600">{handleError(error, { showToast: true, forUI: true })}</p>
    );
  if (!data) return null;

  const { products, asicSpecs } = data as ProductsResponse;
  const boosters = products.filter((p) => p.isBooster);
  const bundles = products.filter((p) => !p.isBooster);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Our Products</h2>
      <p className="text-gray-600 text-center mb-8">
        Build your cart freely. Checkout requires KYC approval and a non-refundable deposit.
      </p>

      {asicSpecs.map((spec: AsicSpec) => {
        const specProducts = bundles.filter((p) => {
          const refs = Array.isArray(p.specRefs) ? p.specRefs : [p.specRefs];
          return spec.id !== undefined && refs.includes(spec.id);
        });
        if (!specProducts.length) return null;

        return (
          <section key={spec.id} className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {spec.model} — {spec.hashRate}, {spec.power}, {spec.efficiency}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specProducts.map((product) => {
                const specPrice = product.prices[spec.model] ?? product.prices.default;
                return (
                  <ProductCard
                    key={product.value + spec.id}
                    product={product}
                    specPrice={specPrice}
                    onSelect={(p) => openModal(p, spec.id)}
                    imageErrors={imageErrors}
                    onImageError={handleImageError}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {boosters.length > 0 && (
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Boosters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boosters.map((product) => (
              <ProductCard
                key={product.value}
                product={product}
                onSelect={openModal}
                imageErrors={imageErrors}
                onImageError={handleImageError}
              />
            ))}
          </div>
        </section>
      )}

      {productModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold">{selectedProduct.label}</h3>
            <p className="text-gray-700 mt-2">
              Price: {selectedProduct.currencySymbol}
              {(
                selectedAsicSpecId
                  ? selectedProduct.prices[
                      asicSpecs.find((s) => s.id === selectedAsicSpecId)?.model ?? 'default'
                    ]
                  : selectedProduct.prices.default
              ).toLocaleString()}
            </p>
            <label className="block text-sm font-medium mt-4">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
            {localError && <p className="text-red-600 mt-2">{localError}</p>}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setProductModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isAdding ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}

      {user && <a href="/auth/logout" className="ml-4 hover:underline">Logout</a>}
    </div>
  );
}

function ProductCard({
  product,
  specPrice,
  onSelect,
  imageErrors,
  onImageError,
}: {
  product: Product;
  specPrice?: number;
  onSelect: (p: Product) => void;
  imageErrors: Record<string, boolean>;
  onImageError: (id: string) => void;
}) {
  const displayPrice = specPrice ?? product.prices.default;

  return (
    <div className="bg-white border rounded-lg p-5 hover:shadow-xl transition">
      <Image
        src={
          product.image && !imageErrors[product.value]
            ? product.image
            : '/images/fallback-product.jpg'
        }
        alt={product.label}
        width={800}
        height={160}
        className="h-40 w-full object-cover rounded-md mb-4"
        onError={() => onImageError(product.value)}
      />
      <h4 className="text-xl font-semibold mb-2">{product.label}</h4>
      <p className="text-gray-500 text-sm mb-3">{product.description}</p>
      <p className="text-lg font-medium mb-4">
        {product.currencySymbol}
        {displayPrice.toLocaleString()}
      </p>
      <button
        onClick={() => onSelect(product)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}



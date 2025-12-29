//app/(protected)/(onboarding)/invoice/page.tsx
'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useGetCartQuery } from '@/store/features/cart/cartApi';
import { formatCurrency } from '@/utils/formatCurrency';

export default function InvoicePage() {
  const { token } = useAppSelector((s) => s.auth);

  const { data: cart, isLoading, error } = useGetCartQuery(undefined, {
    skip: !token,
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load cart</p>;
  if (!cart) return <p>No cart data available</p>;

  const itemsCount = cart.items?.reduce((acc: number, i: any) => acc + i.quantity, 0);

  return (
    <>
      <section id="Intro" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-dark font-normal mb-4 font-caslon md:text-left text-center">Self-guided purchase</p>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <p className="md:text-xl text-lg text-dark font-black font-gibson mb-4 text-center md:text-left">Upon receipt, your SunCore bundle(s) will  be activated</p>
              <p className="md:text-xl text-lg text-dark font-gibson mb-4 text-center md:text-left">
              If you have any specific setup requests or need additional services, please let us know. We appreciate your trust in Suncore Digital, and we look forward to supporting your mining efforts, the way nature intended.
              </p>
            </div>
          </div>  
        </div>
      </section>

      <section id="Invoice" className="pb-20">
        <div className="container max-w-2xl">
          <p className="md:text-xl text-lg text-dark font-black font-gibson mb-4 text-center">Invoice</p>
          <div className="border p-4 rounded-md space-y-2">
            <p>
              <strong>Total Amount:</strong> {cart.currencySymbol}
              {formatCurrency(cart.totalAmount)}
            </p>
            <p>
              <strong>Deposit Paid:</strong> {cart.currencySymbol}
              {formatCurrency(cart.totalAmount - cart.remainingAmount)}
            </p>
            <p>
              <strong>Remaining Balance:</strong> {cart.currencySymbol}
              {formatCurrency(cart.remainingAmount)}
            </p>
            <p>
              <strong>Items:</strong> {itemsCount}
            </p>
          </div>
          <div className="space-y-3 p-4">
            {cart.items?.map((item: any) => (
              <div key={item._id} className="border-b pb-2">
                <p className="font-medium">{item.productType}</p>

                {item.asicSpec ? (
                  <p className="text-sm text-gray-600">
                    Model: {item.asicSpec.model} – HashRate: {item.asicSpec.hashRate} – Power:{' '}
                    {item.asicSpec.power} – Efficiency: {item.asicSpec.efficiency}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 italic">No ASIC specs for this item</p>
                )}

                <p>
                  Qty: {item.quantity} &nbsp; Unit Price: {cart.currencySymbol}
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-4 p-4">Pay Remaining Balance</h3>
          <div className="flex md:flex-row flex-col gap-4 mt-2 p-4">
            <Link
              href="/payment"
              className="bg-blue-600 text-white px-4 py-2 text-center md:text-left rounded hover:bg-blue-700"
            >
              Pay with Stripe
            </Link>
            <Link
              href="/bitpay"
              className="bg-green-600 text-white px-4 py-2 text-center md:text-left rounded hover:bg-green-700"
            >
              Pay with BitPay
            </Link>
            <Link
              href="/bank-wire"
              className="bg-gray-700 text-white px-4 py-2 text-center md:text-left rounded hover:bg-gray-800"
            >
              Bank Wire
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


////it's deleted layout.tsx while fixing bug
// import { Header } from "@/components/header/header";

// export default async function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <main>
//         <Header dark={true} />
//         {children}
//       </main>
//     </>
//   );
// }
// app/(protected)/(onboarding)/cart/page.tsx
'use client';

import Cart from '@/components/Cart';
import { Header } from '@/components/header/header';

export default function CartPage() {
  return ( 
    <div
      className="bg-cover bg-center bg-fixed min-h-screen"
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/images/dashbg.jpg)` }}>
      <div className="md:py-0 py-10 mx-auto">
        <Header />
        <div className="flex h-screen">
          <div className="flex-1 flex-col flex items-center justify-center p-6">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  )
}
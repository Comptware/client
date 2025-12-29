//app/(protected)/(onboarding)/payment/page.tsx
'use client';
import { Header } from "@/components/header/header";
import PaymentPageClient from "./PaymentPageClient";

export default function PaymentPage() {

  return (
    <div
      className="bg-cover bg-center bg-fixed min-h-screen"
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/images/dashbg.jpg)` }}>
      <div className="md:py-0 py-10 mx-auto">
        <Header />
        <div className="flex h-screen">
          <div className="flex-1 flex-col flex items-center justify-center p-6">
            <PaymentPageClient/>

            <a href="/auth/logout" className="ml-4 hover:underline">Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
}


// // // app/(protected)/payment/page.tsx B4 ALIP UPDATE
// 'use client';
// import PaymentPageClient from "./PaymentPageClient";

// export default function PaymentPage() {

//   return (
//     <section className="pt-28">
//       <PaymentPageClient/>

//        <a href="/auth/logout" className="ml-4 hover:underline">Logout</a>
//     </section>
//   );
// }
// app/(protected)/dashboard/market/page.tsx
import { redirect } from "next/navigation";
import { auth0 } from "lib/auth0";
import MarketClient from "./MarketClient";

export default async function MarketPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Market</h1>
      <MarketClient />
    </section>
  );
}







//     //app/(protected)/dashboard/market/page.tsx
//     import { redirect } from "next/navigation";
//     import { useQuery } from '@tanstack/react-query';
//     import { getMarketBtcPrice } from '@/api/client';
// import { auth0 } from "lib/auth0";

//     export default async function MarketPage() {
//       const session = await auth0.getSession();
//       if (!session?.user) {
//         redirect("/auth/login");
//       }

//       return (
//         <section className="p-4">
//           <h1 className="text-2xl font-bold mb-4">Market</h1>
//           <MarketClient />
//         </section>
//       );
//     }

//     function MarketClient() {
//       const { data, isLoading, error } = useQuery({
//         queryKey: ['btcPrice'],
//         queryFn: getMarketBtcPrice,
//       });

//       if (isLoading) return <div>Loading...</div>;
//       if (error) return <div>Error: {(error as any).message}</div>;

//       return <pre>{JSON.stringify(data, null, 2)}</pre>;
//     }
// app/(protected)/dashboard/mining/page.tsx
import { redirect } from "next/navigation";
import { auth0 } from "lib/auth0";
import MiningClient from "./MiningClient";

export default async function MarketPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mining Dashboard</h1>
      <MiningClient />
    </section>
  );
}
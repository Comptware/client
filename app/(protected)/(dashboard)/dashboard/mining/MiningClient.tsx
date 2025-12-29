// app/(protected)/dashboard/market/MarketClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMiningDashboard } from "@/api/client";

export default function MiningClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["miningDashboard"],
    queryFn: getMiningDashboard,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

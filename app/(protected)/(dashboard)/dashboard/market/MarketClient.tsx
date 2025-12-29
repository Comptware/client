// app/(protected)/dashboard/market/MarketClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketBtcPrice } from "@/api/client";

export default function MarketClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["btcPrice"],
    queryFn: getMarketBtcPrice,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

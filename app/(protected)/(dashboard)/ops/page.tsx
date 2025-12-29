//app/(protected)/ops/page.tsx
"use client";

import { useGetOpsDashboardQuery } from "@/store/features/ops/opsApi";
import OpsDashboard from "./OpsDashboard";

export default function OpsDashboardPage() {
  const { data, isLoading } = useGetOpsDashboardQuery();

  if (isLoading) return <p>Loading dashboard...</p>;

  return (
    <>
      <OpsDashboard /></>
  );
}
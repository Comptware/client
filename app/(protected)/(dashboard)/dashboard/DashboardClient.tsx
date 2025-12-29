// app/(protected)/dashboard/DashboardClient.tsx
"use client";
import GoLiveTracker from "@/components/goLive/page";
// import ProjectTimeline from "@/components/timeline/page";
import { useGetProjectProgressQuery } from "@/store/features/tracker/projectApi";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { useGetAsicRorSummaryQuery } from "@/store/features/ror/rorApi";
import RORStats from "@/components/charts/RORStats";

export default function DashboardClient() {
   const { user: reduxUser } = useAppSelector((s) => s.auth);
  const { data: progress, isLoading, isError } = useGetProjectProgressQuery();
  const { data: rorData, isLoading: rorLoading, isError: rorError } = useGetAsicRorSummaryQuery();


  const user = useMemo(() => reduxUser, [reduxUser]);

  const displayName =
  user?.firstName?.trim() && user?.lastName?.trim()
    ? `${user.firstName} ${user.lastName}`
    : user?.email;

  if (isError) return <p>Unable to load project progress.</p>;

  return (
    <section>
            <h1 className="text-2xl font-bold mb-4">
              Welcome {displayName} 🎉
            </h1>
          {/* <p className="mb-4">
        Your KYC is {user?.kycStatus}, payment is {user?.hasPaid ? "COMPLETE" : "PENDING"},
        and your account is {user?.status}. Manage your crypto here.
      </p> */}
      {isLoading && <p>Loading project progress...</p> }
         {/* <ProjectTimeline progress={progress?.projectProgress ?? null} /> */}
         <GoLiveTracker progress={progress?.projectProgress ?? null} />
         {rorData && <RORStats rorData={rorData} />}

    </section>
  );
}

// src/app/(protected)/ops/OpsDashboard.tsx
import React, { useState } from "react";
import { AlertCircle, Zap, Thermometer, Power, Siren } from "lucide-react";
import {
  useGetOpsOverviewQuery,
  useSetHVACMutation,
  useControlGeneratorMutation,
  useEmergencyShutdownMutation,
} from "@/store/features/ops/opsApi";

import OverviewHeader from "@/components/ops/OverviewHeader";
import FacilityControls from "@/components/ops/FacilityControl";
import ClientRevenueTable from "@/components/ops/ClientRevenueTable";
import AlertBanner from "@/components/ops/AlertBanner";
import LiveSensorGrid from "@/components/ops/LiveSensorGrid";
import HashrateChart from "@/components/ops/HashRateChart";
import TemperatureChart from "@/components/ops/TmperatureChart";
import EmergencyShutdownModal from "@/components/ops/EmmergencyShutdown";
import ProfitSwitchTable from "@/components/ops/ProfitSwitchTable";

export default function OpsDashboard() {
  const {
    data,
    isLoading,
    error,
    refetch, // optional: manual refresh button later
  } = useGetOpsOverviewQuery(undefined, {
    // pollingInterval: 30_000, // Safe: 2 requests per minute → ~120/hour → never hits limit
    pollingInterval: 60_000, // Safe: 1 request per minute → ~60/hour → never hits limit
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [setHVAC] = useSetHVACMutation();
  const [controlGenerator] = useControlGeneratorMutation();
  const [emergencyShutdown] = useEmergencyShutdownMutation();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-white text-2xl">
        Initializing Command Center...
      </div>
    );

  if (error || !data)
    return (
      <div className="text-red-500 text-center p-10 text-3xl">
        Connection Lost to Facility
      </div>
    );

  const criticalAlerts = data.alerts.filter(
    (a) => a.severity === "CRITICAL" && !a.acknowledged
  );
console.log(data.facility,'facility===')
  return (
    <>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        {criticalAlerts.length > 0 && <AlertBanner alerts={criticalAlerts} />}
        <OverviewHeader facility={data.facility} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <HashrateChart />
            <TemperatureChart />
          </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <FacilityControls
              facility={data.facility}
              onHVACChange={(temp: number) => setHVAC({ temperature: temp })}
              onGeneratorAction={(action: "START" | "STOP" | "TEST") =>
                controlGenerator({ action })
              }
              onEmergencyClick={() => setIsEmergencyModalOpen(true)}
            />
            <ClientRevenueTable clients={data.clients} />
          </div>

          {data.profitSwitch && (
  <ProfitSwitchTable configs={data.profitSwitch.configs} />
)}

          <LiveSensorGrid />
        </div>


        <EmergencyShutdownModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          onConfirm={(reason: string) => {
            emergencyShutdown({ reason, confirm: true });
            setIsEmergencyModalOpen(false);
          }}
        />      </div>
    </>
  );
}




// // src/features/ops/OpsDashboard.tsx
// import React, { useState } from "react";
// import { AlertCircle, Zap, Thermometer, Power, Siren } from "lucide-react";
// import {
//   useGetOpsOverviewQuery,
//   useSetHVACMutation,
//   useControlGeneratorMutation,
//   useEmergencyShutdownMutation,
// } from "@/store/features/ops/opsApi";
// import OverviewHeader from "@/components/ops/OverviewHeader";
// import EmergencyShutdownModal from "@/components/ops/EmmergencyShutdown";
// import LiveSensorGrid from "@/components/ops/LiveSensorGrid";
// import HashrateChart from "@/components/ops/HashRateChart";
// import TemperatureChart from "@/components/ops/TmperatureChart";
// import FacilityControls from "@/components/ops/FacilityControl";
// import AlertBanner from "@/components/ops/AlertBanner";
// import ClientRevenueTable from "@/components/ops/ClientRevenueTable";
// import useOpsPolling from "@/store/features/ops/hooks/useOpsPolling";

// export default function OpsDashboard() {
//   const { data, isLoading, error } = useGetOpsOverviewQuery(undefined, {
//     pollingInterval: 15_000, // Live updates every 15s
//   });

//   useOpsPolling(); // Extra aggressive polling for sensors

//   const [setHVAC] = useSetHVACMutation();
//   const [controlGenerator] = useControlGeneratorMutation();
//   const [emergencyShutdown] = useEmergencyShutdownMutation();

//   const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(true);

//   if (isLoading) return <div className="flex h-screen items-center justify-center text-white text-2xl">Initializing Command Center...</div>;
//   if (error || !data) return <div className="text-red-500 text-center">Connection Lost to Facility</div>;

//   const criticalAlerts = data.alerts.filter(a => a.severity === "CRITICAL" && !a.acknowledged);

//   return (
//     <>
//       <div className="min-h-screen bg-gray-950 text-gray-100">
//         {/* Critical Alert Banner */}
//         {criticalAlerts.length > 0 && <AlertBanner alerts={criticalAlerts} />}

//         {/* Header */}
//         <OverviewHeader facility={data.facility} />

//         <div className="container mx-auto px-4 py-8">
//           {/* Top Row: Controls + Revenue */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
//             <FacilityControls
//               facility={data.facility}
//               onHVACChange={(temp) => setHVAC({ temperature: temp })}
//               onGeneratorAction={(action) => controlGenerator({ action })}
//               onEmergencyClick={() => setIsEmergencyModalOpen(true)}
//             />
//             <ClientRevenueTable clients={data.clients} />
//           </div>

//           {/* Live Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <HashrateChart />
//             <TemperatureChart />
//           </div>

//           {/* Live Sensor Grid */}
//           <LiveSensorGrid />
//         </div>

//         {/* Nuclear Button Modal */}
//         <EmergencyShutdownModal
//           isOpen={isEmergencyModalOpen}
//           onClose={() => setIsEmergencyModalOpen(false)}
//           onConfirm={(reason) => {
//             emergencyShutdown({ reason, confirm: true });
//             setIsEmergencyModalOpen(false);
//           }}
//         />
//       </div>
//     </>
//   );
// }
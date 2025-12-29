// components/OverviewHeader.tsx
import { Zap, Activity } from "lucide-react";
import { format } from "date-fns";

export default function OverviewHeader({ facility }: { facility: any }) {
  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border-b border-emerald-700">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold flex items-center gap-4">
              <Zap className="w-12 h-12 text-emerald-400" />
              SUNCORE OPERATIONS COMMAND CENTER
            </h1>
            <p className="text-emerald-300 mt-2 text-xl">Live Facility Status • {format(new Date(), "PPPp")}</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-emerald-400">
              {(facility.totalHashrateTHs || 11_847).toLocaleString()} TH/s
            </div>
            {/* <div className="text-2xl text-emerald-200 flex items-center justify-end gap-2">
              <Activity className="w-6 h-6 animate-pulse" />
              {facility.uptime24h ? `${facility.uptime24h.toFixed(2)}% Uptime (24h)`
               : "99.68% Uptime (24h)"}
            </div> */}

            <div>
    <div className="text-2xl text-emerald-200 flex items-center gap-2">
      <Activity className="w-6 h-6 animate-pulse" />
      {facility.uptime24h ? `${facility.uptime24h.toFixed(2)}% Uptime (24h)`
       : "99.68% Uptime (24h)"}
    </div>
    {facility.accumulatedEnergyKWh !== undefined && (
      <div className="text-lg text-cyan-200 mt-1">
        {facility.accumulatedEnergyKWh.toLocaleString()} kWh Total Energy Used
      </div>
    )}
  </div>
          </div>
        </div>
      </div>
    </div>
  );
}
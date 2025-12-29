// src/components/ops/AlertBanner.tsx
import { AlertTriangle, X } from "lucide-react";
import { useAcknowledgeAlertMutation } from "@/store/features/ops/opsApi";

export default function AlertBanner({ alerts }: { alerts: any[] }) {
  const [acknowledgeAlert] = useAcknowledgeAlertMutation();

  return (
    <div className="bg-red-900 border-b-4 border-red-600 animate-pulse">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-red-300 animate-spin-slow" />
            <div>
              <div className="text-2xl font-bold text-red-200">
                CRITICAL ALERT{alerts.length > 1 ? `S (${alerts.length})` : ""} ACTIVE
              </div>
              <div className="text-lg text-red-300">
                {alerts[0].message}
              </div>
            </div>
          </div>
          <button
            onClick={() => acknowledgeAlert(alerts[0]._id)}
            className="bg-red-700 hover:bg-red-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"
          >
            <X className="w-5 h-5" />
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
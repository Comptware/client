// components/LiveSensorGrid.tsx
import { useGetOpsSensorsQuery } from '@/store/features/ops/opsApi';
import { AlertTriangle, Zap } from "lucide-react";

export default function LiveSensorGrid() {
  const { data: sensors = [] } = useGetOpsSensorsQuery(undefined, { pollingInterval: 15_000 });

  const online = sensors.filter(s => s.status === "ONLINE").length;
  const warning = sensors.filter(s => s.status === "WARNING").length;
  const offline = sensors.filter(s => s.status === "OFFLINE").length;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
      <h2 className="text-4xl font-bold mb-8 text-center">Live ASIC Fleet • {sensors.length} Units</h2>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="text-6xl font-bold text-green-400">{online}</div>
          <div className="text-2xl text-green-300">ONLINE</div>
        </div>
        <div className="text-center">
          <div className="text-6xl font-bold text-yellow-400">{warning}</div>
          <div className="text-2xl text-yellow-300">WARNING</div>
        </div>
        <div className="text-center">
          <div className="text-6xl font-bold text-red-400">{offline}</div>
          <div className="text-2xl text-red-300">OFFLINE</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sensors.slice(0, 24).map((s) => (
          <div
            key={s.asicId}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              s.status === "ONLINE"
                ? "bg-green-900/30 border-green-600"
                : s.status === "WARNING"
                ? "bg-yellow-900/30 border-yellow-600 animate-pulse"
                : "bg-red-900/30 border-red-600"
            }`}
          >
            <div className="text-lg font-bold">{s.asicId}</div>
            <div className="text-2xl font-bold text-cyan-400">{s.hashRate.toFixed(1)}</div>
            <div className="text-sm text-gray-400">TH/s</div>
            <div className={`text-sm mt-1 ${s.temperature > 80 ? "text-red-400" : "text-gray-300"}`}>
              {s.temperature.toFixed(1)}°C
            </div>
          </div>
        ))}
      </div>

      {sensors.length > 24 && (
        <div className="text-center mt-6 text-xl text-gray-400">
          ...and {sensors.length - 24} more miners running
        </div>
      )}
    </div>
  );
}
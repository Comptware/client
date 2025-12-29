// components/HashrateChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Sensor, useGetOpsSensorsQuery } from '@/store/features/ops/opsApi';

import { Zap } from "lucide-react";
import { useMemo } from "react";

// const generateLiveData = () => {
//   const now = Date.now();
//   return Array.from({ length: 60 }, (_, i) => ({
//     time: new Date(now - (59 - i) * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     total: 12800 + Math.sin(i / 5) * 200 + Math.random() * 100,
//     avgPerAsic: 118 + Math.sin(i / 8) * 3 + Math.random() * 2,
//   }));
// };

// Aggregate for last 60 mins (~per timestamp)
function aggregateHasrateHistory(sensors: Sensor[]) {
  // Group by minute, sum hashRate
  const byMinute: { [minute: string]: { total: number; count: number } } = {};
  sensors.forEach(sensor => {
    const minute = new Date(sensor.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!byMinute[minute]) byMinute[minute] = { total: 0, count: 0 };
    byMinute[minute].total += sensor.hashRate;
    byMinute[minute].count += 1;
  });
  return Object.entries(byMinute).map(([time, { total, count }]) => ({
    time,
    total,
    avgPerAsic: total / (count || 1),
  })).sort((a, b) => a.time.localeCompare(b.time));
}

export default function HashrateChart() {
  const { data: sensors } = useGetOpsSensorsQuery(undefined, { pollingInterval: 30_000 });
  // const liveData = generateLiveData();
  const liveData = useMemo(() => aggregateHasrateHistory(sensors ?? []), [sensors]);

  const currentHashrate = sensors?.reduce((sum, s) => sum + s.hashRate, 0)?.toFixed(1) || "12,847";

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-emerald-400" />
            Network Hashrate
          </h2>
          <p className="text-emerald-400 text-5xl font-bold mt-2">{currentHashrate} TH/s</p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-gray-400">Live • 60s window</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={liveData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={["dataMin - 100", "dataMax + 100"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={4}
            dot={false}
            name="Total Facility"
          />
          <Line
            type="monotone"
            dataKey="avgPerAsic"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={false}
            name="Avg per ASIC (TH/s)"
            yAxisId="right"
          />
          <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" domain={[100, 140]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}





// // components/HashrateChart.tsx
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
// import { useGetOpsSensorsQuery } from '@/store/features/ops/opsApi';

// import { Zap } from "lucide-react";

// const generateLiveData = () => {
//   const now = Date.now();
//   return Array.from({ length: 60 }, (_, i) => ({
//     time: new Date(now - (59 - i) * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     total: 12800 + Math.sin(i / 5) * 200 + Math.random() * 100,
//     avgPerAsic: 118 + Math.sin(i / 8) * 3 + Math.random() * 2,
//   }));
// };

// export default function HashrateChart() {
//   const { data: sensors } = useGetOpsSensorsQuery(undefined, { pollingInterval: 30_000 });
//   const liveData = generateLiveData();

//   const currentHashrate = sensors?.reduce((sum, s) => sum + s.hashRate, 0)?.toFixed(1) || "12,847";

//   return (
//     <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-3xl font-bold flex items-center gap-3">
//             <Zap className="w-8 h-8 text-emerald-400" />
//             Network Hashrate
//           </h2>
//           <p className="text-emerald-400 text-5xl font-bold mt-2">{currentHashrate} TH/s</p>
//         </div>
//         <div className="text-right">
//           <div className="text-2xl text-gray-400">Live • 60s window</div>
//         </div>
//       </div>

//       <ResponsiveContainer width="100%" height={350}>
//         <LineChart data={liveData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//           <XAxis dataKey="time" stroke="#94a3b8" />
//           <YAxis stroke="#94a3b8" domain={["dataMin - 100", "dataMax + 100"]} />
//           <Tooltip
//             contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
//             labelStyle={{ color: "#e5e7eb" }}
//           />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="total"
//             stroke="#10b981"
//             strokeWidth={4}
//             dot={false}
//             name="Total Facility"
//           />
//           <Line
//             type="monotone"
//             dataKey="avgPerAsic"
//             stroke="#06b6d4"
//             strokeWidth={3}
//             dot={false}
//             name="Avg per ASIC (TH/s)"
//             yAxisId="right"
//           />
//           <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" domain={[100, 140]} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
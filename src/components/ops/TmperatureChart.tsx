import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sensor, useGetOpsSensorsQuery } from '@/store/features/ops/opsApi';
import { Thermometer } from "lucide-react";
import { useMemo } from "react";

// This aggregates sensors[] into 1-minute buckets for up to last 60 minutes, similar to hashrate aggregation.
// Each bucket: avg = average ASIC temp, max = max temp, hotspot = highest present reading.
function aggregateTempHistory(sensors: Sensor[]) {
  // Group by minute
  const byMinute: Record<string, { avgSum: number; count: number; max: number; hotspot: number }> = {};
  sensors.forEach(sensor => {
    const minute = new Date(sensor.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!byMinute[minute]) byMinute[minute] = { avgSum: 0, count: 0, max: Number.NEGATIVE_INFINITY, hotspot: Number.NEGATIVE_INFINITY };
    byMinute[minute].avgSum += sensor.temperature;
    byMinute[minute].count += 1;
    if (sensor.temperature > byMinute[minute].max) byMinute[minute].max = sensor.temperature;
    if (sensor.temperature > byMinute[minute].hotspot) byMinute[minute].hotspot = sensor.temperature;
  });
  // Convert to array sorted by time
  return Object.entries(byMinute)
    .map(([time, { avgSum, count, max, hotspot }]) => ({
      time,
      avg: Math.round((avgSum / count) * 10) / 10,
      max: Math.round(max * 10) / 10,
      hotspot: Math.round(hotspot * 10) / 10,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export default function TemperatureChart() {
  const { data: sensors } = useGetOpsSensorsQuery(undefined, { pollingInterval: 30_000 });
  const tempData = useMemo(() => aggregateTempHistory(sensors ?? []), [sensors]);

  const avgTemp = sensors?.length
    ? (sensors.reduce((sum, s) => sum + s.temperature, 0) / sensors.length).toFixed(1)
    : "–";

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Thermometer className="w-8 h-8 text-orange-400" />
            ASIC Temperatures
          </h2>
          <p className="text-orange-400 text-5xl font-bold mt-2">{avgTemp}°C</p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-gray-400">Facility Average</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={tempData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[50, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Area type="monotone" dataKey="avg" stackId="1" stroke="#f97316" fill="#fb923c" name="Average" />
          <Area type="monotone" dataKey="max" stackId="1" stroke="#ef4444" fill="#f87171" name="Maximum" />
          <Area type="monotone" dataKey="hotspot" stroke="#dc2626" fill="#ef4444" fillOpacity={0.6} name="Hotspot" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}






// // components/TemperatureChart.tsx
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { useGetOpsSensorsQuery } from '@/store/features/ops/opsApi';

// import { Thermometer } from "lucide-react";

// const generateTempData = () => {
//   return Array.from({ length: 60 }, (_, i) => ({
//     time: new Date(Date.now() - (59 - i) * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     avg: 68 + Math.sin(i / 10) * 5 + Math.random() * 3,
//     max: 78 + Math.sin(i / 12) * 6,
//     hotspot: 85 + Math.random() * 8,
//   }));
// };

// export default function TemperatureChart() {
//   const { data: sensors } = useGetOpsSensorsQuery(undefined, { pollingInterval: 30_000 });
//   const tempData = generateTempData();

//   const avgTemp = sensors?.length
//     ? (sensors.reduce((sum, s) => sum + s.temperature, 0) / sensors.length).toFixed(1)
//     : "68.4";

//   return (
//     <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-3xl font-bold flex items-center gap-3">
//             <Thermometer className="w-8 h-8 text-orange-400" />
//             ASIC Temperatures
//           </h2>
//           <p className="text-orange-400 text-5xl font-bold mt-2">{avgTemp}°C</p>
//         </div>
//         <div className="text-right">
//           <div className="text-2xl text-gray-400">Facility Average</div>
//         </div>
//       </div>

//       <ResponsiveContainer width="100%" height={350}>
//         <AreaChart data={tempData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//           <XAxis dataKey="time" stroke="#94a3b8" />
//           <YAxis stroke="#94a3b8" domain={[50, 100]} />
//           <Tooltip
//             contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
//             labelStyle={{ color: "#e5e7eb" }}
//           />
//           <Area type="monotone" dataKey="avg" stackId="1" stroke="#f97316" fill="#fb923c" name="Average" />
//           <Area type="monotone" dataKey="max" stackId="1" stroke="#ef4444" fill="#f87171" name="Maximum" />
//           <Area type="monotone" dataKey="hotspot" stroke="#dc2626" fill="#ef4444" fillOpacity={0.6} name="Hotspot" />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
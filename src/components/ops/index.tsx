import React from 'react';

export default function SensorTable({ sensors, onRowClick }: { sensors: any[]; onRowClick?: (asicId: string) => void }) {
  return (
    <div className="overflow-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">ASIC ID</th>
            <th className="p-3">Temp (°C)</th>
            <th className="p-3">Hashrate (TH/s)</th>
            <th className="p-3">Fan RPM</th>
            <th className="p-3">Power (W)</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((s) => (
            <tr key={s._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick?.(s.asicId)}>
              <td className="p-3">{s.asicId}</td>
              <td className="p-3">{s.temperature.toFixed(1)}</td>
              <td className="p-3">{s.hashRate.toFixed(2)}</td>
              <td className="p-3">{Math.round(s.fanSpeed)}</td>
              <td className="p-3">{Math.round(s.powerUsage)}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${s.status === 'ONLINE' ? 'bg-green-100 text-green-700' : s.status === 'OFFLINE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

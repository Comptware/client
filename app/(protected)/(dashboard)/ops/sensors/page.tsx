// app/(protected)/ops/sensors/page.tsx
"use client";
import React, { useMemo, useState } from "react";
import OpsTable, { ColumnDef } from "@/components/ops/OpsTable";
import { useGetOpsSensorsQuery } from "@/store/features/ops/opsApi";
import SensorDetailModal from "@/components/ops/SensorDetailModal";

export default function SensorsPage() {
  const { data: sensors = [], isLoading } = useGetOpsSensorsQuery();
  const [filter, setFilter] = useState<"ALL" | "ONLINE" | "OFFLINE" | "WARNING">("ALL");
  const [search, setSearch] = useState("");
  const [selectedAsic, setSelectedAsic] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return (sensors || []).filter((s: any) => {
      if (filter !== "ALL" && s.status !== filter) return false;
      if (search && !s.asicId.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sensors, filter, search]);

  const columns: ColumnDef[] = [
    { uid: "asicId", name: "ASIC ID", align: "start" },
    { uid: "temp", name: "Temp (°C)", align: "start" },
    { uid: "hash", name: "Hashrate (TH/s)", align: "start" },
    { uid: "fan", name: "Fan RPM", align: "start" },
    { uid: "power", name: "Power (W)", align: "start" },
    { uid: "status", name: "Status", align: "center" },
    { uid: "time", name: "Time", align: "start" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sensors</h1>

      <div className="flex gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="ALL">All</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="WARNING">Warning</option>
        </select>

        <input
          placeholder="Search ASIC ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      <OpsTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        pageSize={10}
        defaultPageSize={10}
        serverPagination={false}
        renderCell={(row: any, columnKey: string) => {
          if (columnKey === "asicId") return <div className="font-medium cursor-pointer" onClick={() => setSelectedAsic(row.asicId)}>{row.asicId}</div>;
          if (columnKey === "temp") return <div>{row.temperature?.toFixed(1)}</div>;
          if (columnKey === "hash") return <div>{row.hashRate?.toFixed(2)}</div>;
          if (columnKey === "fan") return <div>{Math.round(row.fanSpeed)}</div>;
          if (columnKey === "power") return <div>{Math.round(row.powerUsage)}</div>;
          if (columnKey === "status") {
            return (
              <div>
                <span className={`px-2 py-1 rounded text-sm ${row.status === "ONLINE" ? "bg-green-100 text-green-800" : row.status === "OFFLINE" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {row.status}
                </span>
              </div>
            );
          }
          if (columnKey === "time") return <div>{new Date(row.timestamp).toLocaleString()}</div>;
          return null;
        }}
        emptyState={<div>No sensors found.</div>}
        rowKey={(r: any) => r._id}
      />

      {selectedAsic && (
        <SensorDetailModal asicId={selectedAsic} onClose={() => setSelectedAsic(null)} />
      )}
    </div>
  );
}







// // app/(protected)/ops/sensors/page.tsx
// 'use client';
// import React, { useMemo, useState } from 'react';
// import { useGetOpsSensorsQuery, useGetSensorHistoryQuery } from '@/store/features/ops/opsApi';
// import SensorTable from '@/components/ops';
// import SensorDetailModal from '@/components/ops/SensorDetailModal';
// // import SensorTable from '@/components/ops/SensorTable';
// // import SensorDetailModal from '@/components/ops/SensorDetailModal';

// export default function SensorsPage() {
//   const { data: sensors, isLoading } = useGetOpsSensorsQuery();
//   const [filter, setFilter] = useState<'ALL'|'ONLINE'|'OFFLINE'|'WARNING'>('ALL');
//   const [search, setSearch] = useState('');
//   const [selectedAsic, setSelectedAsic] = useState<string | null>(null);

//   const filtered = useMemo(() => {
//     if (!sensors) return [];
//     return sensors.filter((s: any) => {
//       if (filter !== 'ALL' && s.status !== filter) return false;
//       if (search && !s.asicId.toLowerCase().includes(search.toLowerCase())) return false;
//       return true;
//     });
//   }, [sensors, filter, search]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Sensors</h1>

//       <div className="flex gap-3 mb-4">
//         <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border p-2 rounded">
//           <option value="ALL">All</option>
//           <option value="ONLINE">Online</option>
//           <option value="OFFLINE">Offline</option>
//           <option value="WARNING">Warning</option>
//         </select>

//         <input
//           placeholder="Search ASIC ID"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border p-2 rounded flex-1"
//         />
//       </div>

//       {isLoading ? (
//         <p>Loading sensors...</p>
//       ) : (
//         <SensorTable sensors={filtered} onRowClick={(asicId) => setSelectedAsic(asicId)} />
//       )}

//       {selectedAsic && (
//         <SensorDetailModal
//           asicId={selectedAsic}
//           onClose={() => setSelectedAsic(null)}
//         />
//       )}
//     </div>
//   );
// }


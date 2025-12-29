// app/(protected)/ops/alerts/page.tsx
"use client";
import React, { useMemo, useState } from "react";
import OpsTable, { ColumnDef } from "@/components/ops/OpsTable";
import { useGetOpsAlertsQuery, useAcknowledgeAlertMutation } from "@/store/features/ops/opsApi";

export default function AlertsPage() {
  const { data: alerts = [], isLoading } = useGetOpsAlertsQuery();
  const [acknowledge] = useAcknowledgeAlertMutation();
  const [filter, setFilter] = useState<
    "ALL" | "UNACK" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");

  const visible = useMemo(() => {
    return (alerts || []).filter((a: any) => {
      if (filter === "ALL") return true;
      if (filter === "UNACK") return !a.acknowledged;
      return a.severity === filter;
    });
  }, [alerts, filter]);

  const columns: ColumnDef[] = [
    { uid: "severity", name: "Severity", align: "start" },
    { uid: "message", name: "Message", align: "start" },
    { uid: "time", name: "Time", align: "start" },
    { uid: "action", name: "Action", align: "center" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>

      <div className="flex gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="ALL">All</option>
          <option value="UNACK">Unacknowledged</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <OpsTable
        columns={columns}
        data={visible}
        isLoading={isLoading}
        pageSize={10}
        defaultPageSize={10}
        serverPagination={false}
        renderCell={(row: any, columnKey: string) => {
          if (columnKey === "severity") {
            const cls =
              row.severity === "CRITICAL"
                ? "text-red-700 bg-red-100 px-2 py-1 rounded"
                : row.severity === "HIGH"
                ? "text-orange-700 bg-orange-100 px-2 py-1 rounded"
                : row.severity === "MEDIUM"
                ? "text-yellow-700 bg-yellow-100 px-2 py-1 rounded"
                : "text-gray-700 bg-gray-100 px-2 py-1 rounded";
            return <span className={cls}>{row.severity}</span>;
          }
          if (columnKey === "message") {
            return <div className="text-sm">{row.message}</div>;
          }
          if (columnKey === "time") {
            return <div className="text-sm">{new Date(row.createdAt).toLocaleString()}</div>;
          }
          if (columnKey === "action") {
            return row.acknowledged ? (
              <div className="text-sm text-default-500">Ack by {row.acknowledgedBy || "—"}</div>
            ) : (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => acknowledge(row._id)}
              >
                Acknowledge
              </button>
            );
          }
          return null;
        }}
        emptyState={<div>No alerts found.</div>}
        rowKey={(r: any) => r._id}
      />
    </div>
  );
}






// // app/(protected)/ops/alerts/page.tsx
// 'use client';
// import React, { useState } from 'react';
// import { useGetOpsAlertsQuery, useAcknowledgeAlertMutation } from '@/store/features/ops/opsApi';

// export default function AlertsPage() {
//   const { data: alerts, isLoading } = useGetOpsAlertsQuery();
//   const [ack] = useAcknowledgeAlertMutation();
//   const [filter, setFilter] = useState<'ALL'|'UNACK'|'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'>('ALL');

//   const visible = (alerts || []).filter((a: any) => {
//     if (filter === 'ALL') return true;
//     if (filter === 'UNACK') return !a.acknowledged;
//     if (['CRITICAL','HIGH','MEDIUM','LOW'].includes(filter)) return a.severity === filter;
//     return true;
//   });

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Alerts</h1>

//       <div className="flex gap-3 mb-4">
//         <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border p-2 rounded">
//           <option value="ALL">All</option>
//           <option value="UNACK">Unacknowledged</option>
//           <option value="CRITICAL">Critical</option>
//           <option value="HIGH">High</option>
//           <option value="MEDIUM">Medium</option>
//           <option value="LOW">Low</option>
//         </select>
//       </div>

//       {isLoading ? <p>Loading alerts...</p> : (
//         <div className="bg-white rounded shadow">
//           <table className="min-w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3">Severity</th>
//                 <th className="p-3">Message</th>
//                 <th className="p-3">Time</th>
//                 <th className="p-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visible.map((a: any) => (
//                 <tr key={a._id} className="border-b">
//                   <td className="p-3">{a.severity}</td>
//                   <td className="p-3">{a.message}</td>
//                   <td className="p-3">{new Date(a.createdAt).toLocaleString()}</td>
//                   <td className="p-3">
//                     {!a.acknowledged ? (
//                       <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => ack(a._id)}>
//                         Acknowledge
//                       </button>
//                     ) : (
//                       <span className="text-sm text-gray-600">Ack by {a.acknowledgedBy || '—'}</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


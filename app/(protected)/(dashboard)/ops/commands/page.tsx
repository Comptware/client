// app/(protected)/ops/commands/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import OpsTable, { ColumnDef } from "@/components/ops/OpsTable";
import {
  useGetOpsCommandsQuery,
  useSendOpsCommandMutation,
} from "@/store/features/ops/opsApi";

export type OpsCommandType = "REBOOT" | "POWER_ON" | "POWER_OFF" | "RESET_POOL";

export default function CommandsPage() {
  const [asicId, setAsicId] = useState("");
  const [command, setCommand] = useState<OpsCommandType | "">("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: cmdResp, isLoading: loadingCommands } = useGetOpsCommandsQuery({
    page,
    limit: pageSize,
  });

  const [sendCommand, { isLoading: sending }] = useSendOpsCommandMutation();

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!asicId || !command) return alert("asicId and command required");
    try {
      await sendCommand({ asicId, command }).unwrap();
      setAsicId("");
      setCommand("");
      // refresh - RTK Query invalidation should update list; if not, quick manual refresh by re-calling the query depends on your setup
      alert("Command queued");
    } catch (err: any) {
      console.error(err);
      alert("Failed to send command");
    }
  }

  const columns: ColumnDef[] = useMemo(
    () => [
      { uid: "asicId", name: "ASIC", align: "start" },
      { uid: "command", name: "Command", align: "start" },
      { uid: "issuedBy", name: "Issued By", align: "start" },
      { uid: "status", name: "Status", align: "center" },
      { uid: "time", name: "Time", align: "start" },
    ],
    []
  );

  const items = cmdResp?.commands ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Command Center</h1>

      <form onSubmit={onSend} className="bg-white rounded shadow p-4 mb-6 max-w-xl">
        <div className="flex gap-3 mb-3">
          <input
            placeholder="ASIC ID"
            value={asicId}
            onChange={(e) => setAsicId(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <select
            value={command}
            onChange={(e) =>
              setCommand(
                (["REBOOT", "POWER_OFF", "POWER_ON", "RESET_POOL"].includes(e.target.value)
                  ? (e.target.value as OpsCommandType)
                  : "") as OpsCommandType | ""
              )
            }
            className="border p-2 rounded"
          >
            <option value="">Select Command</option>
            <option value="REBOOT">Reboot</option>
            <option value="POWER_OFF">Power Off</option>
            <option value="POWER_ON">Power On</option>
            <option value="RESET_POOL">Reset Pool</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={sending}
            type="submit"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>

      <OpsTable
        columns={columns}
        data={items}
        isLoading={loadingCommands}
        serverPagination={true}
        page={page}
        pageSize={pageSize}
        total={cmdResp?.pagination?.total ?? 0}
        onPageChange={(p) => setPage(p)}
        renderCell={(row: any, columnKey: string) => {
          if (columnKey === "asicId") return <div>{row.asicId}</div>;
          if (columnKey === "command") return <div>{row.command}</div>;
          if (columnKey === "issuedBy") return <div>{row.issuedBy}</div>;
          if (columnKey === "status")
            return (
              <div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    row.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : row.status === "SENT"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            );
          if (columnKey === "time") return <div>{new Date(row.createdAt).toLocaleString()}</div>;
          return null;
        }}
        emptyState={<div>No commands found.</div>}
        rowKey={(r: any) => r._id}
      />
    </div>
  );
}









// // app/(protected)/ops/commands/page.tsx
// 'use client';
// import React, { useState } from 'react';
// import { useGetOpsCommandsQuery, useSendOpsCommandMutation } from '@/store/features/ops/opsApi';

// export type OpsCommandType =
//   | "REBOOT"
//   | "POWER_ON"
//   | "POWER_OFF"
//   | "RESET_POOL";

// export default function CommandsPage() {
//   const [asicId, setAsicId] = useState('');
//     const [command, setCommand] = useState<OpsCommandType | "">("");
//   const [sendCommand, { isLoading: sending }] = useSendOpsCommandMutation();
//   const { data: cmdResp, isLoading } = useGetOpsCommandsQuery({ page: 1, limit: 50 });

//   async function onSend(e: React.FormEvent) {
//     e.preventDefault();
//     if (!asicId || !command) return alert('asicId and command required');
//     try {
//       await sendCommand({ asicId, command }).unwrap();
//       setAsicId(''); setCommand('');
//       alert('Command queued');
//     } catch (err: any) {
//       console.error(err);
//       alert('Failed to send command');
//     }
//   }

//   const asCommand = (value: string): OpsCommandType | "" => {
//   if (value === "") return "";
//   if (["REBOOT", "POWER_OFF", "POWER_ON", "RESET_POOL"].includes(value))
//     return value as OpsCommandType;
//   return "";
// };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Command Center</h1>

//       <form onSubmit={onSend} className="bg-white rounded shadow p-4 mb-6 max-w-xl">
//         <div className="flex gap-3 mb-3">
//           <input placeholder="ASIC ID" value={asicId} onChange={(e) => setAsicId(e.target.value)} className="flex-1 border p-2 rounded" />
//           <select value={command} onChange={(e) => setCommand(asCommand(e.target.value))} className="border p-2 rounded">
//             <option value="">Select Command</option>
//             <option value="REBOOT">Reboot</option>
//             <option value="POWER_OFF">Power Off</option>
//             <option value="POWER_ON">Power On</option>
//             <option value="RESET_POOL">Reset Pool</option>
//           </select>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={sending} type="submit">{sending ? 'Sending...' : 'Send'}</button>
//         </div>
//       </form>

//       <div>
//         <h2 className="text-lg font-medium mb-3">Recent Commands</h2>
//         {isLoading ? <p>Loading commands...</p> : (
//           <div className="bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3">ASIC</th>
//                   <th className="p-3">Command</th>
//                   <th className="p-3">Issued By</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cmdResp?.commands?.map((c: any) => (
//                   <tr key={c._id} className="border-b">
//                     <td className="p-3">{c.asicId}</td>
//                     <td className="p-3">{c.command}</td>
//                     <td className="p-3">{c.issuedBy}</td>
//                     <td className="p-3">{c.status}</td>
//                     <td className="p-3">{new Date(c.createdAt).toLocaleString()}</td>
//                   </tr>
//                 )) || <tr><td className="p-3">No commands found</td></tr>}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


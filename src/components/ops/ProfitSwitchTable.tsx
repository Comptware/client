import { AsicProfitConfig, useUpdateProfitSwitchConfigMutation } from '@/store/features/ops/opsApi';

export default function ProfitSwitchTable({ configs }: { configs: AsicProfitConfig[] }) {
  const [updateProfitSwitchConfig, { isLoading: isUpdating }] = useUpdateProfitSwitchConfigMutation();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
      <h3 className="text-xl font-bold mb-4">Profit Maximization: Auto-Switch Status</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th>ASIC ID</th>
            <th>Status</th>
            <th>Current Algorithm</th>
            <th>Toggle</th>
            <th>Last Switched</th>
          </tr>
        </thead>
        <tbody>
        {configs.map(c =>
            <tr key={c.asicId}>
              <td className="font-mono">{c.asicId}</td>
              <td className={c.autoSwitchEnabled ? "text-green-400" : "text-gray-400"}>
                {c.autoSwitchEnabled ? "ENABLED" : "DISABLED"}
              </td>
              <td>{c.currentAlgorithm || "—"}</td>
              <td>
                <button
                  disabled={isUpdating}
                  className={`px-3 py-1 rounded ${c.autoSwitchEnabled ? "bg-green-700" : "bg-gray-700"} text-sm text-white`}
                  onClick={() =>
                    updateProfitSwitchConfig({
                      asicId: c.asicId,
                      autoSwitchEnabled: !c.autoSwitchEnabled,
                    })
                  }
                >
                  Toggle
                </button>
              </td>
              <td>{c.lastSwitchedAt ? new Date(c.lastSwitchedAt).toLocaleString() : "—"}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}





// import { AsicProfitConfig } from '@/store/features/ops/opsApi';

// export default function ProfitSwitchTable({ configs }: { configs: AsicProfitConfig[] }) {
//   if (!configs.length) return <div className="text-gray-500">No miners with profit switching enabled.</div>;
//   return (
//     <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
//       <h3 className="text-xl font-bold mb-4">Profit Maximization: Auto-Switch Status</h3>
//       <table className="w-full">
//         <thead>
//           <tr>
//             <th>ASIC ID</th>
//             <th>Status</th>
//             <th>Current Algorithm</th>
//             <th>Last Switched</th>
//           </tr>
//         </thead>
//         <tbody>
//         {configs.map(c =>
//             <tr key={c.asicId}>
//               <td className="font-mono">{c.asicId}</td>
//               <td className={c.autoSwitchEnabled ? "text-green-400" : "text-gray-400"}>
//                 {c.autoSwitchEnabled ? "ENABLED" : "DISABLED"}
//               </td>
//               <td>{c.currentAlgorithm || "—"}</td>
//               <td>{c.lastSwitchedAt ? new Date(c.lastSwitchedAt).toLocaleString() : "—"}</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
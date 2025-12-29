// src/components/ops/ClientRevenueTable.tsx
import { DollarSign } from "lucide-react";

export default function ClientRevenueTable({ clients }: { clients: any[] }) {
  const totalRevenue = clients.reduce((sum, c) => sum + c.dailyRevenueUSD, 0);
  const totalFees = clients.reduce((sum, c) => sum + c.managementFeeUSD, 0);

  // Clone + sort safely — this fixes the immutable error
  const sortedClients = [...clients].sort((a, b) => b.totalHashrateTHs - a.totalHashrateTHs);

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-green-400" />
        Client Revenue Allocation
      </h2>

      <div className="space-y-4">
        {sortedClients.map((client) => (
          <div
            key={client.clientId}
            className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold text-cyan-300">
                  {client.clientName}
                </div>
                <div className="text-sm text-gray-400">
                  {client.asicIds.length} ASICs • {client.totalHashrateTHs.toFixed(1)} TH/s
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${client.dailyRevenueUSD.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">/day</div>
              </div>
            </div>
            {client.managementFeeUSD > 0 && (
              <div className="mt-3 text-sm text-gray-500">
                Management Fee:{" "}
                <span className="text-orange-400 font-bold">
                  ${client.managementFeeUSD.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xl font-bold">Total Daily Revenue</div>
            <div className="text-4xl font-bold text-green-400 mt-2">
              ${totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-orange-400">SunCore Fees</div>
            <div className="text-3xl font-bold mt-2">
              ${totalFees.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
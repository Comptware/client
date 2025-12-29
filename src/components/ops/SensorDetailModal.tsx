'use client';
import React from 'react';
import { useGetSensorHistoryQuery } from '@/store/features/ops/opsApi';

export default function SensorDetailModal({ asicId, onClose }: { asicId: string; onClose: () => void }) {
  const { data, isLoading } = useGetSensorHistoryQuery({ asicId, limit: 120 });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{asicId} — History</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>

        {isLoading ? (
          <p>Loading history...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">Showing latest {data?.length ?? 0} samples</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-xs text-gray-500">Temperature (°C)</h4>
                <div className="h-40 overflow-auto border rounded p-2">
                  {data?.map((d: any) => <div key={d._id} className="text-sm">{new Date(d.timestamp).toLocaleTimeString()} — {d.temperature.toFixed(1)}</div>)}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-gray-500">Hashrate (TH/s)</h4>
                <div className="h-40 overflow-auto border rounded p-2">
                  {data?.map((d: any) => <div key={d._id} className="text-sm">{new Date(d.timestamp).toLocaleTimeString()} — {d.hashRate.toFixed(2)}</div>)}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-gray-500">Power (W)</h4>
                <div className="h-40 overflow-auto border rounded p-2">
                  {data?.map((d: any) => <div key={d._id} className="text-sm">{new Date(d.timestamp).toLocaleTimeString()} — {Math.round(d.powerUsage)}</div>)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

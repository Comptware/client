// src/components/ops/EmergencyShutdownModal.tsx
import { AlertTriangle } from "lucide-react";

interface EmergencyShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function EmergencyShutdownModal({
  isOpen,
  onClose,
  onConfirm,
}: EmergencyShutdownModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    const reasonEl = document.getElementById("emergency-reason") as HTMLTextAreaElement;
    const reason = reasonEl?.value.trim();
    if (reason && reason.length >= 10) {
      onConfirm(reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-4 border-red-600 rounded-2xl max-w-2xl w-full p-10">
        <div className="text-center">
          <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl font-bold text-red-500 mb-6">EMERGENCY SHUTDOWN</h2>
          <p className="text-2xl text-gray-300 mb-8">
            This will power off <strong>ALL 12,847 TH/s</strong> across the entire facility.
          </p>
          <textarea
            id="emergency-reason"
            placeholder="Enter reason (min 10 characters)"
            className="w-full bg-gray-800 border-2 border-red-600 rounded-lg p-4 text-xl mb-6 text-white placeholder-gray-500"
            rows={4}
          />
          <div className="flex gap-6 justify-center">
            <button
              onClick={onClose}
              className="px-12 py-6 text-2xl bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-12 py-6 text-2xl bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all"
            >
              CONFIRM SHUTDOWN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/ops/FacilityControls.tsx
import { Thermometer, Power, Siren, Wind } from "lucide-react";

interface FacilityControlsProps {
  facility: {
    hvacSetting?: number;
    generatorStatus?: "OFF" | "RUNNING" | "STANDBY" | "ERROR";
  };
  onHVACChange: (temperature: number) => void;
  onGeneratorAction: (action: "START" | "STOP" | "TEST") => void;
  onEmergencyClick: () => void;
}

export default function FacilityControls({
  facility,
  onHVACChange,
  onGeneratorAction,
  onEmergencyClick,
}: FacilityControlsProps) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Wind className="w-8 h-8 text-cyan-400" />
        Facility Controls
      </h2>

      {/* HVAC */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Thermometer className="w-6 h-6 text-blue-400" />
          <span className="text-xl">HVAC System</span>
        </div>
        <div className="bg-gray-800 rounded-xl p-5">
          <div className="text-5xl font-bold text-blue-400 mb-2">
            {facility.hvacSetting?.toFixed(1) || 23.5}°C
          </div>
          <input
            type="range"
            min="15"
            max="30"
            step="0.5"
            defaultValue={facility.hvacSetting || 23.5}
            onChange={(e) => onHVACChange(parseFloat(e.target.value))}
            className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer slider accent-blue-500"
          />
        </div>
      </div>

      {/* Generator */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Power className="w-6 h-6 text-yellow-400" />
          <span className="text-xl">Backup Generator</span>
        </div>
        <div className="flex gap-3">
          {(["START", "STOP", "TEST"] as const).map((action) => (
            <button
              key={action}
              onClick={() => onGeneratorAction(action)}
              className={`flex-1 py-4 rounded-lg font-bold transition-all ${
                action === "START"
                  ? "bg-green-600 hover:bg-green-500"
                  : action === "STOP"
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-yellow-600 hover:bg-yellow-500"
              }`}
            >
              {action}
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-2xl font-bold">
          Status:{" "}
          <span
            className={
              facility.generatorStatus === "RUNNING" ? "text-green-400" : "text-orange-400"
            }
          >
            {facility.generatorStatus || "STANDBY"}
          </span>
        </div>
      </div>

      {/* Emergency Shutdown */}
      <button
        onClick={onEmergencyClick}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-2xl py-8 rounded-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-105"
      >
        <Siren className="w-12 h-12 animate-pulse" />
        EMERGENCY SHUTDOWN
      </button>
    </div>
  );
}





// // components/FacilityControls.tsx
// import { Thermometer, Power, Siren, Wind } from "lucide-react";

// export default function FacilityControls({ facility, onHVACChange, onGeneratorAction, onEmergencyClick }: any) {
//   return (
//     <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
//       <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
//         <Wind className="w-8 h-8 text-cyan-400" />
//         Facility Controls
//       </h2>

//       {/* HVAC */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-3">
//           <Thermometer className="w-6 h-6 text-blue-400" />
//           <span className="text-xl">HVAC System</span>
//         </div>
//         <div className="bg-gray-800 rounded-xl p-5">
//           <div className="text-5xl font-bold text-blue-400 mb-2">
//             {facility.hvacSetting || 23.5}°C
//           </div>
//           <input
//             type="range"
//             min="15" max="30" step="0.5"
//             defaultValue={facility.hvacSetting || 23.5}
//             onChange={(e) => onHVACChange(parseFloat(e.target.value))}
//             className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
//           />
//         </div>
//       </div>

//       {/* Generator */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-3">
//           <Power className="w-6 h-6 text-yellow-400" />
//           <span className="text-xl">Backup Generator</span>
//         </div>
//         <div className="flex gap-3">
//           {["START", "STOP", "TEST"].map(action => (
//             <button
//               key={action}
//               onClick={() => onGeneratorAction(action)}
//               className={`flex-1 py-4 rounded-lg font-bold transition-all ${
//                 action === "START" ? "bg-green-600 hover:bg-green-500" :
//                 action === "STOP" ? "bg-red-600 hover:bg-red-500" :
//                 "bg-yellow-600 hover:bg-yellow-500"
//               }`}
//             >
//               {action}
//             </button>
//           ))}
//         </div>
//         <div className="mt-3 text-center text-2xl font-bold">
//           Status: <span className={facility.generatorStatus === "RUNNING" ? "text-green-400" : "text-orange-400"}>
//             {facility.generatorStatus || "STANDBY"}
//           </span>
//         </div>
//       </div>

//       {/* Emergency Shutdown */}
//       <button
//         onClick={onEmergencyClick}
//         className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-2xl py-8 rounded-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-105"
//       >
//         <Siren className="w-12 h-12 animate-pulse" />
//         EMERGENCY SHUTDOWN
//       </button>
//     </div>
//   );
// }
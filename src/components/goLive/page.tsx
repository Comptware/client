"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import type { ProjectProgress, ProjectStageName } from "@/types";

const stageLabels: Record<ProjectStageName, string> = {
  PURCHASE: "Purchase",
  FULFILLMENT: "Fulfillment",
  ENERGY_INFRASTRUCTURE_INSTALLATION: "Energy Installation",
  PROVISIONING: "Provisioning",
  TESTING: "Testing",
  ACTIVATION: "Activation",
};

interface GoLiveTrackerProps {
  progress: ProjectProgress | null | undefined;
}

export default function GoLiveTracker({ progress }: GoLiveTrackerProps) {
  if (!progress) return null;

  const stages = progress.timeline || [];
  const currentIndex = stages.findIndex((s) => s.status === "IN_PROGRESS");
//   const progressPercent = ((currentIndex + 1) / stages.length) * 100;

const goLivePercent = progress.goLivePercent ?? 0;

      console.log(goLivePercent,'golive%===')

  const expectedGoLiveDate =
    progress.remainingDays > 0
      ? new Date(Date.now() + progress.remainingDays * 24 * 60 * 60 * 1000)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-6 rounded-3xl shadow-md border border-gray-200"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-yellow-50/30 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">

<h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent whitespace-nowrap">
  Hardware Go-Live Tracker
</h2>

        <p className="text-xs text-gray-400">
          Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Circular progress + details */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
        {/* Circle */}
       <motion.div
  animate={
    progress.isGoLive
      ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } }
      : {}
  }
  className={`w-32 h-32 drop-shadow-lg ${
    progress.isGoLive ? "ring-4 ring-yellow-400 ring-offset-4" : ""
  }`}
>
  <CircularProgressbar
    value={goLivePercent}
    text={`${Math.round(goLivePercent)}%`}
    styles={buildStyles({
      textColor: "#2563eb",
      pathColor: progress.isGoLive ? "#facc15" : "url(#gradient)",
      trailColor: "#e5e7eb",
      textSize: "16px",
    })}
  />
  {/* gradient for circular path */}
  <svg style={{ height: 0 }}>
    <defs>
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
    </defs>
  </svg>
</motion.div>


        {/* Right summary */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-gray-600 mb-1">
            Current stage:{" "}
            <span className="font-medium text-blue-600">
              {stageLabels[progress.currentStage as ProjectStageName]}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Stage {currentIndex + 1} of {stages.length} •{" "}
            <span className="text-yellow-600">
              {progress.totalDays} days total timeline
            </span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Timeline */}
      <div className="relative flex items-center justify-between mt-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full -translate-y-1/2"
        //   style={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {stages.map((step, idx) => {
          const isCompleted = step.status === "COMPLETED";
          const isCurrent = step.status === "IN_PROGRESS";
          return (
            <motion.div
              key={step.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center z-10"
            >
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white"
                    : isCurrent
                    ? "bg-gradient-to-br from-blue-500 to-yellow-400 border-blue-400 text-white animate-pulse"
                    : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={16} />
                ) : isCurrent ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Circle size={14} />
                )}
              </div>
              <span className="text-[11px] mt-2 text-gray-700 font-medium text-center max-w-auto">
                {stageLabels[step.stage as ProjectStageName]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}







// "use client";

// import { motion } from "framer-motion";
// import { CheckCircle, Circle, Loader2 } from "lucide-react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import type { ProjectProgress, ProjectStageName } from "@/types";

// const stageLabels: Record<ProjectStageName, string> = {
//   PURCHASE: "Purchase",
//   FULFILLMENT: "Fulfillment",
//   ENERGY_INFRASTRUCTURE_INSTALLATION: "Energy Infra Install",
//   PROVISIONING: "Provisioning",
//   TESTING: "Testing",
//   ACTIVATION: "Activation",
// };

// interface GoLiveTrackerProps {
//   progress: ProjectProgress | null | undefined;
// }

// export default function GoLiveTracker({ progress }: GoLiveTrackerProps) {
//   if (!progress) return null;

//   const stages = progress.timeline || [];
//   const currentIndex = stages.findIndex((s) => s.status === "IN_PROGRESS");
// //   const progressPercent = ((currentIndex + 1) / stages.length) * 100;

//   const goLivePercent =
//     progress.totalDays && progress.remainingDays !== null
//       ? ((progress.totalDays - progress.remainingDays) / progress.totalDays) * 100
//       : 0;

//       console.log(goLivePercent,'golive%===')

//   const expectedGoLiveDate =
//     progress.remainingDays > 0
//       ? new Date(Date.now() + progress.remainingDays * 24 * 60 * 60 * 1000)
//       : null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-6 rounded-3xl shadow-md border border-gray-200"
//     >
//       {/* Decorative gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-yellow-50/30 pointer-events-none" />

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 relative z-10">

// <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent whitespace-nowrap">
//   Project Go-Live Tracker
// </h2>

//         <p className="text-xs text-gray-400">
//           Updated: {new Date().toLocaleDateString()}
//         </p>
//       </div>

//       {/* Circular progress + details */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
//         {/* Circle */}
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="flex flex-col items-center"
//         >
//           <div className="w-32 h-32 drop-shadow-lg">
//             <CircularProgressbar
//               value={goLivePercent}
//               text={`${Math.round(goLivePercent)}%`}
//               styles={buildStyles({
//                 textColor: "#2563eb",
//                 pathColor: "url(#gradient)",
//                 trailColor: "#e5e7eb",
//                 textSize: "16px",
//               })}
//             />
//             {/* gradient for circular path */}
//             <svg style={{ height: 0 }}>
//               <defs>
//                 <linearGradient id="gradient" gradientTransform="rotate(90)">
//                   <stop offset="0%" stopColor="#2563eb" />
//                   <stop offset="100%" stopColor="#facc15" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>

//           <p className="text-sm text-gray-700 mt-3">
//             {progress.remainingDays > 0
//               ? `${progress.remainingDays} days remaining to go live`
//               : "Go-live achieved 🎉"}
//           </p>

//           {expectedGoLiveDate && (
//             <p className="text-xs text-gray-500 mt-1">
//               Expected Go-Live:{" "}
//               <span className="font-medium text-gray-700">
//                 {expectedGoLiveDate.toLocaleDateString()}
//               </span>
//             </p>
//           )}
//         </motion.div>

//         {/* Right summary */}
//         <div className="flex-1 text-center sm:text-left">
//           <p className="text-sm text-gray-600 mb-1">
//             Current stage:{" "}
//             <span className="font-medium text-blue-600">
//               {stageLabels[progress.currentStage as ProjectStageName]}
//             </span>
//           </p>
//           <p className="text-xs text-gray-500">
//             Stage {currentIndex + 1} of {stages.length} •{" "}
//             <span className="text-yellow-600">
//               {progress.totalDays} days total timeline
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Divider */}
//       <hr className="my-6 border-gray-200" />

//       {/* Timeline */}
//       <div className="relative flex items-center justify-between mt-6">
//         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2" />
//         <motion.div
//           className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full -translate-y-1/2"
//         //   style={{ width: `${progressPercent}%` }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         />

//         {stages.map((step, idx) => {
//           const isCompleted = step.status === "COMPLETED";
//           const isCurrent = step.status === "IN_PROGRESS";
//           return (
//             <motion.div
//               key={step.stage}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className="flex flex-col items-center z-10"
//             >
//               <div
//                 className={`w-9 h-9 flex items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${
//                   isCompleted
//                     ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white"
//                     : isCurrent
//                     ? "bg-gradient-to-br from-blue-500 to-yellow-400 border-blue-400 text-white animate-pulse"
//                     : "border-gray-300 text-gray-400 bg-white"
//                 }`}
//               >
//                 {isCompleted ? (
//                   <CheckCircle size={16} />
//                 ) : isCurrent ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <Circle size={14} />
//                 )}
//               </div>
//               <span className="text-[11px] mt-2 text-gray-700 font-medium text-center max-w-auto">
//                 {stageLabels[step.stage as ProjectStageName]}
//               </span>
//             </motion.div>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// }
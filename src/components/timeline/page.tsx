"use client";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import type { ProjectProgress, ProjectStageName } from "@/types";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const stageLabels: Record<ProjectStageName, string> = {
  PURCHASE: "Purchase",
  FULFILLMENT: "Fulfillment",
  ENERGY_INFRASTRUCTURE_INSTALLATION: "Energy Infra Install",
  PROVISIONING: "Provisioning",
  TESTING: "Testing",
  ACTIVATION: "Activation",
};

export default function ProjectTimeline({ progress }: { progress: ProjectProgress | null }) {
  if (!progress) return null;

  const stages = progress.timeline || [];
  const currentIndex = stages.findIndex(s => s.status === "IN_PROGRESS");
  const progressPercent = ((currentIndex + 1) / stages.length) * 100;

const completionPercent = ((progress.totalDays - progress.remainingDays) / progress.totalDays) * 100;


  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-600">
          Current stage:{" "}
          <span className="font-medium text-blue-600">
            {stageLabels[progress.currentStage as ProjectStageName]}
          </span>{" "}
          •{" "}
          {progress.remainingDays > 0
            ? `${progress.remainingDays} days remaining to go live`
            : "Go-live achieved 🎉"}
        </p>
        <p className="text-xs text-gray-400">Progress: {Math.round(progressPercent)}%</p>
      </div>


<div className="flex flex-col items-center bg-white rounded-2xl shadow-sm p-6 border">
  <div className="w-24 h-24 mb-3">
    <CircularProgressbar
      value={completionPercent}
      text={`${Math.round(completionPercent)}%`}
      styles={buildStyles({
        textColor: "#2563eb",
        pathColor: "#2563eb",
        trailColor: "#e5e7eb",
      })}
    />
  </div>
  <p className="text-sm text-gray-600 font-medium mb-1">
    {progress.remainingDays} days to go live
  </p>
  <p className="text-xs text-gray-400">
    Current Stage: {stageLabels[progress.currentStage as ProjectStageName]}
  </p>
</div>

    </div>
  );
}








////Option2
// "use client";
// import { CheckCircle, Circle, Loader2 } from "lucide-react";
// import type { ProjectProgress, ProjectStageName } from "@/types";

// const stageLabels: Record<ProjectStageName, string> = {
//   PURCHASE: "Purchase",
//   FULFILLMENT: "Fulfillment",
//   ENERGY_INFRASTRUCTURE_INSTALLATION: "Energy Infra Install",
//   PROVISIONING: "Provisioning",
//   TESTING: "Testing",
//   ACTIVATION: "Activation",
// };

// export default function ProjectTimeline({ progress }: { progress: ProjectProgress | null }) {
//   if (!progress) return null;

//   const stages = progress.timeline || [];
//   const currentIndex = stages.findIndex(s => s.status === "IN_PROGRESS");
//   const progressPercent = ((currentIndex + 1) / stages.length) * 100;

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm border">
//       <div className="flex justify-between items-center mb-3">
//         <p className="text-sm text-gray-600">
//           Current stage:{" "}
//           <span className="font-medium text-blue-600">
//             {stageLabels[progress.currentStage as ProjectStageName]}
//           </span>{" "}
//           •{" "}
//           {progress.remainingDays > 0
//             ? `${progress.remainingDays} days remaining to go live`
//             : "Go-live achieved 🎉"}
//         </p>
//         <p className="text-xs text-gray-400">Progress: {Math.round(progressPercent)}%</p>
//       </div>

//       <div className="relative flex items-center justify-between">
//         {/* Progress bar background */}
//         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
//         {/* Progress bar fill */}
//         <div
//           className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-full -translate-y-1/2 transition-all duration-500"
//           style={{ width: `${progressPercent}%` }}
//         ></div>

//         {stages.map((step, idx) => {
//           const isCompleted = step.status === "COMPLETED";
//           const isCurrent = step.status === "IN_PROGRESS";
//           return (
//             <div key={step.stage} className="flex flex-col items-center z-10">
//               <div
//                 className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
//                   isCompleted
//                     ? "bg-green-500 border-green-500 text-white"
//                     : isCurrent
//                     ? "border-blue-500 text-blue-600"
//                     : "border-gray-300 text-gray-400"
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
//               <span className="text-[11px] mt-1 text-gray-600 text-center max-w-auto">
//                 {stageLabels[step.stage as ProjectStageName]}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }







// // components/ProjectTimeline.tsx Option1
// import { CheckCircle, Loader2 } from "lucide-react";
// import type { ProjectProgress, ProjectStageName } from "@/types";

// const stageLabels: Record<ProjectStageName, string> = {
//   PURCHASE: "Purchase",
//   FULFILLMENT: "Fulfillment",
//   ENERGY_INFRASTRUCTURE_INSTALLATION: "Energy Infrastructure Installation",
//   PROVISIONING: "Provisioning",
//   TESTING: "Testing",
//   ACTIVATION: "Activation",
// };

// interface ProjectTimelineProps {
//   progress: ProjectProgress | null | undefined;
// }

// export default function ProjectTimeline({ progress }: ProjectTimelineProps) {
//   if (!progress) return null;

//   return (
//     <div className="bg-white p-4 rounded-2xl shadow-sm border">
//      <p className="text-xs text-gray-500 mb-2">
//   Current stage: <span className="font-medium text-blue-600">
//     {stageLabels[progress?.currentStage as ProjectStageName]}
//   </span> •{" "}
//   {progress?.remainingDays > 0
//     ? `${progress?.remainingDays} days remaining to go live`
//     : "Go-live achieved 🎉"}
// </p>

//       <div className="flex flex-col space-y-3">
//         {progress?.timeline?.map((step) => (
//           <div key={step.stage} className="flex items-center space-x-2">
//             {step.status === "COMPLETED" ? (
//               <CheckCircle className="text-green-500" size={18} />
//             ) : step.status === "IN_PROGRESS" ? (
//               <Loader2 className="text-blue-500 animate-spin" size={18} />
//             ) : (
//               <div className="w-4 h-4 rounded-full border border-gray-400" />
//             )}
//             <span
//               className={`text-sm font-medium ${
//                 step.status === "IN_PROGRESS"
//                   ? "text-blue-600"
//                   : step.status === "COMPLETED"
//                   ? "text-gray-700"
//                   : "text-gray-400"
//               }`}
//             >
//               {stageLabels[step.stage as ProjectStageName]}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

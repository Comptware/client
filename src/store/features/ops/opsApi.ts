// src/features/ops/opsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithGlobalErrorHandler } from "../../apiBase";

export interface OpsStats {
  totalAsics: number;
  online: number;
  offline: number;
  criticalAlerts: number;
}

// export interface Sensor {
//   _id: string;
//   asicId: string;
//   temperature: number;
//   hashRate: number;
//   fanSpeed: number;
//   powerUsage: number;
//   status: "ONLINE" | "OFFLINE" | "WARNING";
//   timestamp: string;
//   __v?: number;
// }
export interface Sensor {
  _id: string;
  asicId: string;
  temperature: number;
  hashRate: number;
  fanSpeed: number;
  powerUsage: number;
  status: "ONLINE" | "OFFLINE" | "WARNING";
  timestamp: string;
  // New properties:
  hardwareErrors: number;
  currentAlgorithm: string;
  poolPerformance: number;
  __v?: number;
}

export interface OpsAlert {
  _id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  metadata?: any;
  acknowledged: boolean;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  __v?: number;
}

export interface ClientAllocation {
  _id: string;
  clientId: string;
  clientName: string;
  asicIds: string[];
  totalHashrateTHs: number;
  dailyRevenueBTC: number;
  dailyRevenueUSD: number;
  managementFeeUSD: number;
  lastUpdated: string;
  __v?: number;
}

// export interface FacilitySnapshot {
//   _id: string;
//   timestamp: string;
//   totalHashrateTHs?: number;
//   avgHashrateTHs?: number;
//   totalPowerKW?: number;
//   facilityTemperature?: number;
//   hvacSetting?: number;
//   generatorStatus?: "OFF" | "RUNNING" | "STANDBY" | "ERROR";
//   uptime24h?: number;
//   uptime30d?: number;
//   dailyRevenueBTC?: number;
//   dailyRevenueUSD?: number;
//   totalManagementFeesUSD?: number;
//   __v?: number;
// }
export interface FacilitySnapshot {
  _id: string;
  timestamp: string;
  totalHashrateTHs?: number;
  avgHashrateTHs?: number;
  totalPowerKW?: number;
  facilityTemperature?: number;
  hvacSetting?: number;
  generatorStatus?: "OFF" | "RUNNING" | "STANDBY" | "ERROR";
  uptime24h?: number;
  uptime30d?: number;
  dailyRevenueBTC?: number;
  dailyRevenueUSD?: number;
  totalManagementFeesUSD?: number;
  // New for energy reporting:
  accumulatedEnergyKWh?: number;
  __v?: number;
}

export interface AsicProfitConfig {
  _id: string;
  asicId: string;
  autoSwitchEnabled: boolean;
  lastSwitchedAt?: string;
  currentAlgorithm?: string;
}
export interface ProfitSwitchObject {
  configs: AsicProfitConfig[];
}

export interface OpsOverviewResponse {
  facility: FacilitySnapshot;
  clients: ClientAllocation[];
  profitSwitch: ProfitSwitchObject;
  alerts: OpsAlert[];
  controls: {
    hvacAdjustable: boolean;
    generatorControlAvailable: boolean;
    emergencyShutdownAvailable: boolean;
  };
}

export interface OpsCommand {
  _id: string;
  asicId: string;
  command: string;
  issuedBy: string;
  status?: "PENDING" | "SENT" | "FAILED";
  createdAt: string;
  __v?: number;
}

export const opsApi = createApi({
  reducerPath: "opsApi",
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ["OpsOverview", "OpsDashboard", "Sensors", "Alerts", "Commands"],

  endpoints: (builder) => ({
    // 1. Main Overview (the crown jewel)
    getOpsOverview: builder.query<OpsOverviewResponse, void>({
      query: () => "/ops/overview",
      providesTags: ["OpsOverview", "Sensors", "Alerts"],
    }),

    // 2. dashboard stats
    getOpsDashboard: builder.query<{ stats: OpsStats }, void>({
      query: () => "/ops/dashboard",
      providesTags: ["OpsDashboard"],
    }),

    // 3. All sensors (latest reading per ASIC)
    getOpsSensors: builder.query<Sensor[], void>({
      query: () => "/ops/sensors",
      providesTags: ["Sensors"],
    }),

    // 4. Sensor history for one ASIC
    getSensorHistory: builder.query<Sensor[], { asicId: string; limit?: number }>({
      query: ({ asicId, limit = 150 }) => `/ops/sensors/${asicId}/history?limit=${limit}`,
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: "Sensors" as const, id: _id })) : ["Sensors"],
    }),

    // 5. Alerts
    getOpsAlerts: builder.query<OpsAlert[], void>({
      query: () => "/ops/alerts",
      providesTags: ["Alerts"],
    }),

    // 6. Command history
    getOpsCommands: builder.query<
      { commands: OpsCommand[]; pagination: { page: number; limit: number; total: number; pages: number } },
      { asicId?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (!params) return "/ops/commands";
        const q = new URLSearchParams();
        if (params.asicId) q.set("asicId", params.asicId);
        if (params.page) q.set("page", String(params.page));
        if (params.limit) q.set("limit", String(params.limit));
        return `/ops/commands?${q.toString()}`;
      },
      providesTags: ["Commands"],
    }),

    // ================================
    // MUTATIONS
    // ================================

    sendOpsCommand: builder.mutation<
      { message: string; command: OpsCommand },
      { asicId: string; command: "REBOOT" | "POWER_ON" | "POWER_OFF" | "RESET_POOL" }
    >({
      query: (body) => ({
        url: "/ops/command",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OpsDashboard", "Sensors", "Commands"],
    }),

    acknowledgeAlert: builder.mutation<OpsAlert, string>({
      query: (alertId) => ({
        url: `/ops/alerts/${alertId}/ack`,
        method: "PUT",
      }),
      invalidatesTags: ["Alerts", "OpsOverview"],
    }),

    // HVAC Control
    setHVAC: builder.mutation<
      { success: true; message: string; newSetting: number; issuedBy: string },
      { temperature: number }
    >({
      query: (body) => ({
        url: "/ops/facility/hvac",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OpsOverview"],
    }),

    // Generator Control
    controlGenerator: builder.mutation<
      { success: true; message: string; newStatus: string; issuedBy: string },
      { action: "START" | "STOP" | "TEST" }
    >({
      query: (body) => ({
        url: "/ops/facility/generator",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OpsOverview"],
    }),

    // Emergency Shutdown (NUCLEAR OPTION)
    emergencyShutdown: builder.mutation<
      {
        success: true;
        message: string;
        affectedMiners: number;
        reason: string;
        issuedBy: string;
        timestamp: string;
      },
      { reason: string; confirm: true }
    >({
      query: (body) => ({
        url: "/ops/facility/emergency-shutdown",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OpsOverview", "Sensors", "Commands", "Alerts"],
    }),

    updateProfitSwitchConfig: builder.mutation<
      AsicProfitConfig,
      { asicId: string; autoSwitchEnabled?: boolean; currentAlgorithm?: string }
    >({
      query: ({ asicId, ...body }) => ({
        url: `/ops/profit-switch/${asicId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["OpsOverview"],
    }),
  }),
});

export const {
  useGetOpsOverviewQuery,
  useGetOpsDashboardQuery,
  useGetOpsSensorsQuery,
  useGetSensorHistoryQuery,
  useGetOpsAlertsQuery,
  useGetOpsCommandsQuery,

  useSendOpsCommandMutation,
  useAcknowledgeAlertMutation,
  useSetHVACMutation,
  useControlGeneratorMutation,
  useEmergencyShutdownMutation,
   useUpdateProfitSwitchConfigMutation,
} = opsApi;





// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithGlobalErrorHandler } from "../../apiBase";

// // Types
// export interface OpsStats {
//   totalAsics: number;
//   online: number;
//   offline: number;
//   criticalAlerts: number;
// }

// export interface OpsDashboardResponse {
//   stats: OpsStats;
// }

// export interface Sensor {
//   asicId: string;
//   temperature: number;
//   hashRate: number;
//   fanSpeed: number;
//   powerUsage: number;
//   status: "ONLINE" | "OFFLINE" | "WARNING";
//   timestamp: string;
// }

// export interface OpsAlert {
//   _id: string;
//   severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
//   message: string;
//   metadata: any;
//   acknowledged: boolean;
//   createdAt: string;
//   acknowledgedAt?: string;
//   acknowledgedBy?: string;
// }

// export const opsApi = createApi({
//   reducerPath: "opsApi",
//   baseQuery: baseQueryWithGlobalErrorHandler,
//   tagTypes: ["OpsDashboard", "Sensors", "Alerts", "Commands"],

//   endpoints: (builder) => ({
//     getOpsDashboard: builder.query<OpsDashboardResponse, void>({
//       query: () => `/ops/dashboard`,
//       providesTags: ["OpsDashboard"],
//     }),

//     getOpsSensors: builder.query<Sensor[], void>({
//       query: () => `/ops/sensors`,
//       providesTags: ["Sensors"],
//     }),

//     getOpsAlerts: builder.query<OpsAlert[], void>({
//       query: () => `/ops/alerts`,
//       providesTags: ["Alerts"],
//     }),

//     sendOpsCommand: builder.mutation<
//       any,
//       { asicId: string; command: "REBOOT" | "POWER_ON" | "POWER_OFF" | "RESET_POOL" }
//     >({
//       query: (body) => ({
//         url: `/ops/command`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["OpsDashboard"],
//     }),

//     acknowledgeAlert: builder.mutation<any, string>({
//       query: (alertId) => ({
//         url: `/ops/alerts/${alertId}/ack`,
//         method: "PUT",
//       }),
//       invalidatesTags: ["Alerts", "OpsDashboard"],
//     }),

//     getOpsCommands: builder.query<
//       { commands: any[]; pagination: { page: number; limit: number; total: number; pages: number } },
//       { asicId?: string; page?: number; limit?: number } | void
//     >({
//       query: (params) => {
//         if (!params) return `/ops/commands`;
//         const q = new URLSearchParams();
//         if (params.asicId) q.set('asicId', params.asicId);
//         if (params.page) q.set('page', String(params.page));
//         if (params.limit) q.set('limit', String(params.limit));
//         return `/ops/commands?${q.toString()}`;
//       },
//       providesTags: ['OpsDashboard', 'Sensors', 'Alerts', 'Commands'],
//     }),

//     getSensorHistory: builder.query<any[], { asicId: string; limit?: number }>({
//       query: ({ asicId, limit = 150 }) => `/ops/sensors/${asicId}/history?limit=${limit}`,
//       providesTags: (result, error, arg) => (result ? result.map((r) => ({ type: 'Sensors' as const, id: r._id })) : ['Sensors']),
//     }),

//   }),
// });

// export const {
//   useGetOpsDashboardQuery,
//   useGetOpsSensorsQuery,
//   useGetOpsAlertsQuery,
//   useSendOpsCommandMutation,
//   useAcknowledgeAlertMutation,
//   useGetOpsCommandsQuery,
//   useGetSensorHistoryQuery
// } = opsApi;

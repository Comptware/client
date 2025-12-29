// store/features/projectApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithGlobalErrorHandler } from "../../apiBase";
import { ProjectProgress } from "@/types";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ["Project"],

  endpoints: (builder) => ({
    getProjectProgress: builder.query<{ projectProgress: ProjectProgress }, void>({
      query: () => "/project/my-progress",
      providesTags: ["Project"],
    }),
  }),
});

export const { useGetProjectProgressQuery } = projectApi;
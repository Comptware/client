"use client";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { useGetAsicRorDetailsQuery } from "@/store/features/ror/rorApi";

interface AsicRorDetailsProps {
  asicId: string;
}

export const AsicRorDetails = ({ asicId }: AsicRorDetailsProps) => {
  const { data, isLoading, error } = useGetAsicRorDetailsQuery(asicId);

  if (isLoading) {
    return (
      <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
        <p className="text-red-500">Failed to fetch ASIC ROR details</p>
      </div>
    );
  }

  const summary = data?.data?.summary;

  if (!summary) {
    return (
      <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href="/dashboard">
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <Link href="/dashboard/asic-ror">
            <span>ASIC ROR</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>{summary.asic_id}</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">
        ASIC ROR Details - {summary.asic_id}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Basic Information</h4>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Client ID:</span>
                <span className="text-sm font-semibold">
                  {summary.client_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">ASIC ID:</span>
                <span className="text-sm font-semibold">{summary.asic_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Model:</span>
                <span className="text-sm font-semibold">
                  {summary.asic_model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Purchase Date:</span>
                <span className="text-sm font-semibold">
                  {new Date(summary.purchase_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Financial Summary</h4>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">
                  Purchase Price:
                </span>
                <span className="text-sm font-semibold">
                  ${summary.purchase_price_usd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">
                  Total Earnings:
                </span>
                <span className="text-sm font-semibold text-success">
                  ${summary.total_earnings_usd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Current ROR:</span>
                <span className="text-sm font-semibold text-success">
                  {summary.current_ror_percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Timeframe Performance</h4>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Timeframe:</span>
                <span className="text-sm font-semibold">
                  {summary.timeframe.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">
                  Timeframe Earnings:
                </span>
                <span className="text-sm font-semibold text-success">
                  ${summary.timeframe_earnings_usd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Timeframe ROR:</span>
                <span className="text-sm font-semibold text-success">
                  {summary.timeframe_ror.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Date Range</h4>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">
                  Start Date:
                </span>
                <span className="text-sm font-semibold">
                  {new Date(summary.timeframe_range.start).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">End Date:</span>
                <span className="text-sm font-semibold">
                  {new Date(summary.timeframe_range.end).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

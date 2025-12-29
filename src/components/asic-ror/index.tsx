"use client";
import { Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { useGetAsicRorSummaryQuery } from "@/store/features/ror/rorApi";
import { AsicRorTable } from "./asic-ror-table";

export const AsicRor = () => {
  const { data, isLoading, error } = useGetAsicRorSummaryQuery();

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
        <p className="text-red-500">Failed to fetch ASIC ROR data</p>
      </div>
    );
  }

  const totals = data?.data?.totals;
  const items = data?.data?.items || [];

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
          <span>ASIC ROR</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">ASIC Rate of Return</h3>

      {totals && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardBody>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-default-500">
                  Total Purchase Price
                </span>
                <span className="text-xl font-semibold">
                  ${totals.total_purchase_price_usd.toLocaleString()}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-default-500">Total Earnings</span>
                <span className="text-xl font-semibold">
                  ${totals.total_earnings_usd.toLocaleString()}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-default-500">Current ROR</span>
                <span className="text-xl font-semibold">
                  {totals.current_ror_percentage.toFixed(2)}%
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-default-500">
                  Timeframe Earnings
                </span>
                <span className="text-xl font-semibold">
                  ${totals.timeframe_earnings_usd.toLocaleString()}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-default-500">Timeframe ROR</span>
                <span className="text-xl font-semibold">
                  {totals.timeframe_ror.toFixed(2)}%
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="max-w-[95rem] mx-auto w-full">
        <AsicRorTable items={items} />
      </div>
    </div>
  );
};

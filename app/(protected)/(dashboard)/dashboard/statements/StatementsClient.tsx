"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Pagination,
  Skeleton,
  Tooltip,
} from "@nextui-org/react";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { downloadSamplePDF } from "@/api/client";

const PAGE_SIZE = 10;

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(value))
    : "—";

const statusColor = (
  status: string,
): "default" | "warning" | "success" | "secondary" => {
  if (status === "draft") return "default";
  if (status === "finalized") return "secondary";
  if (status === "sent") return "warning";
  if (status === "viewed" || status === "downloaded") return "success";
  return "default";
};

interface Statement {
  id: string;
  statementNumber: string;
  statementDate: string;
  periodStart: string;
  periodEnd: string;
  netPayoutBTC: number;
  netPayoutUSD: number;
  status: string;
}

const sampleStatements: Statement[] = Array.from({ length: 37 }).map((_, i) => ({
  id: `${i}`,
  statementNumber: `STM-202509-8688C2-176429326${5000 + i}`,
  statementDate: "2025-12-19",
  periodStart: "2025-12-01",
  periodEnd: "2025-12-15",
  netPayoutBTC: Number((Math.random() * 0.05).toFixed(6)),
  netPayoutUSD: Number((Math.random() * 2000).toFixed(2)),
  status: ["draft", "finalized", "sent", "viewed", "downloaded"][i % 5],
}));

const fakeFetchStatements = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return { statements: sampleStatements };
};

export const Statements = () => {
  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const { refetch, isFetching, error } = useQuery({
    queryKey: ["download-statement-pdf"],
    queryFn: downloadSamplePDF,
    enabled: false,
  });

  const handleDownload = async (statementNumber: string) => {
    const result = await refetch();

    if (result.data) {
      downloadBlob(result.data, `${statementNumber}.pdf`);
    }
  };

  const isDateRangeInvalid =
    !!startDate && !!endDate && new Date(startDate) > new Date(endDate);

  const { data, isLoading } = useQuery({
    queryKey: ["statements", page, status, startDate, endDate],
    queryFn: fakeFetchStatements,
  });

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();

        anchor.remove();
        window.URL.revokeObjectURL(url);
    };

  const filtered = useMemo(() => {
    let list = data?.statements ?? [];

    if (status !== "all") {
      list = list.filter((s) => s.status === status);
    }

    if (startDate) {
      list = list.filter((s) => new Date(s.statementDate) >= new Date(startDate));
    }

    if (endDate) {
      list = list.filter((s) => new Date(s.statementDate) <= new Date(endDate));
    }

    return list;
  }, [data, status, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pageData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [status, startDate, endDate]);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full">
      <Card className="border border-default-100 shadow-sm">
        <CardHeader className="flex flex-col gap-6">
            <div className="w-full max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
									type="date"
									label="Start date"
									value={startDate}
									labelPlacement="outside-left"
									className=""
									onChange={(e) => setStartDate(e.target.value)}
									isInvalid={isDateRangeInvalid}
                />

                <Input
									type="date"
									label="End date"
									labelPlacement="outside-left"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									isInvalid={isDateRangeInvalid}
									errorMessage={
									isDateRangeInvalid ? "End date must be after start date" : undefined
									}
                />
                </div>
            </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {pageData.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-default-100 bg-content1/60 p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        Period {formatDate(s.periodStart)} →{" "}
                        {formatDate(s.periodEnd)}
                      </p>
                      <p className="text-xs text-default-500">
                        Statement date {formatDate(s.statementDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">

                      <Button
                        size="sm"
                        isIconOnly
                        variant="flat"
                        aria-label="Download statement"
                      >
                        <Tooltip content="Download Statement">
                            <Download size={16} onClick={() => handleDownload(s.statementNumber)} />
                        </Tooltip>
                      </Button>
                    </div>
                  </div>
                ))}

                {!pageData.length && (
                  <p className="text-sm text-default-500">
                    No statements found.
                  </p>
                )}
              </div>

              {!!totalPages && (
                <div className="flex justify-end pt-3">
                  <Pagination
                    page={page}
                    total={totalPages}
                    onChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

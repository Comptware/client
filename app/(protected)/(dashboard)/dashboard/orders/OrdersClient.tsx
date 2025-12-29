"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Skeleton,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Radar } from "lucide-react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { TableWrapper } from "@/components/table/orders/table-order";
import { getOrders } from "@/api/client";
import { orders as seedOrders } from "@/components/table/orders/order-data";
import { Order } from "@/types/orders";

const normalizeStatus = (value?: string) => (value ? value.toLowerCase() : "");
const toTitle = (value?: string) =>
  value ? value.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
const formatDate = (value?: string) =>
  value ? moment(value).format("Do [of] MMM, YYYY") : "—";
const formatAmount = (amount?: number, order?: Order) => {
  if (amount == null || !order) return "—";
  const currency = order.payment_summary?.currency ?? order.order_details.currency;
  if (!currency) return amount.toLocaleString();
  const symbol = currency === "USD" ? "$" : currency;
  return `${symbol}${amount.toLocaleString()}`;
};

const orderStatusChipColor = (
  status?: string
): "success" | "warning" | "secondary" | "default" => {
  switch (status) {
    case "BALANCE_DUE":
      return "warning";
    case "IN_PROGRESS":
      return "secondary";
    case "ACTIVATED":
      return "success";
    default:
      return "default";
  }
};

export const Orders = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const ordersData = ordersQuery.data?.orders ?? seedOrders;

  useEffect(() => {
    if (!ordersData.length) return;
    if (!selectedOrderId) {
      setSelectedOrderId(ordersData[0].order_id);
      return;
    }
    const exists = ordersData.some((order) => order.order_id === selectedOrderId);
    if (!exists) setSelectedOrderId(ordersData[0].order_id);
  }, [ordersData, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ordersData.filter((order) => {
      const matchesSearch =
        !term ||
        order.order_id.toLowerCase().includes(term) ||
        order.fulfillment_stage.toLowerCase().includes(term) ||
        normalizeStatus(order.status).includes(term);
      const matchesStatus =
        statusFilter === "all" || normalizeStatus(order.status) === statusFilter;
      const matchesStage =
        stageFilter === "all" ||
        order.fulfillment_stage.toLowerCase().includes(stageFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [ordersData, search, stageFilter, statusFilter]);

  const selectedOrder: Order | undefined =
    filteredOrders.find((order) => order.order_id === selectedOrderId) ??
    ordersData.find((order) => order.order_id === selectedOrderId) ??
    filteredOrders[0] ??
    ordersData[0];

  const metrics = useMemo(() => {
    if (!ordersData.length) return [];
    const active = ordersData.filter((order) => normalizeStatus(order.status) === "active").length;
    const provisioning = ordersData.filter((order) => !order.provisioning_complete).length;
    const avgProgress =
      ordersData.reduce((acc, order) => acc + order.stage_progress_percentage, 0) /
      ordersData.length;
    return [
      { label: "Active", value: active, context: "Orders running clean" },
      { label: "Provisioning", value: provisioning, context: "In-flight racks and burn-in" },
      { label: "Avg. Progress", value: `${Math.round(avgProgress)}%`, context: "Across all stages" },
    ];
  }, [ordersData]);

  const statusOptions = useMemo(() => {
    const unique = new Set<string>();
    ordersData.forEach((order) => unique.add(normalizeStatus(order.status)));
    return Array.from(unique).filter(Boolean);
  }, [ordersData]);

  const stageOptions = useMemo(() => {
    const unique = new Set<string>();
    ordersData.forEach((order) => unique.add(order.fulfillment_stage));
    return Array.from(unique);
  }, [ordersData]);

  const statusItems = useMemo(
    () =>
      [
        { key: "all", label: "Status: Any" },
        ...statusOptions.map((status) => ({ key: status, label: toTitle(status) })),
      ] as { key: string; label: string }[],
    [statusOptions]
  );

  const stageItems = useMemo(
    () =>
      [
        { key: "all", label: "Stage: Any" },
        ...stageOptions.map((stage) => ({ key: stage, label: toTitle(stage) })),
      ] as { key: string; label: string }[],
    [stageOptions]
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    if (selectedOrderId) {
      queryClient.invalidateQueries({ queryKey: ["order-detail", selectedOrderId] });
    }
  };

  const handleExportCsv = () => {
    if (!filteredOrders.length) return;
    const headers = [
      "Order ID",
      "Order Status",
      "Payment Status",
      "Stage",
      "Progress (%)",
      "Total Amount",
      "Amount Paid",
      "Balance Remaining",
      "ETA",
    ];
    const rows = filteredOrders.map((order) => {
      const total = order.payment_summary?.total_amount ?? order.order_details.total_amount;
      const paid = order.payment_summary?.amount_paid ?? 0;
      const remaining = order.payment_summary?.balance_remaining ?? Math.max(total - paid, 0);
      const currency = order.payment_summary?.currency ?? order.order_details.currency;
      const symbol = currency === "USD" ? "$" : currency;
      return [
        order.order_id,
        order.order_status_label ?? toTitle(order.order_status),
        order.payment_status_label ?? toTitle(order.payment_status),
        order.fulfillment_stage,
        order.stage_progress_percentage,
        `${symbol}${total.toLocaleString()}`,
        `${symbol}${paid.toLocaleString()}`,
        `${symbol}${remaining.toLocaleString()}`,
        formatDate(order.actual_completion_date ?? order.expected_completion_date),
      ];
    });
    const escape = (value: string | number) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isLoading = ordersQuery.isLoading;
  const hasError = ordersQuery.isError;

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-6">
      {/* <section className="relative overflow-hidden rounded-2xl border border-content2/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-900 text-white shadow-lg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-60 h-60 bg-indigo-600/30 blur-3xl -top-10 -left-6" />
          <div className="absolute w-72 h-72 bg-cyan-500/20 blur-[90px] bottom-0 right-10" />
        </div>
        <div className="relative flex flex-col gap-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm text-indigo-100/80 mt-1">
                Track provisioning across ASIC miners and boosters and surface notifications.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((item) => (
              <Card key={item.label} className="bg-white/5 border-white/10 text-white">
                <CardBody className="gap-1">
                  <p className="text-sm text-indigo-100/80">{item.label}</p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-xs text-indigo-100/70">{item.context}</p>
                </CardBody>
              </Card>
            ))}
            {!metrics.length && (
              <Card className="bg-white/5 border-white/10 text-white">
                <CardBody className="flex items-center gap-3">
                  <Spinner color="secondary" size="sm" />
                  <p className="text-sm text-indigo-100/80">Loading orders...</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </section> */}

      <div className="space-y-6">
        <Card className="border border-default-100 shadow-sm">
          <CardBody className="gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  size="sm"
                  className="w-full md:w-72"
                  placeholder="Search order, stage, or status"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="flat">
                      Status: {statusFilter === "all" ? "Any" : toTitle(statusFilter)}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by status"
                    selectionMode="single"
                    selectedKeys={new Set([statusFilter])}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setStatusFilter(key ?? "all");
                    }}
                  >
                    {statusItems.map((item) => (
                      <DropdownItem key={item.key}>{item.label}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="flat">
                      Stage: {stageFilter === "all" ? "Any" : toTitle(stageFilter)}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by stage"
                    selectionMode="single"
                    selectedKeys={new Set([stageFilter])}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setStageFilter(key ?? "all");
                    }}
                  >
                    {stageItems.map((item) => (
                      <DropdownItem key={item.key}>{item.label}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Chip startContent={<ShieldCheck size={14} />} variant="flat">
                  {ordersData.length} tracked
                </Chip>
                <Chip startContent={<Radar size={14} />} color="secondary" variant="flat">
                  {filteredOrders.length} visible
                </Chip>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="bordered" onClick={handleRefresh} isDisabled={isLoading}>
                  Refresh view
                </Button>
                <Button size="sm" color="secondary" onClick={handleExportCsv} isDisabled={!filteredOrders.length}>
                  Export to CSV
                </Button>
              </div>
            </div>
            <Divider />
            {hasError && (
              <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                Unable to load orders. Please retry.
              </div>
            )}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : (
              <TableWrapper
                data={filteredOrders}
                selectedOrderId={selectedOrderId}
                onSelectOrder={(id) => {
                  setSelectedOrderId(id);
                  router.push(`/dashboard/orders/${id}`);
                }}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

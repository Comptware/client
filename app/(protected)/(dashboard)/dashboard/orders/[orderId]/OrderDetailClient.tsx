"use client";

import { Button, Card, CardBody, CardHeader, Chip, Progress, Spinner } from "@nextui-org/react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, CircuitBoard, Radar, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { getOrderById } from "@/api/client";
import { orders as seedOrders } from "@/components/table/orders/order-data";
import { Order } from "@/types/orders";

const normalizeStatus = (value?: string) => (value ? value.toLowerCase() : "");
const toTitle = (value?: string) =>
  value ? value.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
const formatDate = (value?: string) =>
  value ? moment(value).format("Do [of] MMM, YYYY") : "—";
const formatDateTime = (value?: string) =>
  value ? moment(value).format("Do [of] MMM, YYYY, h:mm A") : "—";
const formatAmount = (amount?: number, currency?: string) => {
  if (amount == null) return "—";
  const symbol = currency === "USD" ? "$" : currency ?? "";
  return `${symbol}${amount.toLocaleString()}`;
};

const statusChipColor = (status?: string): "success" | "warning" | "danger" | "default" => {
  const normalized = normalizeStatus(status);
  if (normalized === "active" || normalized === "completed") return "success";
  if (normalized === "paused" || normalized === "on_hold") return "warning";
  if (normalized === "degraded") return "danger";
  return "default";
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

type Props = {
  orderId: string;
};

export const OrderDetailClient = ({ orderId }: Props) => {
  const router = useRouter();

  const detailQuery = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => getOrderById(orderId),
    select: (res) => res.order,
    enabled: !!orderId,
  });

  const order: Order | undefined =
    detailQuery.data ?? seedOrders.find((o) => o.order_id === orderId) ?? seedOrders[0];

  const payment = useMemo(() => {
    if (!order?.payment_summary) return null;
    const summary = order.payment_summary;
    return {
      status: summary.status,
      status_label: summary.status_label ?? order.payment_status_label,
      amount_paid: summary.amount_paid,
      remaining_balance: summary.balance_remaining,
      last_payment_at: order.updatedAt,
      total_due: summary.total_amount,
      currency: summary.currency ?? order.order_details.currency,
      pay_now_available: summary.pay_now_available,
      pay_now_url: summary.pay_now_url ?? `/orders/${order.order_id}/invoice`,
    };
  }, [order]);

  const timeline = useMemo(
    () =>
      order?.go_live_tracking?.length ? order.go_live_tracking : order?.stages_timeline ?? [],
    [order]
  );

  const invoiceUrl = order ? `/orders/${order.order_id}/invoice` : "#";
  const receiptUrl = order ? `/orders/${order.order_id}/receipt` : "#";
  const invoiceAvailable = !!order?.documents?.invoice_available;
  const receiptAvailable = !!order?.documents?.receipt_available;
  const customerName = order?.customer_name ?? order?.userId ?? "Customer";

  const handlePayNow = () => {
    if (!order) return;
    const url = payment?.pay_now_url ?? `/orders/${order.order_id}/invoice`;
    router.push(url);
  };

  const generatePdf = (type: "invoice" | "receipt") => {
    if (!order) return;
    const currency = payment?.currency ?? order.order_details.currency;
    const title = type === "invoice" ? "Invoice" : "Receipt";
    const logo = `${window.location.origin}/assets/icons/suncore-logo-blac.png`;
    const html = `
      <html>
        <head>
          <title>${title} ${order.order_id}</title>
          <style>
            @media print { @page { margin: 18mm; } }
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; background: #f8fafc; }
            .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06); }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .title { font-size: 24px; margin: 0; }
            .muted { color: #475569; font-size: 12px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; margin: 12px 0; }
            .pill { padding: 8px 10px; border-radius: 10px; border: 1px solid #e2e8f0; background: #f8fafc; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th { text-align: left; font-size: 12px; color: #475569; border-bottom: 1px solid #e2e8f0; padding: 8px 6px; }
            td { font-size: 12px; padding: 8px 6px; border-bottom: 1px solid #f1f5f9; }
            .totals { margin-top: 16px; display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; }
            .totals div { padding: 10px 12px; border-radius: 10px; background: #0f172a; color: #e2e8f0; }
            .totals .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.02em; opacity: 0.7; }
            .totals .value { font-size: 16px; font-weight: 700; margin-top: 4px; }
            .meta { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
            .meta div { font-size: 12px; color: #475569; }
            .section { margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <img src="${logo}" alt="SunCore" style="height:36px; object-fit:contain;" />
                <p class="muted" style="margin-top:4px;">SunCore Digital</p>
              </div>
              <div style="text-align:right;">
                <p class="title">${title}</p>
                <p class="muted">Order ${order.order_id}</p>
                <p class="muted">Created ${formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div class="grid">
              <div class="pill">
                <div class="muted">Order Status</div>
                <div><strong>${order.order_status_label ?? "—"}</strong></div>
              </div>
              <div class="pill">
                <div class="muted">Payment Status</div>
                <div><strong>${payment?.status_label ?? "—"}</strong></div>
              </div>
              <div class="pill">
                <div class="muted">ETA</div>
                <div><strong>${formatDate(order.actual_completion_date ?? order.expected_completion_date)}</strong></div>
              </div>
              <div class="pill">
                <div class="muted">Customer</div>
                <div><strong>${customerName}</strong></div>
              </div>
            </div>

            <div class="section">
              <table>
                <thead>
                  <tr><th>Product</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
                </thead>
                <tbody>
                  ${order.order_details.products
                    .map(
                      (p) =>
                        `<tr><td>${p.productType}</td><td>${p.quantity}</td><td>${formatAmount(
                          p.unitPrice,
                          currency
                        )}</td><td>${formatAmount(p.totalPrice, currency)}</td></tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            <div class="totals">
              <div>
                <div class="label">Total</div>
                <div class="value">${formatAmount(payment?.total_due, currency)}</div>
              </div>
              <div>
                <div class="label">Paid</div>
                <div class="value">${formatAmount(payment?.amount_paid, currency)}</div>
              </div>
              <div>
                <div class="label">Balance</div>
                <div class="value">${formatAmount(payment?.remaining_balance, currency)}</div>
              </div>
            </div>

            <div class="meta">
              <div>Payment status: <strong>${payment?.status_label ?? "—"}</strong></div>
              <div>Generated: ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  if (detailQuery.isLoading || !order) {
    return (
      <div className="p-6 max-w-[100rem] mx-auto">
        <div className="flex items-center gap-2 text-default-500 text-sm">
          <Spinner size="sm" /> Loading order...
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[100rem] mx-auto w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-default-500">Order</p>
          <p className="text-2xl font-semibold">{order.order_id}</p>
          <p className="text-xs text-default-500">Created {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Chip size="sm" variant="flat" color={orderStatusChipColor(order.order_status)}>
            {order.order_status_label ?? toTitle(order.order_status)}
          </Chip>
          <Chip size="sm" variant="flat" color={statusChipColor(order.status)}>
            {toTitle(normalizeStatus(order.status))}
          </Chip>
          <Button size="sm" variant="bordered" onClick={() => router.push("/dashboard/orders")}>
            Back to orders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-default-100 shadow-sm">
          <CardHeader className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Payment summary</p>
              <p className="text-xs text-default-500">
                Track balance, receipts, and invoices for this order.
              </p>
            </div>
            {payment?.pay_now_available && (
              <Button size="sm" color="secondary" onClick={handlePayNow}>
                {order.payment_summary?.pay_now_action?.cta ?? "Pay Now"}
              </Button>
            )}
          </CardHeader>
          <CardBody className="gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-default-100 bg-content1/60 p-3">
              <p className="text-xs text-default-500">Total</p>
              <p className="font-semibold">
                {formatAmount(payment?.total_due, payment?.currency ?? order.order_details.currency)}
                </p>
              </div>
              <div className="rounded-lg border border-default-100 bg-content1/60 p-3">
                <p className="text-xs text-default-500">Paid</p>
                <p className="font-semibold">
                  {formatAmount(payment?.amount_paid, payment?.currency ?? order.order_details.currency)}
                </p>
              </div>
              <div className="rounded-lg border border-default-100 bg-content1/60 p-3">
                <p className="text-xs text-default-500">Balance</p>
                <p className="font-semibold">
                  {formatAmount(
                    payment?.remaining_balance,
                    payment?.currency ?? order.order_details.currency
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                as="a"
                href={invoiceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!invoiceAvailable) {
                    e.preventDefault();
                    return;
                  }
                  generatePdf("invoice");
                }}
                variant="bordered"
                size="sm"
                isDisabled={!invoiceAvailable}
              >
                Download Invoice (PDF)
              </Button>
              <Button
                as="a"
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!receiptAvailable) {
                    e.preventDefault();
                    return;
                  }
                  generatePdf("receipt");
                }}
                variant="bordered"
                size="sm"
                isDisabled={!receiptAvailable}
              >
                Download Receipt (PDF)
              </Button>
              <Button
                as="a"
                href={order.documents?.management_agreement_pdf ?? "#"}
                download
                variant="bordered"
                size="sm"
                isDisabled={!order.documents?.management_agreement_pdf}
              >
                Management Agreement
              </Button>
              {payment?.pay_now_available && (
                <Button color="warning" variant="flat" size="sm" onClick={handlePayNow}>
                  {order.payment_summary?.pay_now_action?.cta ?? "Pay Now"}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-100 shadow-sm">
          <CardHeader className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-default-500">Status</p>
              <p className="text-lg font-semibold">{order.fulfillment_stage}</p>
              <p className="text-xs text-default-500">
                ETA {formatDate(order.actual_completion_date ?? order.expected_completion_date)}
              </p>
            </div>
            <Chip
              size="sm"
              color={order.provisioning_complete ? "success" : "secondary"}
              variant="flat"
              startContent={<Zap size={14} />}
            >
              {order.provisioning_complete ? "Live ops" : "Provisioning"}
            </Chip>
          </CardHeader>
          <CardBody className="gap-3">
            <div className="flex items-center gap-2">
              <Progress
                aria-label="Order progress"
                value={order.stage_progress_percentage}
                className="w-full"
                color="secondary"
              />
              <span className="text-sm font-semibold">
                {order.stage_progress_percentage}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-default-100 bg-content1/60 p-3">
                <p className="text-xs text-default-500">Amount</p>
                <p className="text-lg font-semibold">
                  {formatAmount(order.order_details.total_amount, order.order_details.currency)}
                </p>
              </div>
              <div className="rounded-xl border border-default-100 bg-content1/60 p-3">
                <p className="text-xs text-default-500">Last update</p>
                <p className="text-lg font-semibold">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border border-default-100 shadow-sm">
        <CardHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CircuitBoard size={16} className="text-default-500" />
            <p className="text-sm font-semibold">ASIC and booster allocation</p>
          </div>
          <p className="text-xs text-default-500">
            Order inventory, on-rack specs, and boosters that lift performance.
          </p>
        </CardHeader>
        <CardBody className="gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {order.order_details.products.map((product) => (
              <div
                key={`${product.productType}-${product.unitPrice}`}
                className="rounded-xl border border-default-100 p-4 bg-content1/60"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{toTitle(product.productType)}</p>
                  <Chip size="sm" color={product.isBooster ? "secondary" : "success"} variant="flat">
                    {product.isBooster ? "Booster" : "ASIC"}
                  </Chip>
                </div>
                <p className="text-xs text-default-500">
                  {product.quantity} units @ {product.unitPrice.toLocaleString()} each
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-default-500">Power</span>
                  <span className="text-sm font-medium">{product.asicSpec?.power ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Hashrate</span>
                  <span className="text-sm font-medium">{product.asicSpec?.hashRate ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Efficiency</span>
                  <span className="text-sm font-medium">{product.asicSpec?.efficiency ?? "N/A"}</span>
                </div>
                <div className="mt-3 text-sm font-semibold">
                  Total {order.order_details.currency} {product.totalPrice.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          {!!order.order_details.boosters.length && (
            <div className="flex flex-wrap gap-2">
              {order.order_details.boosters.map((booster) => (
                <Chip key={booster.productType} color="secondary" variant="flat">
                  {toTitle(booster.productType)} x{booster.quantity}
                </Chip>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-default-100 shadow-sm">
          <CardHeader className="flex items-center gap-2">
            <Radar size={16} className="text-default-500" />
            <p className="text-sm font-semibold">Go-live tracking</p>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-default-200" />
              <div className="space-y-4">
                {timeline.map((stage, index) => {
                  const normalizedStageStatus = normalizeStatus(stage.status);
                  const color =
                    normalizedStageStatus === "completed"
                      ? "bg-emerald-500"
                      : normalizedStageStatus === "in_progress" ||
                        normalizedStageStatus === "in-progress"
                      ? "bg-indigo-500"
                      : "bg-gray-300";
                  return (
                    <div
                      key={`${stage.stage}-${stage.started_at ?? index}`}
                      className="flex gap-4 relative"
                    >
                      <div className="relative">
                        <span
                          className={`inline-block h-3 w-3 rounded-full border-2 border-white shadow-sm ${color}`}
                        />
                      </div>
                      <div className="flex-1 space-y-1 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{toTitle(stage.stage)}</p>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              normalizedStageStatus === "completed"
                                ? "success"
                                : normalizedStageStatus === "in_progress" ||
                                  normalizedStageStatus === "in-progress"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {toTitle(normalizeStatus(stage.status))}
                          </Chip>
                        </div>
                        <p className="text-xs text-default-500">
                          Start {formatDate(stage.started_at)} •{" "}
                          {stage.completed_at ? `Done ${formatDate(stage.completed_at)}` : "Pending"}
                        </p>
                        {stage.notes && (
                          <p className="text-xs text-default-600 leading-relaxed">{stage.notes}</p>
                        )}
                        {index !== timeline.length - 1 && <div className="h-px bg-default-100 mt-2" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-100 shadow-sm">
          <CardHeader className="flex items-center gap-2">
            <Bell size={16} className="text-default-500" />
            <p className="text-sm font-semibold">Notifications sent</p>
          </CardHeader>
          <CardBody className="gap-3">
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {order.notifications_sent.map((notification) => (
                <div
                  key={`${notification.type}-${notification.sent_at}`}
                  className="flex items-center justify-between rounded-xl border border-default-100 bg-content1/60 p-3"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">{toTitle(notification.type)}</p>
                    <p className="text-xs text-default-500">{formatDateTime(notification.sent_at)}</p>
                  </div>
                  <Chip size="sm" variant="flat" color="secondary">
                    {notification.channel}
                  </Chip>
                </div>
              ))}
              {!order.notifications_sent.length && (
                <p className="text-sm text-default-500">No notifications yet.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

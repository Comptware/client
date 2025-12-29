import { Chip, Progress } from "@nextui-org/react";
import React from "react";
import moment from "moment";
import { Order } from "@/types/orders";

const formatDate = (value?: string) => (value ? moment(value).format("Do [of] MMM, YYYY") : "—");
const displayCurrency = (currency?: string) => (currency === "USD" ? "$" : currency ?? "");

interface Props {
  order: Order;
  columnKey: string | React.Key;
}

export const RenderCell = ({ order, columnKey }: Props) => {
  switch (columnKey) {
    case "order_id":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{order.order_id}</span>
          <span className="text-xs text-default-500">
            Started {formatDate(order.createdAt)}
          </span>
        </div>
      );
    case "fulfillment_stage":
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{order.fulfillment_stage}</span>
          <span className="text-xs text-default-500">
            Updated {new Date(order.updatedAt).toLocaleString()}
          </span>
        </div>
      );
    case "stage_progress_percentage":
      return (
        <div className="flex items-center gap-3">
          <Progress
            aria-label="Stage progress"
            value={order.stage_progress_percentage}
            size="sm"
            color={order.stage_progress_percentage >= 80 ? "success" : "secondary"}
            className="min-w-[140px]"
          />
          <span className="text-sm font-medium text-default-600">
            {order.stage_progress_percentage}%
          </span>
        </div>
      );
    case "amount":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {displayCurrency(order.order_details.currency)}
            {order.order_details.total_amount.toLocaleString()}
          </span>
          <span className="text-xs text-default-500">Boosters included</span>
        </div>
      );
    case "order_status":
      return (
        <Chip
          size="sm"
          variant="flat"
          className="whitespace-normal leading-tight text-[11px]"
          color={
            order.order_status === "ACTIVATED"
              ? "success"
              : order.order_status === "IN_PROGRESS"
              ? "secondary"
              : order.order_status === "BALANCE_DUE"
              ? "warning"
              : "default"
          }
        >
          <span className="text-xs">{order.order_status_label ?? "—"}</span>
        </Chip>
      );
    case "payment_status":
      return (
        <Chip
          size="sm"
          variant="flat"
          className="whitespace-normal leading-tight text-[11px]"
          color={
            order.payment_status === "PAID_IN_FULL"
              ? "success"
              : order.payment_status === "REMAINING_BALANCE_DUE"
              ? "warning"
              : "default"
          }
        >
          <span className="text-xs">
            {order.payment_status_label ?? order.payment_status ?? "—"}
          </span>
        </Chip>
      );
    case "expected_completion_date":
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {order.actual_completion_date
              ? formatDate(order.actual_completion_date)
              : formatDate(order.expected_completion_date)}
          </span>
          <span className="text-xs text-default-500">
            {order.actual_completion_date ? "Completed" : "Projected handoff"}
          </span>
        </div>
      );
    default:
      return null;
  }
};

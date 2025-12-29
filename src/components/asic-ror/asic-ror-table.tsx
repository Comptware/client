"use client";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";
import { AsicRorItem } from "@/types";
import { EyeIcon } from "@/components/icons/table/eye-icon";

interface AsicRorTableProps {
  items: AsicRorItem[];
}

const columns = [
  { name: 'ASIC ID', uid: 'asic_id' },
  { name: 'MODEL', uid: 'asic_model' },
  { name: 'PURCHASE PRICE', uid: 'purchase_price_usd' },
  { name: 'TOTAL EARNINGS', uid: 'total_earnings_usd' },
  { name: 'CURRENT ROR %', uid: 'current_ror_percentage' },
  { name: 'TIMEFRAME EARNINGS', uid: 'timeframe_earnings_usd' },
  { name: 'TIMEFRAME ROR %', uid: 'timeframe_ror' },
  { name: 'ACTIONS', uid: 'actions' },
];

export const AsicRorTable = ({ items }: AsicRorTableProps) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(items.length / rowsPerPage);

  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, items]);

  const renderCell = (item: AsicRorItem, columnKey: string) => {
    const summary = item.summary;

    switch (columnKey) {
      case 'asic_id':
        return <span className="text-sm">{summary.asic_id}</span>;
      case 'asic_model':
        return <span className="text-sm font-semibold">{summary.asic_model}</span>;
      case 'purchase_price_usd':
        return <span className="text-sm">${summary.purchase_price_usd.toLocaleString()}</span>;
      case 'total_earnings_usd':
        return <span className="text-sm">${summary.total_earnings_usd.toLocaleString()}</span>;
      case 'current_ror_percentage':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={summary.current_ror_percentage >= 30 ? "success" : summary.current_ror_percentage >= 15 ? "warning" : "default"}
          >
            <span className="text-xs font-semibold">{summary.current_ror_percentage.toFixed(2)}%</span>
          </Chip>
        );
      case 'timeframe_earnings_usd':
        return <span className="text-sm">${summary.timeframe_earnings_usd.toLocaleString()}</span>;
      case 'timeframe_ror':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={summary.timeframe_ror >= 10 ? "success" : summary.timeframe_ror >= 5 ? "warning" : "default"}
          >
            <span className="text-xs font-semibold">{summary.timeframe_ror.toFixed(2)}%</span>
          </Chip>
        );
      case 'actions':
        return (
          <div className="flex items-center gap-4">
            <Tooltip content="View Details">
              <button onClick={() => router.push(`/dashboard/asic-ror/${summary.asic_id}`)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        aria-label="ASIC ROR table"
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedItems}>
          {(item) => (
            <TableRow key={item.summary.asic_id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

import {
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { Order } from "@/types/orders";
import { columns } from "./order-data";
import { RenderCell } from "./render-cell";

type TableWrapperProps = {
  data: Order[];
  selectedOrderId?: string | null;
  onSelectOrder: (orderId: string) => void;
};

export const TableWrapper = ({ data, selectedOrderId, onSelectOrder }: TableWrapperProps) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(data.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  const handleSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const id = Array.from(keys)[0];
    if (id) {
      onSelectOrder(String(id));
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        aria-label="Orders table"
        selectionMode="single"
        selectedKeys={selectedOrderId ? new Set([selectedOrderId]) : new Set()}
        onSelectionChange={handleSelectionChange}
        classNames={{
          wrapper: "shadow-none border border-default-100 bg-content1/60",
          th: "bg-content2/40 text-xs font-semibold text-default-600 uppercase tracking-wide",
          tr: "hover:bg-content2/60 transition-colors",
        }}
        bottomContent={
          <div className="flex w-full justify-between items-center px-2 py-2">
            <span className="text-xs text-default-500">
              Showing {items.length} of {data.length} orders
            </span>
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
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={"No orders yet."}>
          {(item) => (
            <TableRow
              key={item.order_id}
              className="cursor-pointer hover:bg-content2/70 transition-colors"
            >
              {(columnKey) => <TableCell>{RenderCell({ order: item, columnKey })}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

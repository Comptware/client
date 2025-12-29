// components/ops/OpsTable.tsx
"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@nextui-org/react";

export type ColumnDef<T = any> = {
  uid: string;
  name: string;
  align?: "start" | "center" | "end";
  hideHeader?: boolean;
};

type OpsTableProps<T = any> = {
  columns: ColumnDef<T>[];
  data: T[]; // items to render (client or server)
  isLoading?: boolean;
  // server pagination mode
  serverPagination?: boolean;
  page?: number;
  pageSize?: number;
  total?: number; // total items (when serverPagination)
  onPageChange?: (page: number) => void; // called when server page changes
  // optional client-side page control
  defaultPageSize?: number;
  renderCell: (row: T, columnKey: string) => React.ReactNode;
  emptyState?: React.ReactNode;
  rowKey?: (row: T) => string;
};

export default function OpsTable<T = any>({
  columns,
  data,
  isLoading = false,
  serverPagination = false,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  defaultPageSize = 10,
  renderCell,
  emptyState,
  rowKey,
}: OpsTableProps<T>) {
  // client-side pagination state
  const [clientPage, setClientPage] = React.useState(1);

  React.useEffect(() => {
    // reset client page if data changes size
    setClientPage(1);
  }, [data]);

  const currentPage = serverPagination ? page : clientPage;
  const currentPageSize = serverPagination ? pageSize : defaultPageSize;

  const pagesCount = serverPagination
    ? Math.max(1, Math.ceil((total ?? data.length) / currentPageSize))
    : Math.max(1, Math.ceil(data.length / currentPageSize));

  const visibleItems = React.useMemo(() => {
    if (serverPagination) return data;
    const start = (currentPage - 1) * currentPageSize;
    return data.slice(start, start + currentPageSize);
  }, [data, serverPagination, currentPage, currentPageSize]);

  return (
    <div className="w-full">
      <div className="bg-background rounded-lg shadow-sm">
        <Table aria-label="Ops Table" className="min-w-full">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                hideHeader={column.hideHeader}
                align={column.align ?? "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={visibleItems}>
            {(item: any) => (
              <TableRow key={rowKey ? rowKey(item) : item._id ?? JSON.stringify(item)}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {isLoading ? (
          <div className="py-6 flex justify-center items-center">
            <Spinner size="sm" />
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="p-6 text-center text-sm text-default-500">
            {emptyState ?? "No results found."}
          </div>
        ) : null}

        {/* Pagination */}
        <div className="flex justify-center p-4">
          <Pagination
            isCompact
            page={currentPage}
            total={pagesCount}
            onChange={(p) => {
              if (serverPagination) {
                onPageChange?.(p);
              } else {
                setClientPage(p);
              }
            }}
            showControls
            showShadow
            size="sm"
            color="secondary"
          />
        </div>
      </div>
    </div>
  );
}

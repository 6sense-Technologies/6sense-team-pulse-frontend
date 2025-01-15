"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Button as AddButton } from "../../../../components/UI/ButtonComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { GrowthTablePagination } from "./growthTablePagination";
import { IGrowthItems } from "@/types/types";
import { GrowthDrawer } from "./growthDrawer";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<IGrowthItems>[] = [
  {
    id: "rowNumber",
    header: () => <div className="text-bold ml-4">No.</div>,
    cell: ({ row }) => <div className="text-medium ml-6">{row.index + 1}</div>,
    size: 50,
  },
  {
    accessorKey: "goalItem",
    header: () => <div className="text-bold">ITEMS</div>,
    cell: ({ row }) => (
      <div className="text-medium">{row.getValue("goalItem") || "-"}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-bold">STATUS</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      let variant: "todo" | "in-progress" | "completed" = "todo";
      if (status === "In Progress") variant = "in-progress";
      else if (status === "Completed") variant = "completed";
      return <Badge variant={variant}>{String(status) || "-"}</Badge>;
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <div className="text-bold">ACTIONS</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const growthItem = row.original;

      return (
        <div className="flex items-center space-x-4">
          <Button
            variant={"monoChrome"}
            onClick={() => {
              window.location.href = `/member-list/${growthItem.accountId}?page=1`;
            }}
          >
            Details
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              window.location.href = `/member-list/${growthItem.accountId}?page=1`;
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
    size: 150,
  },
];

export const GrowthTable = ({
  growthItems,
  refetch,
  totalCountAndLimit,
}: {
  growthItems: IGrowthItems[];
  totalCountAndLimit: { totalCount: number; size: number };
  refetch: () => void;
}): JSX.Element => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page") || "1");
  const [currentPage, setCurrentPage] = React.useState(page);
  const totalPages = totalCountAndLimit.totalCount
    ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size)
    : 0;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerToggle = (): void => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const table = useReactTable({
    data: growthItems,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCountAndLimit.totalCount / pagination.pageSize),
  });

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
    table.setPageIndex(page - 1);
    refetch();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4">
        <AddButton prefixIcon="PlusCircle" onClick={handleDrawerToggle}>Add Growth</AddButton>
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-bgSecondary border-b-[1px] border-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="min-w-[150px]">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-subHeading">
          Showing {table.getRowModel().rows.length} out of{" "}
          {totalCountAndLimit.totalCount} results
        </div>
        <div className="flex justify-end mb-2">
          <GrowthTablePagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      {isDrawerOpen && (
        <GrowthDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
};

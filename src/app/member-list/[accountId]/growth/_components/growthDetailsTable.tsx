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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { IGrowthDetailItems } from "@/types/types";
import { GrowthDetailsTablePagination } from "./growthDetailsPagination";
import { GrowthDetailsDrawer } from "./growthDetailsDrawer";
import { Button } from "../../../../../app/components/UI/ButtonComponent";
import GrowthDetailsSummary from "./growthDetailsSummary";

export const columns: ColumnDef<IGrowthDetailItems>[] = [
  {
    accessorKey: "createdAt",
    header: () => <div className="text-bold pl-4">DATE</div>,
    cell: ({ row }) => (
      <div className="text-medium pl-4">{new Date(row.getValue("createdAt")).toLocaleDateString() || "-"}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "action",
    header: () => <div className="text-bold">ACTION</div>,
    cell: ({ row }) => (
      <div className="text-medium">{row.getValue("action") || "-"}</div>
    ),
    size: 300,
  },
];

export const GrowthDetailsTable = ({
  growthDetailItems,
  refetch,
  totalCountAndLimit,
}: {
  growthDetailItems: IGrowthDetailItems[];
  totalCountAndLimit: { totalCount: number; size: number };
  refetch: () => void;
}): JSX.Element => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page") || "1");
  const [currentPage, setCurrentPage] = React.useState(page);
  const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / pagination.pageSize) : 0;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerToggle = (): void => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const table = useReactTable({
    data: growthDetailItems,
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

  const goalId = searchParams.get("goalId");

  const handleMarkAsComplete = (goalId: string): void => {
    
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4 gap-4">
        <Button
          prefixIcon="CheckCircle"
          variant={"greenish"}
          onClick={handleDrawerToggle}
        >
          Mark as Done
        </Button>
        <Button prefixIcon="PlusCircle" onClick={handleDrawerToggle}>
          Add Activity
        </Button>
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-bgSecondary border-b-[1px] border-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`text-left ${header.column.id === 'createdAt' ? 'pl-4' : ''}`}>
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
                    <TableCell key={cell.id} className={`min-w-[150px] ${cell.column.id === 'createdAt' ? 'pl-4' : ''}`}>
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
          <GrowthDetailsTablePagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      <GrowthDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerToggle}
        refetch={refetch}
      />
    </div>
  );
};
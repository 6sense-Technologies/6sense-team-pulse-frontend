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
    accessorKey: "date",
    header: () => <div className="text-bold pl-4">DATE</div>,
    cell: ({ row }) => (
      <div className="text-medium pl-4">{row.getValue("date") || "-"}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "activites",
    header: () => <div className="text-bold">ACTIVITIES</div>,
    cell: ({ row }) => (
      <div className="text-medium">
        {(row.getValue("activites") as string[]).join(", ") || "-"}
      </div>
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
  const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size) : 0;
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


  const currentItem = growthDetailItems[0];

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
      {currentItem ? (
        <GrowthDetailsSummary summary={currentItem.summary} />
      ) : null}
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-bgSecondary border-b-[1px] border-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`text-left ${header.column.id === 'date' ? 'pl-4' : ''}`}>
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
                    <TableCell key={cell.id} className={`min-w-[150px] ${cell.column.id === 'date' ? 'pl-4' : ''}`}>
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
        />
    </div>
  );
};
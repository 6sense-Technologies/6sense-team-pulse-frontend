/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
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

import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { Projects } from "@/types/Project.types";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import Image from "next/image";
import { TimelogPagination } from "../../_components/timelogPagination";
import { WorksheetPagination } from "./worksheetPagination";

type TTimelogTableProps = {
  projects?: Projects[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
  currentPage: number;
  loading?: boolean;
  onSelectionChange?: (anySelected: boolean) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  reportedId?: string | null;
};

export const WorksheetTable: React.FC<TTimelogTableProps> = ({
  projects = [],
  refetch,
  totalCountAndLimit = { totalCount: 0, size: 10 },
  currentPage,
  loading,
  onSelectionChange,
  selectedIds,
  setSelectedIds,
  reportedId,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination] = useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  });

  // Read current page from URL
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page") || "1");
  const [currentPageState, setCurrentPageState] = useState(page);
  const [isLoading, setIsLoading] = useState(false);

  // Define columns for the table
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 5,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => {
            // Get all visible row IDs
            const visibleRowIds = table.getRowModel().rows.map((row) => row.original._id);

            if (value) {
              // Add all visible row IDs to selectedIds
              setSelectedIds((prev) => {
                const newSelection = [...prev];
                visibleRowIds.forEach((id) => {
                  if (!newSelection.includes(id)) {
                    newSelection.push(id);
                  }
                });
                return newSelection;
              });
            } else {
              // Remove visible row IDs from selectedIds
              setSelectedIds((prev) => prev.filter((id) => !visibleRowIds.includes(id)));
            }

            // Also update table's internal state
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original._id)}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedIds((prev) => [...prev, row.original._id]);
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== row.original._id));
            }
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-bold">Activity</div>,
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("name") || "-";
        const displayValue = typeof value === "string" && value.length > 50 ? value.slice(0, 50) + "..." : value;
        return (
          <div className="text-medium truncate flex items-center space-x-3">
            {row.original?.icon ? (
              <Image src={row.original?.icon} alt={row.original.name} width={40} height={40} className="w-8 h-8 rounded-full" />
            ) : (
              <Globe />
            )}
            <span>{displayValue}</span>
          </div>
        );
      },
      size: 40,
    },
    {
      accessorKey: "startTime",
      header: () => <div className="text-bold">Start</div>,
      cell: ({ row }: { row: any }) => (
        <div className="text-medium">
          {row.getValue("startTime")
            ? new Date(row.getValue("startTime")).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "-"}
        </div>
      ),
      size: 20,
    },
    {
      accessorKey: "endTime",
      header: () => <div className="text-bold">End</div>,
      cell: ({ row }: { row: any }) => (
        <div className="text-medium">
          {row.getValue("endTime")
            ? new Date(row.getValue("endTime")).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "-"}
        </div>
      ),
      size: 20,
    },
    {
      accessorKey: "timeSpent",
      header: () => <div className="text-bold">Time Spent</div>,
      cell: ({ row }: { row: any }) => {
        const timeSpent = row.getValue("timeSpent");
        if (!timeSpent) return <div className="text-medium">-</div>;
        return (
          <div className="text-medium">
            {timeSpent.hours}h {timeSpent.minutes}m
          </div>
        );
      },
      size: 20,
    },
  ];

  const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size) : 0;
  console.log("🚀 ~ totalPages:", totalPages);

  const table = useReactTable({
    data: projects,
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
    pageCount: totalPages,
  });

  const onPageChange = (page: number): void => {
    setIsLoading(true);
    setCurrentPageState(page);
    table.setPageIndex(page - 1);
    refetch?.();
  };

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedIds.length > 0);
    }
  }, [selectedIds, onSelectionChange]);

  const displayedRowsCount = currentPageState > 1 ? (currentPageState - 1) * pagination.pageSize + projects.length : projects.length;

  return (
    <div className="w-full">
      {isLoading ? (
        <EmptyTableSkeleton />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-lightborderColor">
            <Table className="w-full">
              <TableHeader className="border-b-[1px] text-inputFooterColor">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="py-1 leading-none">
                    {headerGroup.headers.map((header) => {
                      const columnDef = header.column.columnDef as ColumnDef<Projects> & {
                        size?: number;
                      };
                      return (
                        <TableHead key={header.id} className="h-12 pl-4 text-left leading-none" style={{ width: `${columnDef.size}%` }}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-12 leading-none">
                      {row.getVisibleCells().map((cell) => {
                        const columnDef = cell.column.columnDef as ColumnDef<Projects> & {
                          size?: number;
                        };
                        return (
                          <TableCell key={cell.id} className="py-1 leading-none pl-4 text-start" style={{ width: `${columnDef.size}%` }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="py-1 leading-none">
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-center py-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-3 lg:py-4">
            <div className="pl-2 text-sm text-subHeading md:pb-6">
              {displayedRowsCount} of {totalCountAndLimit.totalCount} row(s) showing
            </div>
            <div className="mb-2 flex pt-4 md:justify-end lg:pt-0">
              <WorksheetPagination
                currentPage={currentPageState}
                totalPage={totalPages}
                onPageChange={onPageChange}
                reportedId={reportedId ?? null}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

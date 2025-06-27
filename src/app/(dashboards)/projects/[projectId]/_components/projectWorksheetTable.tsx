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
import { useSearchParams } from "next/navigation";
import { Globe, Keyboard, Pencil, PencilLine, User } from "lucide-react";
import { Projects } from "@/types/Project.types";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import Image from "next/image";

import { set } from "date-fns";
import { TimelogPagination } from "@/app/(dashboards)/timelog/_components/timelogPagination";
import { Button } from "@/components/ButtonComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProjectPagination } from "../../_components/projectPagination";
import { ProjectWorksheetPagination } from "./projectWorksheetPagination";

export type TSelectedTimeLog = {
  _id: string;
  name: string;
  manualType: string;
  startTime: Date;
  endTime: Date;
};

export const ProjectWorksheetTable: React.FC<any> = ({
  projectId,
  worksheets = [],
  refetch,
  totalCountAndLimit = { totalCount: 0, size: 10 },
  currentPage,
  loading,
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
  const [selectedTimeLog, setSelectedTimeLog] = useState<TSelectedTimeLog>();

  const [editTimelogModalOpen, setEditTimelogModalOpen] = useState(false);
  // Define columns for the table
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "createdAt",
      header: () => <div className="text-bold">Reported Time</div>,
      cell: ({ row }: { row: any }) => (
        <div className="text-medium">
          {row.getValue("createdAt")
            ? new Date(row.getValue("createdAt")).toLocaleTimeString([], {
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
      accessorKey: "name",
      header: () => <div className="text-bold">Work Sheet</div>,
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("name") || "-";
        const displayValue = typeof value === "string" && value.length > 50 ? value.slice(0, 50) + "..." : value;
        return (
          <div className="text-medium flex items-center gap-2">
            {row.original.containsManualActivity && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Keyboard className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This work sheet includes manual log entries</p>
                </TooltipContent>
              </Tooltip>
            )}
            {displayValue}
          </div>
        );
      },
      size: 20,
    },
    {
      accessorKey: "totalActivities",
      header: () => <div className="text-bold">Total Activities</div>,
      cell: ({ row }: { row: any }) => <div className="text-medium">{row.getValue("totalActivities") || "-"}</div>,
      size: 20,
    },
    {
      accessorKey: "totalLoggedTime",
      header: () => <div className="text-bold">Time Spent</div>,
      cell: ({ row }: { row: any }) => {
        const timeSpent = row.getValue("totalLoggedTime");
        if (!timeSpent) return <div className="text-medium">-</div>;
        return (
          <div className="text-medium">
            {timeSpent.hours}h {timeSpent.minutes}m
          </div>
        );
      },
      size: 20,
    },
    {
      accessorKey: "user",
      header: () => <div className="text-bold">Reported By</div>,
      cell: ({ row }: { row: any }) => {
        const userValue = row.original?.user;

        return (
          <div className="text-medium flex items-center space-x-3">
            {userValue?.avatarUrls ? (
              <Image src={userValue.avatarUrls} alt={userValue.displayName} width={40} height={40} className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="truncate">{userValue?.displayName || "-"}</span>
          </div>
        );
      },
      size: 40,
    },
    {
      accessorKey: "action",
      header: () => <div className="text-bold">Action</div>,
      cell: ({ row }: { row: any }) => (
        // <Link href={`/timelog/${row.original.worksheetId}`}>
        <div className="text-medium">
          <Button variant="outline">View</Button>
        </div>
        // </Link>
      ),
      size: 20,
    },
  ];

  const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size) : 0;

  const table = useReactTable({
    data: worksheets,
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

  //   useEffect(() => {
  //     if (onSelectionChange) {
  //       onSelectionChange(selectedIds.length > 0);
  //     }
  //   }, [selectedIds, onSelectionChange]);

  const displayedRowsCount = currentPageState > 1 ? (currentPageState - 1) * pagination.pageSize + worksheets.length : worksheets.length;

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
              <ProjectWorksheetPagination projectId={projectId} currentPage={currentPageState} totalPage={totalPages} onPageChange={onPageChange} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

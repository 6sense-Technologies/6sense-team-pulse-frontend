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

import { Note } from "@phosphor-icons/react";
import { IMemberList } from "@/types/types";
import Tooltips from "@/components/tooltip";
import { TablePagination } from "@/components/tablePagination";
import ManagementToolBadge from "./managementToolBadge";

const MAX_MANAGEMENT_TOOLS_DISPLAY = 4;

const handleDetails = (member: IMemberList): void => {
  localStorage.setItem("memberId", member._id);
  window.location.href = `/member-list/${member._id}?page=1`;
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "projectName",
    // accessorFn: (row: any): string => row.userData.displayName,
    header: () => <div className="text-bold">Project Name</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("projectName") || "-"}</div>
    ),
  },
  // accessorFn: (row: IMemberList): string => row.userData.emailAddress,
  {
    accessorKey: "managementTools",
    header: (): JSX.Element => <div className="text-bold">Management Tool</div>,
    cell: ({ row }: { row: any }): JSX.Element => {
      const managementTools = row.getValue("managementTools") || [];
      const displayedTools = managementTools.slice(
        0,
        MAX_MANAGEMENT_TOOLS_DISPLAY
      );
      const remainingToolsCount =
        managementTools.length - MAX_MANAGEMENT_TOOLS_DISPLAY;

      return (
        <div className="flex items-center space-x-2">
          {displayedTools.map((tool: string, index: number) => (
            <ManagementToolBadge key={index} className="lowercase text-medium">
              {tool}
            </ManagementToolBadge>
          ))}
          {remainingToolsCount > 0 && (
            <ManagementToolBadge className="lowercase text-medium">
              +{remainingToolsCount}
            </ManagementToolBadge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "teamSize",
    // accessorFn: (row: IMemberList): string => row.userData.designation,
    header: () => <div className="text-bold">Team Size</div>,
    cell: ({ row }: { row: any }): JSX.Element => (
      <div className="text-medium">{row.getValue("teamSize") || "-"}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-bold text-right pr-4">ACTIONS</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex items-center justify-end space-x-4 pr-4">
          <Tooltips
            icon={Note}
            tooltipText="Details"
            onClick={() => {
              handleDetails(member);
            }}
          />
        </div>
      );
    },
  },
];

type TProjectTableProps = {
  projects?: any[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
};

export const ProjectTable: React.FC<TProjectTableProps> = ({
  projects = [],
  refetch,
  totalCountAndLimit = { totalCount: 0, size: 10 },
}) => {
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
    pageCount: Math.ceil(totalCountAndLimit.totalCount / pagination.pageSize),
  });

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
    table.setPageIndex(page - 1);
    refetch?.();
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-lightborderColor">
        <Table className="!rounded-lg">
          <TableHeader className="border-b-[1px] text-inputFooterColor">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="py-1 leading-none">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-left h-12 pl-4 leading-none ${
                      header.column.id === "actions" ? "text-right" : ""
                    }`}
                  >
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
                  className="h-12 leading-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-1 leading-none ${
                        cell.column.id === "actions"
                          ? "text-right"
                          : cell.column.id === "teamSize"
                          ? "pl-5 text-start"
                          : cell.column.id === "managementTools"
                          ? "pl-3 text-start"
                          : "pl-4 text-start"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="py-1 leading-none">
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
      <div className="flex items-center justify-between space-x-3 py-4">
        <div className="text-sm text-subHeading pl-2">
          {totalCountAndLimit.totalCount} of {table.getRowModel().rows.length}{" "}
            row(s) showing.
        </div>
        <div className="flex justify-end mb-2">
          <TablePagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

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
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { TablePagination } from "./tablePagination";
import Tooltips from "./tooltip";
import { Note } from "@phosphor-icons/react";

export interface IMember {
  _id: string;
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls: string;
  currentPerformance: number;
  designation: string;
}

export const columns: ColumnDef<IMember>[] = [
  {
    accessorKey: "avatarUrls",
    header: (): JSX.Element => { return <div className="ml-4 text-bold">PHOTO</div>; },
    cell: ({ row }: { row: any }): JSX.Element => {
      const avatarUrl = row.getValue("avatarUrls");
      const displayName = row.getValue("displayName") as string;
      const nameParts = displayName.split(" ");
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0][0];

      return (
        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center ml-5">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#405A4C] flex items-center justify-center text-white">
              {initials}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "displayName",
    header: () => { return <div className="text-bold">NAME</div>; },
    cell: ({ row }: { row: any }) => { return <div className="text-medium">{row.getValue("displayName") || '-'}</div>; },
  },
  {
    accessorKey: "emailAddress",
    header: () => { return <div className="text-bold">EMAIL</div>; },
    cell: ({ row }): JSX.Element => {
      return <div className="lowercase text-medium">{row.getValue("emailAddress") || '-'}</div>;
    },
  },
  {
    accessorKey: "designation",
    header: () => <div className="text-bold">DESIGNATION</div>,
    cell: ({ row }) => <div className="text-medium">{row.getValue("designation") || '-'}</div>,
  },
  {
    accessorKey: "currentPerformance",
    header: () => <div className="text-bold">OVERALL PERFORMANCE</div>,
    cell: ({ row }) => {
      const currentPerformance = row.getValue("currentPerformance") as number | null;
      return <div className="text-medium">{currentPerformance !== null ? `${currentPerformance.toFixed(2)}%` : '-'}</div>;
    },
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
              window.location.href = `/member-list/${member.accountId}?page=1`;
            }}
          />
        </div>
      );
    },
  },
];

interface IProps {
  _id: string;
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls: string;
  currentPerformance: number;
  designation: string;
}

export const MemberTable = ({
  members,
  refetch,
  totalCountAndLimit,
}: {
  members: IProps[];
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

  const table = useReactTable({
    data: members,
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
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-bgSecondary border-b-[1px] border-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="py-1 leading-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`text-left py-1 leading-none ${header.column.id === 'actions' ? 'text-right' : ''}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="py-1 leading-none">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={`py-1 leading-none ${cell.column.id === 'actions' ? 'text-right pr-4' : ''}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-subHeading">
          Showing {table.getRowModel().rows.length} out of {totalCountAndLimit.totalCount} results
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
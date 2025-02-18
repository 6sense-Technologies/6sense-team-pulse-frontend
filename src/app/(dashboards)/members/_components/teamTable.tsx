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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { TeamPagination } from "./teamPagination";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TeamProgress from "./teamProgress";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";

type TeamMember = {
  _id: string;
  performance: number | null;
  displayName: string;
  emailAddress: string;
  designation: string;
  avatarUrls: string;
  role: string;
};

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "displayName",
    header: () => <div className="text-bold">Team Members</div>,
    cell: ({ row }: { row: any }) => {
      const name = row.getValue("displayName");
      const avatarUrl = row.original.avatarUrls;
      const nameParts = name.split(" ");
      let initials =
        nameParts.length === 3
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;

      return (
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-2">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-primary text-white">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-medium">{name || "-"}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="text-bold">Role</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("role") || "-"}</div>
    ),
  },
  {
    accessorKey: "designation",
    header: () => <div className="text-bold">Designation</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("designation") || "-"}</div>
    ),
  },
  {
    accessorKey: "emailAddress",
    header: () => <div className="text-bold">Email</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("emailAddress") || "-"}</div>
    ),
  },
  {
    accessorKey: "performance",
    header: () => <div className="text-bold">Performance</div>,
    cell: ({ row }: { row: any }) => {
      const performance = row.getValue("performance");
      const performanceText =
        performance !== null ? `${performance.toFixed(2)}%` : "-";
      return (
        <div className="flex items-center max-w-[128px] w-full">
          <div className="text-medium mr-2 w-9">{performanceText}</div>
          {performance !== null && (
            <TeamProgress teamPercentage={parseFloat(performance)} />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-bold text-start pr-4">Action</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;
      const [isModalOpen, setIsModalOpen] = useState(false);

      const handleIconClick = () => {
        setIsModalOpen(!isModalOpen);
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          !(event.target as Element).closest(".modal-content")
        ) {
          setIsModalOpen(false);
        }
      };

      useEffect(() => {
        if (isModalOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isModalOpen]);

      return (
        <div className="flex items-center justify-end space-x-4 pr-4 relative">
          <EllipsisVertical
            className="cursor-pointer w-4 h-4"
            onClick={handleIconClick}
          />
          {isModalOpen && (
            <div className="absolute right-0 -top-[73px] mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 modal-content">
              <ul>
                <Link href={`/members/${member._id}/member-details`}>
                  <li className="px-4 py-2 text-start hover:bg-gray-100 cursor-pointer">
                    View Performance
                  </li>
                </Link>
                <li className="px-4 py-2 text-start cursor-not-allowed text-gray-400">
                  Send Feedback
                </li>
                <hr className="mt-1" />
                <li className="px-4 py-2 text-start cursor-not-allowed text-gray-400">
                  Remove
                </li>
              </ul>
            </div>
          )}
        </div>
      );
    },
  },
];

type TTeamTableProps = {
  teamMembers?: TeamMember[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
  currentPage: number;
  loading?: boolean;
};

export const TeamTable: React.FC<TTeamTableProps> = ({
  teamMembers = [],
  refetch,
  totalCountAndLimit = { totalCount: 0, size: 10 },
  currentPage,
  loading,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination] = React.useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  });
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page") || "1");
  const [currentPageState, setCurrentPageState] = useState(page);
  const [isLoading, setIsLoading] = React.useState(false);
  const totalPages = totalCountAndLimit.totalCount
    ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size)
    : 0;

  const table = useReactTable({
    data: teamMembers,
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

  const displayedRowsCount =
    currentPageState > 1
      ? (currentPageState - 1) * pagination.pageSize + teamMembers.length
      : teamMembers.length;

  return (
    <div className="w-full">
      {isLoading ? (
        <EmptyTableSkeleton />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-lightborderColor">
            <Table className="!rounded-lg !min-w-[600px]">
              <TableHeader className="border-b-[1px] text-inputFooterColor">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="py-1 leading-none">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`text-left h-[51px] pl-4 leading-none ${
                          header.column.id === "actions"
                            ? "text-right"
                            : header.column.id === "displayName"
                            ? "min-w-[140px]"
                            : header.column.id === "role"
                            ? "min-w-[110px]"
                            : header.column.id === "designation"
                            ? "min-w-[180px]"
                            : ""
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
                              : cell.column.id === "displayName"
                              ? "text-start font-semibold"
                              : cell.column.id === "emailAddress"
                              ? "text-start pl-4"
                              : cell.column.id === "performance"
                              ? "pl-5 text-start"
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
          <div className="space-x-3 flex flex-col justify-center items-center lg:flex-row lg:items-center lg:justify-between lg:space-x-3 py-4 lg:py-4">
            <div className="text-sm text-subHeading pl-2 md:pb-6">
              {displayedRowsCount} of {totalCountAndLimit.totalCount} row(s)
              showing
            </div>
            <div className="flex items-center md:justify-end mb-4 pt-4 lg:pt-0">
              <TeamPagination
                currentPage={currentPageState}
                totalPage={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
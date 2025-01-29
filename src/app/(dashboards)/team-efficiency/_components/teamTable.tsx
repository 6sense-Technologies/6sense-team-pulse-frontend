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
import { EllipsisVertical } from "lucide-react";
import { TeamPagination } from "./teamPagination";
import EmptyTableSkeleton from "@/components/EmptyTableSkeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TeamProgress from "./teamProgress";
import { Button } from "@/components/ui/button";

type TeamMember = {
  teamMember: {
    name: string;
    avatar: string;
  };
  role: string;
  designation: string;
  email: string;
  performance: string;
};

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "teamMember",
    header: () => <div className="text-bold">Team Members</div>,
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center">
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={row.getValue("teamMember").avatar} alt="Avatar" />
          <AvatarFallback>{row.getValue("teamMember").name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-medium">{row.getValue("teamMember").name || "-"}</div>
      </div>
    ),
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
    accessorKey: "email",
    header: () => <div className="text-bold">Email</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("email") || "-"}</div>
    ),
  },
  {
    accessorKey: "performance",
    header: () => <div className="text-bold">Performance</div>,
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center">
        <div className="text-medium mr-2">{row.getValue("performance") || "-"}</div>
        <TeamProgress teamPercentage={parseFloat(row.getValue("performance"))} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-bold text-right pr-4">Action</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex items-center justify-end space-x-4 pr-4 relative">
          <Button variant="outline">View</Button>
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
  const [pagination, setPagination] = React.useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  });
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page") || "1");
  const [currentPageState, setCurrentPageState] = React.useState(page);
  const [isLoading, setIsLoading] = React.useState(false); // State to manage loading
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
    setIsLoading(true); // Set loading state to true
    setCurrentPageState(page);
    table.setPageIndex(page - 1);
    refetch?.();
  };

  React.useEffect(() => {
    if (!loading) {
      setIsLoading(false); // Set loading state to false when data is loaded
    }
  }, [loading]);

  const displayedRowsCount = currentPageState > 1
    ? (currentPageState - 1) * pagination.pageSize + teamMembers.length
    : teamMembers.length;

  return (
    <div className="w-full">
      {isLoading ? (
        <EmptyTableSkeleton /> // Show skeleton loader when loading
      ) : (
        <>
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
                              ? "pl-5 text-start w-72"
                              : cell.column.id === "tools"
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
              {displayedRowsCount} of {totalCountAndLimit.totalCount} row(s) showing.
            </div>
            <div className="flex justify-end mb-2">
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
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
import { useParams, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Calendar, CheckSquare } from "lucide-react";
import EmptyTableSkeleton from "@/components/EmptyTableSkeleton";
import Link from "next/link";
import { TeamPagination } from "../../../_components/teamPagination";
import { PerformancePagination } from "../[date]/_components/performancePagination";

type PerformanceItem = {
  issueType: string;
  issueSummary: string;
  issueIdUrl: string;
  issueStatus: string;
};

export const columns: ColumnDef<PerformanceItem>[] = [
  {
    accessorKey: "issueType",
    header: () => <div className="text-bold">Category</div>,
    cell: ({ row }: { row: any }) => {
      const category = row.getValue("issueType");
      const icon =
        category === "Task" ? (
          <CheckSquare className="mr-2 w-4 h-4" />
        ) : (
          <Bookmark className="mr-2 w-4 h-4" />
        );
      return (
        <Badge
          variant="rounded"
          className="flex items-center"
        >
          {icon}
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "issueSummary",
    header: () => <div className="text-bold">Work Item</div>,
    cell: ({ row }: { row: any }) => (
      <Link href={row.getValue("issueIdUrl")} target="_blank">
        <div className="text-medium flex items-center w-full max-w-[700px] hover:underline">
          <span>
            <Calendar className="mr-2 w-4 h-4 text-[#0284C7]" />
          </span>
          {row.getValue("issueSummary") || "-"}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "issueIdUrl",
    header: () => <div className="text-bold">Linked ID</div>,
    cell: ({ row }: { row: any }) => (
      <Link href={row.getValue("issueIdUrl")} target="_blank">
        <div className="cursor-pointer hover:underline">
          {row.getValue("issueIdUrl").split("/").pop()}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "issueStatus",
    header: () => <div className="text-bold">Status</div>,
    cell: ({ row }: { row: any }) => (
      <Badge variant="rounded">
        {row.getValue("issueStatus")}
      </Badge>
    ),
  },
];

type TPerformanceTableProps = {
  performanceItems?: PerformanceItem[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
  currentPage: number;
  loading?: boolean;
};

export const PerformanceTable: React.FC<TPerformanceTableProps> = ({
  performanceItems = [],
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
    data: performanceItems,
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

  const displayedRowsCount =
    currentPageState > 1
      ? (currentPageState - 1) * pagination.pageSize + performanceItems.length
      : performanceItems.length;

     const {id:member_id, date} = useParams() as {id: string; date: string};
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
              {displayedRowsCount} of {totalCountAndLimit.totalCount} row(s)
              showing
            </div>
            <div className="flex justify-end mb-2">
              <PerformancePagination
                currentPage={currentPageState}
                totalPage={totalPages}
                onPageChange={onPageChange}
                member_id={member_id}
                date={date}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceTable;

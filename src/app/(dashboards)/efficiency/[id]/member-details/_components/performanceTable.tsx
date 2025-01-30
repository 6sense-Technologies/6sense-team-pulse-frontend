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
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import EmptyTableSkeleton from "@/components/EmptyTableSkeleton";
import Link from "next/link";
import { TeamPagination } from "../../../_components/teamPagination";

type PerformanceItem = {
  category: string;
  workItem: string;
  linkedID: string;
  status: string;
};

export const columns: ColumnDef<PerformanceItem>[] = [
  {
    accessorKey: "category",
    header: () => <div className="text-bold">Category</div>,
    cell: ({ row }: { row: any }) => (
      <Link href={`/category/${row.getValue("category")}`}>
        <Badge variant="outline" className="cursor-pointer flex items-center rounded">
          <Calendar className="mr-2 w-4 h-4" />
          {row.getValue("category")}
        </Badge>
      </Link>
    ),
  },
  {
    accessorKey: "workItem",
    header: () => <div className="text-bold">Work Item</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium flex items-center">
        <CheckCircle className="mr-2 w-4 h-4" />
        {row.getValue("workItem") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "linkedID",
    header: () => <div className="text-bold">Linked ID</div>,
    cell: ({ row }: { row: any }) => (
      <Link href={`/linked/${row.getValue("linkedID")}`}>
        <div className="cursor-pointer">{row.getValue("linkedID")}</div>
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-bold">Status</div>,
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline" className="rounded">{row.getValue("status")}</Badge>
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
              {displayedRowsCount} of {totalCountAndLimit.totalCount} row(s)
              showing.
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

export default PerformanceTable;
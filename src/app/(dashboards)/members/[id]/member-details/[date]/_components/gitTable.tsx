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
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import Link from "next/link";
import { GitPagination } from "./gitPagination";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

type GitItem = {
  branch: string;
  commitHomeUrl: string;
  gitRepo: {
    repo: string;
  };
  totalAdditions: number;
  totalDeletions: number;
  totalChanges: number;
  totalWritten: number;
};

export const columns: ColumnDef<GitItem>[] = [
  {
    accessorKey: "gitRepo.repo",
    header: () => <div className="text-bold">Project</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.original.gitRepo.repo}</div>
    ),
  },
  {
    accessorKey: "branch",
    header: () => <div className="text-bold">Branch</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium flex items-center w-full max-w-[700px] hover:underline">
        <Link href={row.original.commitHomeUrl || "#"} target="_blank">
          <Badge variant="rounded" className="ml-2 flex items-center">
            <div className="flex items-center gap-x-1">
              <span>
                {row.original.branch}
              </span>
              <span>
                <ExternalLink size={12} />
              </span>
            </div>
          </Badge>
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "totalAdditions",
    header: () => <div className="text-bold">Additions</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.original.totalAdditions}</div>
    ),
  },
  {
    accessorKey: "totalDeletions",
    header: () => <div className="text-bold">Deletions</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.original.totalDeletions}</div>
    ),
  },
  {
    accessorKey: "totalChanges",
    header: () => <div className="text-bold">Changes</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.original.totalChanges}</div>
    ),
  },
  {
    accessorKey: "totalWritten",
    header: () => <div className="text-bold">Contributions</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.original.totalWritten}</div>
    ),
  },
];

type TPerformanceTableProps = {
  performanceItems?: GitItem[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
  currentPage: number;
  loading?: boolean;
};

export const GitTable: React.FC<TPerformanceTableProps> = ({
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
  const [pagination] = React.useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  });
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page") || "1");
  const [currentPageState, setCurrentPageState] = React.useState(page);
  const [isLoading, setIsLoading] = React.useState(false);
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
    setIsLoading(true);
    setCurrentPageState(page);
    table.setPageIndex(page - 1);
    refetch?.();
  };

  React.useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const displayedRowsCount =
    currentPageState > 1
      ? (currentPageState - 1) * pagination.pageSize + performanceItems.length
      : performanceItems.length;

  const { id: member_id, date } = useParams() as { id: string; date: string };
  return (
    <div className="w-full">
      {isLoading ? (
        <EmptyTableSkeleton />
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
                        className={`text-left h-12 pl-4 leading-none text-nowrap ${header.column.id === "actions" ? "text-right" : header.column.id === "branch" ? "min-w-[200px]" : ""
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
                          className={`py-1 leading-none ${cell.column.id === "actions"
                              ? "text-right"
                              : cell.column.id === "branch" ? "w-[150px] text-nowrap" : "pl-4 text-start"
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
              <GitPagination
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

export default GitTable;
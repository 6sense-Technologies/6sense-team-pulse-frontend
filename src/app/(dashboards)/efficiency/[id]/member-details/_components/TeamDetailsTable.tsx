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
import EmptyTableSkeleton from "@/components/EmptyTableSkeleton";
import { Button } from "@/components/ui/button";
import { TeamPagination } from "../../../_components/teamPagination";
import Link from "next/link";

type Task = {
  planned: number;
  unplanned: number;
  TCR: number;
};

type Story = {
  No: number;
  USCR: number;
};

type TeamMember = {
  date: string;
  tasks: Task;
  bugs: number;
  stories: Story;
  score: number;
  insight: string;
};

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "date",
    header: () => <div className="text-bold">Date</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("date") || "-"}</div>
    ),
  },
  {
    accessorKey: "tasks",
    header: () => (
      <div className="text-bold pl-4">
        Tasks
        <div className="flex justify-between border-t mt-1 pt-1">
          <span className="py-2">Planned</span>
          <span className="py-2">Unplanned</span>
          <span className="py-2">TCR</span>
        </div>
      </div>
    ),
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-between">
        <span>{row.getValue("tasks").planned}</span>
        <span>{row.getValue("tasks").unplanned}</span>
        <span>{row.getValue("tasks").TCR}</span>
      </div>
    ),
  },
  {
    accessorKey: "bugs",
    header: () => <div className="text-bold">Bugs</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("bugs") || "-"}</div>
    ),
  },
  {
    accessorKey: "stories",
    header: () => (
      <div className="text-bold">
        Stories
        <div className="flex justify-between border-t mt-1 pt-1">
          <span className="py-2">No</span>
          <span className="py-2">USCR</span>
        </div>
      </div>
    ),
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-between">
        <span>{row.getValue("stories").No}</span>
        <span>{row.getValue("stories").USCR}</span>
      </div>
    ),
  },
  {
    accessorKey: "score",
    header: () => <div className="text-bold">Score</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("score") || "-"}</div>
    ),
  },
  {
    accessorKey: "insight",
    header: () => <div className="text-bold">Insight</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("insight") || "-"}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-bold text-right pr-4">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = React.useState(false);

      const handleIconClick = () => {
        setIsModalOpen(!isModalOpen);
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          !event.target.closest(".modal-content")
        ) {
          setIsModalOpen(false);
        }
      };

      React.useEffect(() => {
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
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 modal-content">
              <ul>
                <li className="px-4 py-2 text-start hover:bg-gray-100 cursor-pointer">
                  <Link href={`/efficiency/12/member-details/${row.original.date}`}>
                    View
                  </Link>
                </li>
                <li className="px-4 py-2 text-start hover:bg-gray-100 cursor-pointer">
                  Add Comment
                </li>
                <li className="px-4 py-2 text-start hover:bg-gray-100 cursor-pointer">
                  Report Bug
                </li>
                <li className="px-4 py-2 text-start hover:bg-gray-100 cursor-pointer">
                  Project
                </li>
                <hr className="my-1" />
                <li className="px-4 py-2 text-start hover:bg-gray-100 cursor-pointer text-red-600">
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

type TTeamDetailsTableProps = {
  teamMembers?: TeamMember[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
  currentPage: number;
  loading?: boolean;
};

export const TeamDetailsTable: React.FC<TTeamDetailsTableProps> = ({
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
      ? (currentPageState - 1) * pagination.pageSize + teamMembers.length
      : teamMembers.length;

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
                        className={`text-left h-[80px] pl-4 leading-none ${
                          header.column.id === "actions"
                            ? "text-right pb-9"
                            : header.column.id === "bugs"
                            ? "pb-8 w-20 text-center"
                            : header.column.id === "date"
                            ? "w-[100px]"
                            : "pt-2"
                        } ${
                          ["date", "score", "insight"].includes(
                            header.column.id
                          )
                            ? "pb-8"
                            : "pt-2"
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
                              : cell.column.id === "bugs"
                              ? "pl-7 text-start w-20"
                              : cell.column.id === "date"
                              ? "pl-3 text-start"
                              : cell.column.id === "score"
                              ? "text-right"
                              : cell.column.id === "insight"
                              ? "text-start"
                              : cell.column.id === "tasks"
                              ? "text-start pl-4"
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

export default TeamDetailsTable;
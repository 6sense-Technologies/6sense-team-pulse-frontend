"use client";

import React, { useEffect } from "react";
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
import { EllipsisVertical } from "lucide-react";
import EmptyTableSkeleton from "@/components/EmptyTableSkeleton";
import { Button } from "@/components/ui/button";
import { TeamPagination } from "../../../_components/teamPagination";
import Link from "next/link";
import { TeamDetailsPagination } from "./teamDetailsPagination";

type TeamMember = {
  _id: string;
  doneTaskCountPlanned: number;
  totalTaskPlanned: number;
  notDoneTaskCountPlanned: number;
  totalTaskUnPlanned: number;
  taskCompletionRate: number;
  doneBugCount: number;
  totalBugCount: number;
  doneStoryCount: number;
  totalStoryCount: number;
  storyCompletionRate: number;
  score: number;
  insight: string;
  doneTaskCountUnplanned: number;
  codeToBugRatio: number;
};

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "_id",
    header: () => <div className="text-bold">Date</div>,
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.getValue("_id"));
      const formattedDate = date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
      return <div className="text-medium">{formattedDate || "-"}</div>;
    },
  },
  {
    id: "tasks",
    header: () => (
      <div className="text-bold pl-4">
        Tasks
        <div className="flex justify-between border-t mt-1 pt-1 gap-x-[14px]">
          <span className="py-2">Planned</span>
          <span className="py-2">Unplanned</span>
          <span className="py-2">TCR</span>
        </div>
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      const planned = row.original.doneTaskCountPlanned;
      const totalPlanned = row.original.totalTaskPlanned;
      const unplanned = row.original.doneTaskCountUnplanned;
      const totalUnplanned = row.original.totalTaskUnPlanned;
      const tcr = row.original.taskCompletionRate;

      return (
        <div className="flex justify-between">
          <span>
            {planned}/{totalPlanned}
          </span>
          <span>
            {unplanned}/{totalUnplanned}
          </span>
          <span>
            {tcr !== null && tcr !== undefined ? `${tcr.toFixed(2)}%` : "-"}
          </span>
        </div>
      );
    },
  },
  {
    id: "bugs",
    header: () => <div className="text-bold">Bugs</div>,
    cell: ({ row }: { row: any }) => {
      const doneBugCount = row.original.doneBugCount;
      const totalBugCount = row.original.totalBugCount;
      return (
        <div className="text-medium">
          {doneBugCount}/{totalBugCount}
        </div>
      );
    },
  },
  {
    id: "stories",
    header: () => (
      <div className="text-bold">
        Stories
        <div className="flex justify-between border-t mt-1 pt-1 gap-x-[40px]">
          <span className="py-2">No</span>
          <span className="py-2">USCR</span>
        </div>
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      const doneStoryCount = row.original.doneStoryCount;
      const totalStoryCount = row.original.totalStoryCount;
      const uscr = row.original.storyCompletionRate;

      return (
        <div className="flex justify-between">
          <span>
            {doneStoryCount}/{totalStoryCount}
          </span>
          <span>
            {uscr !== null && uscr !== undefined ? `${uscr.toFixed(2)}%` : "-"}
          </span>
        </div>
      );
    },
  },
  {
    id: "ctbr",
    header: () => <div className="text-bold">CTBR</div>,
    cell: ({ row }: { row: any }) => {
      const ctbr = row.original.codeToBugRatio;
      return (
        <div className="text-medium">
          {ctbr !== null && ctbr !== undefined ? ctbr.toFixed(2) : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: () => <div className="text-bold">Score</div>,
    cell: ({ row }: { row: any }) => {
      const score = row.getValue("score");
      const formattedScore =
        score !== null && score !== undefined
          ? `${Math.ceil(score).toFixed(2)}%`
          : "-";
      return <div className="text-medium">{formattedScore}</div>;
    },
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

      const {id} = useParams();

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
                  <Link
                    href={`/efficiency/${id}/member-details/${
                      new Date(row.original._id).toISOString().split("T")[0]
                    }`}
                  >
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
  Memberid: string;
};

export const TeamDetailsTable: React.FC<TTeamDetailsTableProps> = ({
  teamMembers = [],
  refetch,
  totalCountAndLimit = { totalCount: 0, size: 10 },
  currentPage,
  loading,
  Memberid,
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
                            : header.column.id === "_id"
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
                  table.getRowModel().rows.map((row) => {
                    const isHoliday = row.original.insight
                      .toLowerCase()
                      .includes("holidays/leave");
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={`leading-none ${isHoliday ? "h-6" : "h-12"}`}
                      >
                        {row.getVisibleCells().map((cell: any) => (
                          <TableCell
                            key={cell.id}
                            className={`leading-none ${
                              isHoliday ? "py-0" : "py-1"
                            } ${
                              cell.column.id === "actions" && isHoliday
                                ? "hidden"
                                : cell.column.id === "actions"
                                ? "text-right"
                                : cell.column.id === "bugs"
                                ? "pl-7 text-start w-20"
                                : cell.column.id === "_id" && isHoliday
                                ? "pl-4 text-start"
                                : cell.column.id === "score"
                                ? "text-right"
                                : cell.column.id === "insight"
                                ? "text-start"
                                : cell.column.id === "tasks"
                                ? "text-start pl-4"
                                : cell.column.id === "ctbr" && isHoliday
                                ? "text-center text-red-600"
                                : "pl-4 text-start"
                            }`}
                          >
                            {isHoliday &&
                            cell.column.id !== "_id" &&
                            cell.column.id !== "ctbr"
                              ? null
                              : isHoliday && cell.column.id === "ctbr"
                              ? "Holiday"
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
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
              <TeamDetailsPagination
                currentPage={currentPageState}
                totalPage={totalPages}
                onPageChange={onPageChange}
                Memberid={Memberid}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamDetailsTable;

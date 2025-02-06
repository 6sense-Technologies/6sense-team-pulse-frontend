/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
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
import ManagementToolBadge from "./managementToolBadge";
import { EllipsisVertical } from "lucide-react";
import { Projects } from "@/types/Project.types";
import { ProjectPagination } from "./projectPagination";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import CustomMenu from "@/components/customMenu"; // Import the menu component
import ProjectCustomMenuItems from "./projectCustomMenuItems";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MAX_MANAGEMENT_TOOLS_DISPLAY = 4;

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-bold">Project Name</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("name") || "-"}</div>
    ),
  },
  {
    accessorKey: "tools",
    header: (): JSX.Element => <div className="text-bold">Management Tool</div>,
    cell: ({ row }: { row: any }): JSX.Element => {
      const tools = row.getValue("tools") || [];
      const displayedTools = tools.slice(0, MAX_MANAGEMENT_TOOLS_DISPLAY);
      const remainingTools = tools.slice(MAX_MANAGEMENT_TOOLS_DISPLAY);
      const remainingToolsCount = remainingTools.length;

      return (
        <div className="flex items-center space-x-2">
          {displayedTools.map((tool: any, index: number) => (
            <ManagementToolBadge key={index} className="text-medium">
              {tool.toolName}
            </ManagementToolBadge>
          ))}
          {remainingToolsCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ManagementToolBadge className="text-medium cursor-pointer">
                    +{remainingToolsCount}
                  </ManagementToolBadge>
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-white w-full max-w-[100px] lg:max-w-[200px]">
                  <p>{remainingTools.map((tool: any) => tool.toolName).join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "teamSize",
    header: () => <div className="text-bold">Team Size</div>,
    cell: ({ row }: { row: any }): JSX.Element => (
      <div className="text-medium">{row.getValue("teamSize") || "-"}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-bold text-right pr-4">ACTIONS</div>,
    enableHiding: false,
    cell: () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const ellipsisRef = React.useRef<HTMLDivElement>(null);

      const handleOpenMenu = () => {
        setIsMenuOpen(true);
      };

      const handleCloseMenu = () => {
        setIsMenuOpen(false);
      };

      return (
        <div className="flex items-center justify-end space-x-4 pr-4 relative">
          <div ref={ellipsisRef}>
            <EllipsisVertical className="cursor-pointer w-4 h-4" onClick={handleOpenMenu} />
          </div>
          <CustomMenu isOpen={isMenuOpen} onClose={handleCloseMenu} anchorRef={ellipsisRef}>
            <ProjectCustomMenuItems 
            firstText="View"
            secondText="Edit"
            ThirdText="Delete"
            />
          </CustomMenu>
        </div>
      );
    },
  },
];

type TProjectTableProps = {
  projects?: Projects[];
  refetch?: () => void;
  totalCountAndLimit?: { totalCount: number; size: number };
  currentPage: number;
  loading?: boolean;
};

export const ProjectTable: React.FC<TProjectTableProps> = ({
  projects = [],
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
  const [isLoading, setIsLoading] = React.useState(false); // State to manage loading
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

  const displayedRowsCount = currentPageState > 1
    ? (currentPageState - 1) * pagination.pageSize + projects.length
    : projects.length;

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
                        className={`text-left h-12 pl-4 leading-none ${
                          header.column.id === "actions" ? "text-right" : header.column.id === "tools" ? "min-w-[140px]" : header.column.id === "name" ? "min-w-[140px]" : ""
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
          <div className="flex flex-col justify-center items-center lg:flex-row lg:items-center lg:justify-between lg:space-x-3 py-4 lg:py-4">
            <div className="text-sm text-subHeading pl-2">
              {displayedRowsCount} of {totalCountAndLimit.totalCount} row(s) showing
            </div>
            <div className="flex justify-end mb-2 pt-4 lg:pt-0">
              <ProjectPagination
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
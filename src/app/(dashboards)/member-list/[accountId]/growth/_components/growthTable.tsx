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
import { GrowthTablePagination } from "./growthTablePagination";
import { IGrowthItems } from "@/types/types";
import { GrowthDrawer } from "./growthDrawer";
import { Badge } from "@/components/ui/badge";
import GrowthTooltip from "./growthTooltip";
import { Note, Trash } from "@phosphor-icons/react";
import axios, { AxiosResponse } from "axios";
import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import { Button } from "@/components/ButtonComponent";


const handleDelete = async (id: string): Promise<void> => {
    await axios.delete(`${TEMP_BACKEND_URI}/goals/${id}`);
    window.location.reload();
};


export const columns: ColumnDef<IGrowthItems>[] = [

  {
    accessorKey: "goalItem",
    header: () => <div className="text-bold">ITEMS</div>,
    cell: ({ row }) => (
      <div className="text-medium">{row.getValue("goalItem") || "-"}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-bold">STATUS</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      let variant: "todo" | "in-progress" | "completed" = "todo";
      if (status === "In Progress") variant = "in-progress";
      else if (status === "Completed") variant = "completed";
      return <Badge variant={variant}>{String(status) || "-"}</Badge>;
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <div className="text-bold text-right">ACTIONS</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const growthItem = row.original;
      const id = localStorage.getItem("memberId");
      
      return (
        <div className="flex items-center justify-end space-x-4">
          <GrowthTooltip
            icon={Note}
            tooltipText="Details"
            onClick={() => {
              window.location.href = `/member-list/${id}/growth/details?page=1&goalId=${growthItem._id}`;
            }}
          />
          <GrowthTooltip
            icon={Trash}
            tooltipText="Delete"
            color="red"
            onClick={() => {
              handleDelete(growthItem?._id);
            }}
          />
        </div>
      );
    },
    size: 150,
  },
];

export const GrowthTable = ({
  growthItems,
  refetch,
  totalCountAndLimit,
}: {
  growthItems: IGrowthItems[];
  totalCountAndLimit: { totalCount: number; size: number };
  refetch: () => void;
}): JSX.Element => {
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
    ? Math.ceil(totalCountAndLimit.totalCount / pagination.pageSize)
    : 0;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerToggle = (): void => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const table = useReactTable({
    data: growthItems || [],
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
    setCurrentPage(page);
    setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
    refetch();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4">
        <Button prefixIcon="PlusCircle" onClick={handleDrawerToggle}>
          Add Growth
        </Button>
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-bgSecondary border-b-[1px] border-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="py-1 leading-none">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-left py-1 leading-none ${
                      header.column.id === "actions" ? "text-right pr-4" : ""
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
            {table
              .getRowModel()
              .rows?.slice(0, pagination.pageSize)
              .map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="py-1 leading-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-1 leading-none ${
                        cell.column.id === "actions" ? "text-right pr-4" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!table.getRowModel().rows?.length && (
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-subHeading">
          Showing{" "}
          {table.getRowModel().rows.slice(0, pagination.pageSize).length} out of{" "}
          {totalCountAndLimit.totalCount} results
        </div>
        <div className="flex justify-end mb-2">
          <GrowthTablePagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      <GrowthDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerToggle}
        refetch={refetch}
      />
    </div>
  );
};

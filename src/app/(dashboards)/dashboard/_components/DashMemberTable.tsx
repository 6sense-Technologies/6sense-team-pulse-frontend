/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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

type MemberData = {
  avatar: string;
  name: string;
  responsibility: string;
  performance: string;
};

type DashMemberTableProps = {
  data: MemberData[];
};

const columns: ColumnDef<MemberData>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-normal">Team Members</div>, // Changed to normal font weight
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center space-x-3">
        <img
          src={row.original.avatar}
          alt={row.getValue("name")}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "responsibility",
    header: () => <div className="font-normal">Responsibility</div>, // Changed to normal font weight
    cell: ({ row }: { row: any }) => (
      <div className="dont-medium">{row.getValue("responsibility")}</div>
    ),
  },
  {
    accessorKey: "performance",
    header: () => <div className="font-normal">Performance</div>, // Changed to normal font weight
    cell: ({ row }: { row: any }) => (
      <div className="font-medium">{row.getValue("performance")}</div>
    ),
  },
];

export const DashMemberTable: React.FC<DashMemberTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-lightborderColor">
        <Table className="!rounded-lg !min-w-[600px]">
          <TableHeader className="border-b-[1px] text-inputFooterColor">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="py-2 leading-none"> {/* Increased row height */}
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-left h-12 pl-4 leading-none"
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
                  className="h-14 leading-none" // Increased row height
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 leading-none pl-4 text-start" // Adjusted padding for better spacing
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
              <TableRow className="py-2 leading-none">
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
    </div>
  );
};

export default DashMemberTable;
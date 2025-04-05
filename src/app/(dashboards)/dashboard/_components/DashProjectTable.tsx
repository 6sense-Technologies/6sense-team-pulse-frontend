/* eslint-disable @next/next/no-img-element */
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DashProgress from "./DashProgress";

type ProjectData = {
  logo: string;
  projectName: string;
  teamAvatars: string[];
  progress: number;
  dueDate: string;
};

type DashProjectTableProps = {
  data: ProjectData[];
};

const columns: ColumnDef<ProjectData>[] = [
  {
    accessorKey: "projectName",
    header: () => <div className="font-normal w-[150px]">Project</div>, // Fixed width
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center space-x-3">
        <img
          src={row.original.logo}
          alt={row.getValue("projectName")}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-medium">{row.getValue("projectName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "teamAvatars",
    header: () => <div className="font-normal w-[120px]">Team</div>, // Fixed width
    cell: ({ row }: { row: any }) => (
      <div className="flex -space-x-2">
        {row.original.teamAvatars.map((avatar: string, index: number) => (
          <Avatar key={index} className="w-8 h-8 border-2 border-white">
            <AvatarImage src={avatar} alt={`Team Member ${index + 1}`} />
            <AvatarFallback>TM</AvatarFallback>
          </Avatar>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: () => <div className="font-normal w-[180px]">Progress</div>, // Fixed width
    cell: ({ row }: { row: any }) => {
      const progress = row.getValue("progress");
      return (
        <div className="flex items-center space-x-2">
          <span className="text-medium">{progress}%</span>
          <DashProgress teamPercentage={progress} />
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: () => <div className="font-normal w-[120px]">Due Date</div>, // Fixed width
    cell: ({ row }: { row: any }) => (
      <div className="text-medium">{row.getValue("dueDate")}</div>
    ),
  },
];

export const DashProjectTable: React.FC<DashProjectTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-lightborderColor">
        <Table className="!rounded-lg !min-w-[600px] table-fixed"> {/* Added table-fixed */}
          <TableHeader className="border-b-[1px] text-inputFooterColor">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="py-2 leading-none">
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
                  className="h-14 leading-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 leading-none pl-4 text-start"
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

export default DashProjectTable;
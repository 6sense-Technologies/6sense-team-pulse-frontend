"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback } from "react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./select";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
}

export function CustomPagination({ pageSizeSelectOptions, pageSize, totalCount, page, pageSearchParam }: PaginationWithLinksProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      if (!searchParams) return `${pathname}?${key}=${newPage}`;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, String(newPage));
      return `${pathname}?${newSearchParams.toString()}`;
    },
    [searchParams, pathname],
  );

  // const navToPageSize = useCallback(
  //   (newPageSize: number) => {
  //     const key = pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
  //     const newSearchParams = new URLSearchParams(searchParams || undefined);
  //     newSearchParams.set(key, String(newPageSize));
  //     newSearchParams.delete(pageSearchParam || "page"); // Clear the page number when changing page size
  //     router.push(`${pathname}?${newSearchParams.toString()}`);
  //   },
  //   [searchParams, pathname]
  // );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={buildLink(i)} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href={buildLink(1)} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={buildLink(i)} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink href={buildLink(totalPageCount)} isActive={page === totalPageCount}>
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full justify-between my-4">
      {/* {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )} */}
      <div>
        <p className="text-sm font-semibold text-gray-500">
          {Math.min(page * pageSize, totalCount)} of {totalCount} row(s) showing
        </p>
      </div>
      <div>
        <Pagination>
          <PaginationContent className="max-sm:gap-0">
            <PaginationItem>
              <PaginationPrevious
                href={buildLink(Math.max(page - 1, 1))}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : undefined}
                className={page === 1 ? "opacity-50 cursor-not-allowed" : undefined}
              />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext
                href={buildLink(Math.min(page + 1, totalPageCount))}
                aria-disabled={page === totalPageCount}
                tabIndex={page === totalPageCount ? -1 : undefined}
                className={page === totalPageCount ? "opacity-50 cursor-not-allowed" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

// function SelectRowsPerPage({
//   options,
//   setPageSize,
//   pageSize,
// }: {
//   options: number[];
//   setPageSize: (newSize: number) => void;
//   pageSize: number;
// }) {
//   return (
//     <div className="flex items-center gap-4">
//       <span className="whitespace-nowrap text-sm">Rows per page</span>

//       {/* <Select
//         value={String(pageSize)}
//         onValueChange={(value) => setPageSize(Number(value))}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select page size">
//             {String(pageSize)}
//           </SelectValue>
//         </SelectTrigger>
//         <SelectContent>
//           {options.map((option) => (
//             <SelectItem key={option} value={String(option)}>
//               {option}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select> */}
//     </div>
//   );
// }

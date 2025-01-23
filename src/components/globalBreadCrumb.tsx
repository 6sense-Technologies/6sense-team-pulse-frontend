import React, { FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "./ui/sidebar";

type GlobalBreadCrumbProps = {
  initialData?: string;
  secondayData?: string;
  thirdData?: string;
  initalLink?: string;
  secondayLink?: string;
  thirdLink?: string;
};

const GlobalBreadCrumb: FC<GlobalBreadCrumbProps> = ({
  initalLink,
  initialData,
  secondayData,
  secondayLink,
  thirdData,
  thirdLink,
}) => {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center">
        {/* <SidebarTrigger className="-ml-5" /> */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href={initalLink}
                className={secondayData || thirdData ? "text-subHeading text-sm" : "!text-primary text-sm"}
              >
                {initialData}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {secondayData ? (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={secondayLink}
                    className={thirdData ? "text-subHeading text-sm" : "!text-primary text-sm"}
                  >
                    {secondayData}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            {thirdData ? (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={thirdLink} className="!text-primary text-sm">
                    {thirdData}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default GlobalBreadCrumb;
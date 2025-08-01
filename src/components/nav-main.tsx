"use client";

import { type LucideIcon } from "lucide-react";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
  selectedItem,
  onItemClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  selectedItem: string | null;
  onItemClick: (title: string) => void;
}) {
  const activeItems = ["Dashboard", "Projects", "Feedback", "Team", "Time Log"];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebarSecondaryColor">Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={activeItems.includes(item.title) ? item.url : "#"}>
              <SidebarMenuButton
                className={cn("hover:bg-primary hover:text-white", {
                  "bg-primary text-white": selectedItem === item.title,
                  "hover:bg-sidebarHoverBg hover:text-black": selectedItem !== item.title,
                  "cursor-not-allowed text-gray-400": !activeItems.includes(item.title),
                })}
                tooltip={item.title}
                onClick={() => activeItems.includes(item.title) && onItemClick(item.title)}
              >
                {item.icon && (
                  <item.icon
                    className={cn("h-6 w-6", {
                      "text-white": selectedItem === item.title,
                      "text-navbartextColor": selectedItem !== item.title,
                      "text-gray-400": !activeItems.includes(item.title),
                    })}
                    strokeWidth={2}
                  />
                )}
                <span
                  className={cn("text-sm", {
                    "text-white": selectedItem === item.title,
                    "text-navbartextColor": selectedItem !== item.title,
                    "text-gray-400": !activeItems.includes(item.title),
                  })}
                >
                  {item.title}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { changeOrganization, GetOrganizationList } from "../../helpers/organization/organizationApi";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ButtonComponent";

export type TOrganizationList = TOrganization[];

export interface TOrganization {
  lastAccessed: string;
  _id: string;
  organizationName: string;
  domain: string;
  connected: boolean;
}

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const { data: sessionData, update } = useSession();
  console.log("🚀 ~ sessionData:", sessionData);
  const router = useRouter();

  // Data fetching
  const { data: organizationList, isFetching: organizationListLoading } = useQuery<TOrganizationList>({
    queryKey: ["fetchOrganizations"],
    queryFn: () => GetOrganizationList({ data: sessionData }),
    enabled: !!sessionData?.accessToken, // Ensure session is available
  });

  // Fix the mutation
  const organizationChangeMutation = useMutation({
    mutationFn: (organizationId: string) => changeOrganization(organizationId, { data: sessionData }),
    onSuccess: async (data) => {
      try {
        console.log("🚀 ~ onSuccess: ~ data:", data);
        await update();
        console.log("🚀 ~ onSuccess: ~ sessionData:", sessionData);

        toast({
          title: "Organization Changed",
          description: "Your organization has been changed successfully.",
        });

        // Use router.refresh() instead of window.location.reload()
        // router.refresh();

        // Or if you really need a full reload:
        // window.location.reload();
      } catch (error) {
        console.error("Failed to update session:", error);
        toast({
          title: "Error",
          description: "Failed to update session with new organization",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleOrganizationChange = (orgId: string) => {
    // setOrganizationId(orgId);
    organizationChangeMutation.mutate(orgId);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-sm font-semibold">Recents</DropdownMenuLabel>
            {/* <button onClick={async () => await data.update({ role: "alu" })}>check</button> */}
            {organizationList && (
              <>
                {organizationList?.map((org) => (
                  <DropdownMenuItem key={org._id}>
                    <div className="cursor-pointer flex items-center">
                      <span className="" onClick={() => handleOrganizationChange(org._id)}>
                        {org?.domain}
                      </span>
                      {org.connected ? <Check className="h-4 w-4 ml-2" /> : null}
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

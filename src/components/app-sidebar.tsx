"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { NavMain } from "@/components/nav-main"

import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { Users } from "@phosphor-icons/react"

// This is sample data.
const defaultData = {
  user: {
    name: 'Khan Atik Faisal',
    email: 'Khanatik1176@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Members",
      url: "#",
      icon: Users,
      isActive: true,
        items: [
            { title: "Dashboard", url: "/dashboard" },
            {title: "Projects", url: "/projects"},
          {title:"Team" , url:"/efficiency"}  ],
    },
]


}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();

  console.log("🚀 ~ file: app-sidebar.tsx ~ line 70 ~ AppSidebar ~ session", session)

  const userData = {
    name: session?.data?.user?.name || defaultData.user.name,
    email: session?.data?.user?.email || defaultData.user.email,
    avatar: defaultData.user.avatar,
  };

  const data = {
    ...defaultData,
    user: userData,
  };
  return (
<Sidebar collapsible='icon' {...props} className="bg-[#FAFBFC]">
<SidebarHeader className="bg-[#FAFBFC]">
  <TeamSwitcher teams={data.teams} />
</SidebarHeader>
<SidebarContent className="bg-[#FAFBFC]">
  <NavMain items={data.navMain} />
</SidebarContent>
<SidebarFooter>
  <NavUser user={data.user} />
</SidebarFooter>
<SidebarRail />
</Sidebar>
  )
}

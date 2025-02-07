'use client';

import {
  Bot,
  Boxes,
  Ellipsis,
  Frame,
  GalleryVerticalEnd,
  KeyRound,
  MessageSquareWarning,
  SquareTerminal,
  Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';

import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { NavAdmin } from './nav-admin';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const defaultData = {
  user: {
    name: 'Khan Atik Faisal',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Ops4Team',
      logo: GalleryVerticalEnd,
      plan: 'Admin',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: Bot,
    },
    {
      title: 'Team',
      url: '/team',
      icon: Users,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: MessageSquareWarning,
      items: [
        {
          title: 'Peers',
          url: '#',
        },
        {
          title: 'Clients',
          url: '#',
        },
      ],
    },
  ],
  navAdmin: [
    {
      title: 'Organizations',
      url: '/',
      icon: Frame,
      isActive: true,
    },
    {
      title: 'Members',
      url: '/',
      icon: Users,
    },
    {
      title: 'Access Control',
      url: '#',
      icon: KeyRound,
      items: [
        {
          title: 'Roles',
          url: '#',
        },
        {
          title: 'Permissions',
          url: '#',
        },
      ],
    },
    {
      title: 'Integrations',
      url: '#',
      icon: Boxes,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Ellipsis,
    },
  ],
};

const isScreenBelowMd = () => {
  return window.matchMedia('(max-width: 768px)').matches;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const savedSelectedItem = localStorage.getItem('selectedItem');
    if (savedSelectedItem) {
      setSelectedItem(savedSelectedItem);
    } else {
      setSelectedItem('Dashboard');
    }
  }, []);

  useEffect(() => {
    const matchedItem = defaultData.navMain.find(item => pathname.startsWith(item.url));
    if (matchedItem) {
      setSelectedItem(matchedItem.title);
    }
  }, [pathname]);

  const handleItemClick = (title: string) => {
    setSelectedItem(title);
    localStorage.setItem('selectedItem', title);
    if (isScreenBelowMd()) {
      toggleSidebar();
    }
  };

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
    <Sidebar side='left' variant='sidebar' collapsible='icon' {...props} className='border-none'>
      <SidebarHeader className='bg-[#F1F5F9]'>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className='bg-[#F1F5F9]'>
        <NavMain items={data.navMain} selectedItem={selectedItem} onItemClick={handleItemClick} />
        <NavAdmin items={data.navAdmin} selectedItem={selectedItem} onItemClick={handleItemClick} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
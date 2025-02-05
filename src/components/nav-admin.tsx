'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from '@/components/ui/sidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NavAdmin({
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

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='text-sidebarSecondaryColor'>Admin Area</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url}>
              <SidebarMenuButton
                className={cn(
                  'hover:bg-primary hover:text-white',
                  {
                    'bg-primary text-white': selectedItem === item.title,
                    'hover:bg-sidebarHoverBg hover:text-black': selectedItem !== item.title,
                  }
                )}
                tooltip={item.title}
                onClick={() => onItemClick(item.title)}
              >
                {item.icon && (
                  <item.icon
                    className={cn('w-6 h-6', {
                      'text-white': selectedItem === item.title,
                      'text-navbartextColor': selectedItem !== item.title,
                    })}
                    strokeWidth={2}
                  />
                )}
                <span
                  className={cn('text-sm', {
                    'text-white': selectedItem === item.title,
                    'text-navbartextColor': selectedItem !== item.title,
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
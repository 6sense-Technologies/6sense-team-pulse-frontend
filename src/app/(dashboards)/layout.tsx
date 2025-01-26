import Providers from "@/app/utils/react-query/providers/provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/sidebar";

const Inter = localFont({
  src: "../fonts/Inter-VariableFont_opsz,wght.ttf",
});

export const metadata: Metadata = {
  title: "6sense Efficiency",
  description: "Performance Automation for 6sense Team",
  icons: {
    icon: "/favicon/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${Inter.className} antialiased`}>
        <SessionProvider>
          <Sidebar children={children} />
        </SessionProvider>
      </body>
    </html>
  );
}

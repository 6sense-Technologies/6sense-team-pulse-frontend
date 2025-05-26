import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "6sense Efficiency",
  description: "Performance Automation for 6sense Team",
  icons: {
    icon: "/favicon/favicon.webp",
  },
};

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default AuthLayout;

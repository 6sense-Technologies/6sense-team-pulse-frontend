"use client";
import PageTitle from "@/components/PageTitle";
import { signOut, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ButtonComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AvatarMenu from "@/components/AvatarMenu";
import PageHeading from "@/components/pageHeading";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";

const Dashboard = () => {
  const session = useSession();

  // console.log("Session Data", session.data);

  return (
    <div>
      <PageTitle
        title="Dashboard • Ops4 Team"
      />
      <div className="flex justify-between items-center md:hidden px-2 py-2">
      <span className="md:hidden"><SidebarTrigger /></span>
        <AvatarMenu />
      </div>
      <div className="flex justify-between items-center pl-2 px-2 py-2">
        <GlobalBreadCrumb
          initialData="Dashboard"
          initalLink="/dashboard"
        />
        <span className="hidden md:flex pr-2">
          <AvatarMenu />
          </span>
        </div>
      <div className="pl-2">
      <PageHeading title="Dashboard" className="pl-2 pt-3" />
      </div>
    </div>
  );
};

export default Dashboard;

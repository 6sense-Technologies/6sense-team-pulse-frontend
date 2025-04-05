"use client";
import PageTitle from "@/components/PageTitle";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AvatarMenu from "@/components/AvatarMenu";
import PageHeading from "@/components/pageHeading";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import DashCards from "./_components/DashCards";
import DashChartArea from "./_components/DashChartArea";
import DashMemberArea from "./_components/DashMemberArea";
import DashProjectTable from "./_components/DashProjectTable";

const Dashboard = () => {
  const cardData = [
    {
      title: "Average Performance Score",
      value: "88.08%",
      description: "+12% from yesterday",
    },
    {
      title: "Issues Resolved Today",
      value: 654,
      description: "Based on latest data",
    },
    {
      title: "Average Deployment Frequency",
      value: 48,
      description: "+15% from last month",
    },
    {
      title: "Active Sprints",
      value: 4,
      description: "Number of ongoing sprints",
    },
  ];

  const ProjectData = [
    {
      logo: "https://dummyimage.com/100x100/1F2937/ffffff&text=COS",
      projectName: "ChargeOnSite",
      teamAvatars: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/men/4.jpg",
      ],
      progress: 80,
      dueDate: "10 Feb - 20 Feb",
    },
    {
      logo: "https://dummyimage.com/100x100/3B82F6/ffffff&text=SH", 
      projectName: "SkyHaus",
      teamAvatars: [
        "https://randomuser.me/api/portraits/women/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/women/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
      ],
      progress: 65,
      dueDate: "15 Feb - 22 Feb",
    },
    {
      logo: "https://dummyimage.com/100x100/10B981/ffffff&text=O4T", 
      projectName: "Ops4Team",
      teamAvatars: [
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/men/6.jpg",
        "https://randomuser.me/api/portraits/men/7.jpg",
        "https://randomuser.me/api/portraits/men/8.jpg",
      ],
      progress: 90,
      dueDate: "25 Feb - 10 Mar",
    },
    {
      logo: "https://dummyimage.com/100x100/F59E0B/ffffff&text=HX", 
      projectName: "HireX",
      teamAvatars: [
        "https://randomuser.me/api/portraits/women/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
        "https://randomuser.me/api/portraits/women/7.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
      ],
      progress: 75,
      dueDate: "01 Mar - 15 Mar",
    },
  ];

  return (
    <div >
      <PageTitle title="Dashboard • Ops4 Team" />
      <div className="flex justify-between items-center md:hidden px-2 py-2">
        <span className="md:hidden">
          <SidebarTrigger />
        </span>
        <AvatarMenu />
      </div>
      <div className="flex justify-between items-center pl-2 px-2 py-2">
        <GlobalBreadCrumb initialData="Dashboard" initalLink="/dashboard" />
        <span className="hidden md:flex pr-2">
          <AvatarMenu />
        </span>
      </div>
      <div className="pl-2">
        <PageHeading title="Dashboard" className="pl-2" />
        <DashCards data={cardData} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pl-2 pt-4 pr-6">
          <DashChartArea />
          <DashMemberArea />
        </div>
        <div className="pl-2 pt-4 pb-6 pr-6"> 
          <DashProjectTable data={ProjectData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
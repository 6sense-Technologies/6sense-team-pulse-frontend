"use client";
import PageTitle from "@/components/PageTitle";
import { signOut} from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ButtonComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  // const session = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/sign-in')
  };


  // console.log("Session Data", session.data);

  return (
    <div>
      <PageTitle
        title="Dashboard • Ops4 Team"
      />
      <span className="md:hidden"><SidebarTrigger /></span>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;

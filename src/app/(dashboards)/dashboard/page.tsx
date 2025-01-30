"use client";
import PageTitle from "@/components/PageTitle";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loader from "../../../components/loader";
import { Button } from "@/components/ButtonComponent";

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/sign-in')
  };
  
  localStorage.setItem("accessToken", session.data?.accessToken as string);

  return (
    <div>
      <PageTitle
        title="Dashboard • Ops4 Team"
      />

      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;

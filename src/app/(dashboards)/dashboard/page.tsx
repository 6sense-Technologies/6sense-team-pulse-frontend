"use client";
import PageTitle from "@/components/PageTitle";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "../../../components/loader";
import { Button } from "@/components/ButtonComponent";

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.setItem("logout", "true");
    router.push("/sign-in");
  };

  const logout = localStorage.getItem("logout");

  if (logout === "true") {
    router.push("/sign-in");
    return <Loader />;
  }
  if (session.status !== "loading" && session.status === "authenticated") {
    if (!session.data?.isVerified && !session.data?.hasOrganization) {
      router.push("/sign-up/verification");
      // return <Loader />;
    }
    if (session.data?.isVerified && !session.data?.hasOrganization) {
      router.push("/sign-up/create-organization");
      // return <Loader />;
    }
    if (session.data?.isVerified && session.data?.hasOrganization && session.status === "authenticated") {
      router.push("/dashboard");
      // return <Loader />;
    }
  }

  return (
    <div>
      <PageTitle
        pageName="Ops4 Team"
        title="Dashboard  - Try Ops4 Team for Free"
      />

      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;

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
  // useEffect(()=>{
  // if (session.status !== "loading" && session.status === "authenticated") {
  //   if (!session.data?.isVerified && !session.data?.hasOrganization) {
  //     router.push("/sign-up/verification");
  //     // return <Loader />;
  //   }
  //   if (session.data?.isVerified && !session.data?.hasOrganization) {
  //     router.push("/sign-up/create-organization");
  //     // return <Loader />;
  //   }
  //   if (session.data?.isVerified && session.data?.hasOrganization && session.status === "authenticated") {
  //     router.push("/dashboard");
  //     // return <Loader />;
  //   }
  // }else if(session.status==='unauthenticated'){
  //   router.push('/sign-in')
  // }})

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

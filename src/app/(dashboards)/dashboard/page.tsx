'use client';
import PageTitle from "@/components/PageTitle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "../../../components/loader";

const Dashboard = () => {

  const session = useSession();
  const router = useRouter();


  if (!session.data?.isVerified && !session.data?.hasOrganization) {
    router.push("/sign-up/verification");
    return <Loader/>
  }
  if (session.data?.isVerified && !session.data?.hasOrganization) {
    router.push("/sign-up/create-organization");
     
  }
  if (session.data?.isVerified && session.data?.hasOrganization) {
    router.push("/dashboard");
  }
  if (
    session.data?.isVerified &&
    session.data?.hasOrganization &&
    session.status === "authenticated"
  ) {
    router.push("/dashboard");
  }

  return (
    <div>
      <PageTitle
        pageName="Ops4 Team"
        title="Dashboard  - Try Ops4 Team for Free"
      />
    </div>
  );
};

export default Dashboard;

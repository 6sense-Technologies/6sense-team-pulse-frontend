"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { CallbackLinear } from "../../../../../helpers/linear/linearApi";
import Loader from "@/components/loader";

const LinearAuthorizationPage = () => {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const toolId = localStorage.getItem("linearToolId");
  const projectId = localStorage.getItem("projectId");
  // console.log("🚀 ~ LinearAuthorizationPage ~ code:", code, toolId, projectId);

  const { data: linearCallbackData } = useQuery({
    queryKey: ["callbackLinear", toolId, code],
    queryFn: () => CallbackLinear(toolId, code, session),
  });

  if (linearCallbackData?.message) {
    // remove toolId and projectId from local storage
    localStorage.removeItem("linearToolId");
    localStorage.removeItem("projectId");
    router.push(`/projects/${projectId}`);
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader />
    </div>
  );
};

export default LinearAuthorizationPage;

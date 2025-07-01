"use client";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const LinearAuthorizationPage = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  console.log("🚀 ~ LinearAuthorizationPage ~ code:", code);
  return (
    <div>
      <h1>loader</h1>
    </div>
  );
};

export default LinearAuthorizationPage;

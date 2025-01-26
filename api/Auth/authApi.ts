import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import {
  TBasicSignupFormInputs,
  TOrgazinationDetails,
  TResndOtp,
  TVerifyEmail,
} from "@/types/Auth.types";
import axios from "axios";

export const handleBasicSignup = async (data: TBasicSignupFormInputs) => {
  const response = await axios.post(`${TEMP_BACKEND_URI}/auth/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.data);
  // {
  //   const result = await signIn("credentials", {
  //           redirect: false,
  //           emailAddress: data.emailAddress,
  //           password: data.password,
  //         });
  // }
  // console.log(response.data);
  // localStorage.setItem('isVerified', response.data.userInfo.isVerified);
  // localStorage.setItem('hasOrganization', response.data.userInfo.hasOrganization);
  return response.data;
};

export const handleOtp = async (data: TVerifyEmail) => {
  const response = await axios.post(
    `${TEMP_BACKEND_URI}/auth/register/verify-email`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const handleOrganizationDetails = async (data: TOrgazinationDetails) => {
  console.log(localStorage.getItem("accessToken"));
  const response = await axios.post(
    `${TEMP_BACKEND_URI}/auth/register/organization`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  console.log(response);
  return response.data;
};

export const handleResendOTP = (data: string) => {
  const response = axios.post(
    `${TEMP_BACKEND_URI}/email-service/send-verfication-email?emailAddress=${data}`
  );

  return response;
};

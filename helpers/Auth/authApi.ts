import {
  TBasicSignupFormInputs,
  TOrgazinationDetails,
  TVerifyEmail,
} from "@/types/Auth.types";
import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";



export const handleBasicSignup = async (data: TBasicSignupFormInputs) => {
  const response = await axios.post(`${TEMP_BACKEND_URI}/auth/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
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

export const handleOrganizationDetails = async (data: TOrgazinationDetails,session:any) => {
  
  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session')
    accessToken = response.data.accessToken;
  }


  const response = await axios.post(
    `${TEMP_BACKEND_URI}/auth/register/organization`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

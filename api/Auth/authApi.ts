import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import { TBasicSignupFormInputs } from "@/types/Auth.types";
import axios from "axios";

export const handleBasicSignup = async (data: TBasicSignupFormInputs) => {
    const response = await axios.post(`${TEMP_BACKEND_URI}/auth/signup`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    console.log(response.data);
    return response.data;
  };
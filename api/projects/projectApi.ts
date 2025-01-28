import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface TPaginationProps {
  page: number;
  limit: number;
}

const accessToken = localStorage.getItem("accessToken");

export const GetProjectList = async ( {page, limit} : TPaginationProps) => {
  const response = await axios.get(`${TEMP_BACKEND_URI}/projects?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    return response.data;
};

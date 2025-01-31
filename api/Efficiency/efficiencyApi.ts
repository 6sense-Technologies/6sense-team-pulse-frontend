import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import axios from "axios";
import { ProjectTools } from "@/types/Project.types";
import { TeamList } from "@/types/Efficiency.types";

interface TPaginationProps {
  page: number;
  limit: number;
}

interface TIndividualOverviewProps {
  member_id: string;
  page: number;
  limit: number;
}

interface TDailyPerformanceProps {
  member_id: string;
  page: number;
  limit: number;
  date: string;
}

export const GetTeamList = async ({ page, limit }: TPaginationProps) => {
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/overview?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  // console.log("Team Data",response.data);
  return response.data as TeamList;
};

export const GetIndividualOverview = async ({
  member_id,
  page,
  limit,
}: TIndividualOverviewProps) => {
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/individual?userId=${member_id}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response.data;
};

export const GetDailyPerformance = async ({
  member_id,
  date,
  page,
  limit,
}: TDailyPerformanceProps) => {
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/daily-performance?userId=${member_id}&dateTime=${date}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response.data;
};

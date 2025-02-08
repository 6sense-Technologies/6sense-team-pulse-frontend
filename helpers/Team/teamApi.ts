import axios from "axios";
import { TeamList } from "@/types/Team.types";
import { TEMP_BACKEND_URI } from "../../globalConstants";

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

export const GetTeamList = async ({ page, limit }: TPaginationProps, session:any ) => {
  session.update();
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/overview?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`,
      },
    }
  );

  console.log("Team Data",response.data);
  return response.data as TeamList;
};

export const GetIndividualOverview = async ({
  member_id,
  page,
  limit,
}: TIndividualOverviewProps, session:any) => {
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/individual?userId=${member_id}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`,
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
}: TDailyPerformanceProps, session:any) => {
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/daily-performance?userId=${member_id}&dateTime=${date}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`,
      },
    }
  );

  return response.data;
};


export const GetIndividualTeamMember = async (member_id: string,session:any) => {
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/user-info?userId=${member_id}`,
    {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`,
      },
    }
  );

  return response.data;
}

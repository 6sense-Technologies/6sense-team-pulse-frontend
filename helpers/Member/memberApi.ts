import axios from "axios";
import { InviteMemberForm, TeamList } from "@/types/Members.types";
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

interface TGithubDataProps {
  member_id: string;
  date: string;
}

export const GetTeamList = async ({ page, limit }: TPaginationProps, session:any ) => {
  
  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/overview?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
}: TIndividualOverviewProps, session:any) => {

  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/individual?userId=${member_id}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }


  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/daily-performance?userId=${member_id}&dateTime=${date}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};


export const GetIndividualTeamMember = async (member_id: string,session:any) => {
  
  
  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/users/user-info?userId=${member_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}


export const GetGitData = async ({
  member_id,
  date,
}: TGithubDataProps, session:any) => {

  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/github/get-contributions?userId=${member_id}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const GetGitCalculations = async ({
  member_id,
  date,
}: TGithubDataProps, session:any) => {

  let accessToken: string  = session.data.accessToken;


  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/github/summary?userId=${member_id}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const GetProjects = async (session:any) => {

  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/projects/names?page=${1}&limit=${10}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const GetRoles = async (session:any) => {

  let accessToken: string  = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response= await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/organization/roles`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const CreateInviteMember = async (data: InviteMemberForm, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const formData = new FormData();
  formData.append("displayName", data.displayName);
  formData.append("emailAddress", data.emailAddress);
  formData.append("designation", data.designation);
  formData.append("projects", data.projects.join(","));
  formData.append("jiraId", data.jiraId);
  formData.append("trelloId", data.trelloId);
  formData.append("githubUsername", data.githubUserName);
  formData.append("role", data.role);
  if (data.profilePicture) {
    formData.append("profilePicture", data.profilePicture);
  }

  console.log("Form Data", formData);

  const response = await axios.post(`${TEMP_BACKEND_URI}/users/invite`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};


export const ToggleMemberState = async (data: string, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get('/api/auth/session');
    accessToken = response.data.accessToken;
  }

  const response = await axios.post(`${TEMP_BACKEND_URI}/users/toggle-enable`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
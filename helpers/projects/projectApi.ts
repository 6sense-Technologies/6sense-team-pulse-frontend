import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";

interface TPaginationProps {
  page: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  projectId?: string;
  searchText?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const GetProjectList = async ({ page, limit }: TPaginationProps, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/projects?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

export const GetTools = async () => {
  const response = await axios.get(`${TEMP_BACKEND_URI}/tool/list`);

  return response.data;
};

export const CreateProject = async (data: any, session: any) => {
  //
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.post(`${TEMP_BACKEND_URI}/projects`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const GetDesignations = async () => {
  const response = await axios.get(`${TEMP_BACKEND_URI}/users/designations/list`);

  return response.data;
};

// get project details work sheet performance
export const GetProjectWorksheetPerformance = async (session: any, data: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }
  // <<base_url>>/projects/worksheet-analytics
  const response = await axios.get(`${TEMP_BACKEND_URI}/projects/worksheet-analytics`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: data,
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

// get project route worksheet list
export const GetProjectWorksheetList = async (
  {
    page,
    limit,
    projectId,
    startDate,
    endDate,
    searchText,
    sortBy,
    sortOrder,
    //  sort
  }: TPaginationProps,
  session: any,
) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    // `${TEMP_BACKEND_URI}/projects/worksheet-list?page=${page}&limit=${limit}&start-date=${startDate}&end-date=${endDate}&sort-order=${sort}`,
    `${TEMP_BACKEND_URI}/projects/worksheet-list?page=${page}&limit=${limit}&project-id=${projectId}&start-date=${startDate}&end-date=${endDate}&search=${searchText}&sort-by=${sortBy}&sort-order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Organization-Id": "67a317a25b672f01152f081a",
        // "Timezone-Region": "Asia/Dhaka",
      },
    },
  );

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

// get single project details
export const GetSingleProjectDetails = async (projectId: string, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

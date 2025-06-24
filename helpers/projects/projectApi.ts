import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";

interface TPaginationProps {
  page: number;
  limit: number;
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

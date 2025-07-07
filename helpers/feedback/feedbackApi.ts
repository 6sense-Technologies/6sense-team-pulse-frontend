import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";

export const GetMemberList = async (session: any, page: string, limit: string, searchText: string) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/users/list?page=${page}&limit=${limit}&search=${searchText}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

//get linked items for feedback form
export const GetLinkedItems = async (memberId: string, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/users/all-issues/${memberId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// send feedback
export const sendFeedback = async (data: any, session: any) => {
  //
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    // <<temp_base_url>>/timelog/unreported/assign-to-project
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.post(`${TEMP_BACKEND_URI}/feedback`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // "Organization-Id": "67a317a25b672f01152f081a",
    },
  });

  return response.data;
};

// Get feedback list
export const GetFeedbackList = async (session: any, page: string, limit: string, searchText: string) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/feedback?page=${page}&limit=${limit}&search=${searchText}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

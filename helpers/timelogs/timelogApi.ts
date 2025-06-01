import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";
import { useState } from "react";

interface TPaginationProps {
  page: number;
  limit: number;
  formattedDate?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  searchText?: string;
}

interface TWorksheetProps {
  projectId: string;
  worksheetName: string;
  formattedDate: string;
}

export const GetTimelogListUnreported = async ({ page, limit, formattedDate, sort }: TPaginationProps, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/timelog/unreported?page=${page}&limit=${limit}&date=${formattedDate}&sort-order=${sort}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Organization-Id": "67a317a25b672f01152f081a",
      "Timezone-Region": "Asia/Dhaka",
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

export const GetProjectList = async (session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }
  // <<temp_base_url>>/projects/get-user-projects-by-organization
  const response = await axios.get(`${TEMP_BACKEND_URI}/projects/get-user-projects-by-organization`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Organization-Id": "67a317a25b672f01152f081a",
      // "Timezone-Region": "Asia/Dhaka",
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

export const GetWorksheetList = async ({ projectId, worksheetName, formattedDate }: TWorksheetProps, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }
  // <<temp_base_url>>/timelog/worksheet/get-names?project-id=67b42f1257e150fb2a691fe3&name=May&date=2025-05-16
  const response = await axios.get(
    `${TEMP_BACKEND_URI}/timelog/worksheet/get-names?project-id=${projectId}&name=${worksheetName}&date=${formattedDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Organization-Id": "67a317a25b672f01152f081a",
        // "Timezone-Region": "Asia/Dhaka",
      },
    },
  );

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

export const CreateReportedData = async (data: any, session: any) => {
  // console.log("Session Data",session.data);
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");
    // <<temp_base_url>>/timelog/unreported/assign-to-project
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.post(`${TEMP_BACKEND_URI}/timelog/unreported/assign-to-project`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Organization-Id": "67a317a25b672f01152f081a",
    },
  });

  return response.data;
};

export const GetTimelogListReported = async ({ page, limit, startDate, endDate, sort }: TPaginationProps, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/timelog/worksheet/list?page=${page}&limit=${limit}&start-date=${startDate}&end-date=${endDate}&sort-order=${sort}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Organization-Id": "67a317a25b672f01152f081a",
        "Timezone-Region": "Asia/Dhaka",
      },
    },
  );

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

export const GetReportedworksheetList = async ({ page, limit, sort, searchText }: TPaginationProps, reportedId: string | null, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  // <<temp_base_url>>/timelog/worksheet/6836bdd6eeecb27e220325ef

  const response = await axios.get(
    `${TEMP_BACKEND_URI}/timelog/worksheet/${reportedId}?page=${page}&limit=${limit}&sort-order=${sort}&search=${searchText}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Organization-Id": "67a317a25b672f01152f081a",
        "Timezone-Region": "Asia/Dhaka",
      },
    },
  );

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

export const RemoveWorksheetData = async (data: any, session: any) => {
  // console.log("Session Data",session.data);
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");
    // <<temp_base_url>>/timelog/unreported/assign-to-project
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.delete(`${TEMP_BACKEND_URI}/timelog/worksheet/remove-activities`, {
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Organization-Id": "67a317a25b672f01152f081a",
    },
  });

  return response.data;
};

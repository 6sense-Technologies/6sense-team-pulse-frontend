import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";

export const ConnectLinear = async (toolId: string | null, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/linear/connect?tool-id=${toolId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const CallbackLinear = async (toolId: string | null, code: string | null, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/linear/callback?tool-id=${toolId}&code=${code}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

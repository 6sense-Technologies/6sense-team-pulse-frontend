import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";

interface TPaginationProps {
  page: number;
  limit: number;
  formattedDate: string;
}

export const GetTimelogList = async ({ page, limit, formattedDate }: TPaginationProps, session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");

    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/timelog/unreported?page=${page}&limit=${limit}&date=${formattedDate}`, {
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

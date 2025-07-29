import axios from "axios";
import { TEMP_BACKEND_URI } from "../../globalConstants";

export const GetOrganizationList = async (session: any) => {
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.get(`${TEMP_BACKEND_URI}/organization/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    session.update();
  }

  return response.data;
};

//change organization
export const changeOrganization = async (organizationId: string, session: any) => {
  //
  let accessToken: string = session.data.accessToken;

  if (new Date(session.data.expires) <= new Date()) {
    // <<temp_base_url>>/timelog/unreported/assign-to-project
    const response = await axios.get("/api/auth/session");
    accessToken = response.data.accessToken;
  }

  const response = await axios.post(
    `${TEMP_BACKEND_URI}/auth/change-organization`,
    { organizationId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};

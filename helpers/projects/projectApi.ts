
import axios from "axios";
import { ProjectTools } from "@/types/Project.types";
import { TEMP_BACKEND_URI } from "../../globalConstants";

interface TPaginationProps {
  page: number;
  limit: number;
}




export const GetProjectList = async ( {page, limit} : TPaginationProps , session : any ) => {

  const response = await axios.get(`${TEMP_BACKEND_URI}/projects?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`,
      },
    });

    if(response.status === 401)
      {
        session.update();
      }

    return response.data;
};

export const GetTools =  async () => 
  {
    const response = await axios.get(`${TEMP_BACKEND_URI}/tool/list`);

    return response.data;
  }


export const CreateProject = async (data: ProjectTools, session:any) => 
{
  console.log("Session Data",session.data);

  if (new Date(session.data.expires) <= new Date()) {
    console.log("Session expired. Updating session...");
    session.update();
  }

  const response = await axios.post(`${TEMP_BACKEND_URI}/projects`, data,
    {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`,
      },
    });

    return response.data;
}
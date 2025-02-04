import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import axios from "axios";
import { ProjectTools } from "@/types/Project.types";

interface TPaginationProps {
  page: number;
  limit: number;
}
let accessToken =null;
if(typeof window!=='undefined'){
  accessToken=localStorage.getItem("accessToken");
}
export const GetProjectList = async ( {page, limit} : TPaginationProps) => {
  let accessToken = null;
  if(typeof window!=='undefined'){
    accessToken=localStorage.getItem('accessToken')
  }
  const response = await axios.get(`${TEMP_BACKEND_URI}/projects?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
};

export const GetTools =  async () => 
  {
    const response = await axios.get(`${TEMP_BACKEND_URI}/tool/list`);

    return response.data;
  }


export const CreateProject = async (data: ProjectTools) => 
{
  const response = await axios.post(`${TEMP_BACKEND_URI}/projects`, data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}
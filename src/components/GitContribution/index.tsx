import GitContributionTable from "../GitContributionTable";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

import { IGitContribution } from "@/types/types";
import { TEMP_BACKEND_URI } from "../../../globalConstants";

interface IGitParam {
  userId: string;
  date: string;
}

const GitContribution = (param: IGitParam): JSX.Element => {
  const { data, isFetching: gitContributionLoading } = useQuery<IGitContribution[]>({
    queryKey: ["fetchGitContributions"],
    queryFn: async () => {
      const res: AxiosResponse<IGitContribution[]> = await axios.get(
        `${TEMP_BACKEND_URI}/github/get-contributions?userId=${param.userId}&date=${param.date}`,
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Git Contributions</h1>
      </div>

      <GitContributionTable gitContributions={data ? data : []} loading={gitContributionLoading} />
    </div>
  );
};

export default GitContribution;

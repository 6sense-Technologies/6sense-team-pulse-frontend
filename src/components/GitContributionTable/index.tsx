
import { cn } from "@/app/utils/tailwindMerge";
import { IGitContribution } from "@/types/types";
import { Spinner } from "@phosphor-icons/react";
import Link from "next/link";
import EmptyTableDataView from "../EmptyTableDataView";

interface IGitContributionObject {
  gitContributions: IGitContribution[];
  loading: boolean;
}

const GitContributionTable = (param: IGitContributionObject): JSX.Element => {
  const totalAdditions = param.gitContributions.reduce((sum, item) => {
    return sum + item.totalAdditions;
  }, 0);
  const totalDeletions = param.gitContributions.reduce((sum, item) => {
    return sum + item.totalDeletions;
  }, 0);
  // const totalChanges = param.gitContributions.reduce((sum, item) => sum + item.tot, 0);
  const totalContribution = param.gitContributions.reduce((sum, item) => {
    return sum + item.totalWritten;
  }, 0);

  // Calculate code churn percentage (optional)
  const codeChurn = (totalDeletions / (totalAdditions + 1)) * 100;
  const getCodeChurnColor = (codeChurn: number): string => {
    if (codeChurn < 10) {
      return "text-green-500"; // Healthy churn
    } else if (codeChurn <= 20) {
      return "text-yellow-500"; // Moderate churn
    }
    return "text-red-500"; // High churn
  };

  if (param.loading)
    return (
      <div className="text-center mt-2 mb-10">
        <Spinner size={32} className="inline-block min-w-full align-middle" />
      </div>
    );

  return param.gitContributions.length > 0 ? (
    <div>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="mt-2 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center relative group">
                    <h2 className="text-xl font-bold text-gray-800">
                      Total Additions
                    </h2>
                    <span className="ml-2 text-gray-500 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#000000"
                        viewBox="0 0 256 256"
                      >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                      </svg>
                    </span>
                    <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 left-8 top-0 transform -translate-y-10">
                      Total lines of code added in contributions
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-green-500">
                    {totalAdditions}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center relative group">
                    <h2 className="text-xl font-bold text-gray-800">
                      Total Deletions
                    </h2>
                    <span className="ml-2 text-gray-500 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#000000"
                        viewBox="0 0 256 256"
                      >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                      </svg>
                    </span>
                    <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 left-8 top-0 transform -translate-y-10">
                      Total lines of code deleted
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-red-500">
                    {totalDeletions}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center relative group">
                    <h2 className="text-xl font-bold text-gray-800">
                      Total Contribution
                    </h2>
                    <span className="ml-2 text-gray-500 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#000000"
                        viewBox="0 0 256 256"
                      >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                      </svg>
                    </span>
                    <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 left-8 top-0 transform -translate-y-10">
                      Net additions after deletions for all contributions
                    </div>
                  </div>
                  <p
                    className={`mt-2 text-2xl font-semibold ${
                      totalContribution >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {totalContribution}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center relative group">
                    <h2 className="text-xl font-bold text-gray-800">
                      Code Churn
                    </h2>
                    <span className="ml-2 text-gray-500 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#000000"
                        viewBox="0 0 256 256"
                      >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                      </svg>
                    </span>
                    <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 left-8 top-0 transform -translate-y-10">
                      Percentage of lines deleted relative to total additions
                    </div>
                  </div>
                  <p
                    className={`mt-2 text-2xl font-semibold ${getCodeChurnColor(
                      codeChurn
                    )}`}
                  >
                    {codeChurn.toFixed(2)}%
                  </p>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-bgSecondary">
                  <tr>
                    <th
                      scope="col"
                      className={cn(
                        "pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left"
                      )}
                    >
                      Project
                    </th>
                    <th
                      scope="col"
                      className={cn(
                        "pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left"
                      )}
                    >
                      Branch
                    </th>
                    <th
                      scope="col"
                      className={cn(
                        "pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left"
                      )}
                    >
                      Additions
                    </th>
                    <th
                      scope="col"
                      className={cn(
                        "pl-4 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left"
                      )}
                    >
                      Deletions
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-3 pr-16 text-xs md:text-sm font-bold text-primaryFocus text-left z-10"
                    >
                      Changes
                    </th>

                    <th
                      scope="col"
                      className="py-2 pl-3 pr-16 text-xs md:text-sm font-bold text-primaryFocus text-left z-10"
                    >
                      Contribution
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {param?.gitContributions?.map((gc: IGitContribution) => {
                    return (
                      <tr key={gc._id}>
                        <td
                          scope="col"
                          className={cn(
                            "pl-6 py-2 text-xs md:text-sm text-primaryFocus text-left"
                          )}
                        >
                          {gc.gitRepo.repo}
                        </td>
                        <td
                          scope="col"
                          className={cn(
                            "pl-6 py-2 text-xs md:text-sm text-primaryFocus text-left underline"
                          )}
                        >
                          <Link href={`${gc.commitHomeUrl}`} target="_blank">
                            {gc.branch}
                          </Link>
                        </td>
                        <td
                          scope="col"
                          className={cn(
                            "pl-6 py-2 text-xs md:text-sm text-primaryFocus text-left"
                          )}
                        >
                          {gc.totalAdditions}
                        </td>
                        <td
                          scope="col"
                          className={cn(
                            "pl-4 py-2 text-xs md:text-sm text-primaryFocus text-left"
                          )}
                        >
                          {gc.totalDeletions}
                        </td>
                        <td
                          scope="col"
                          className="py-2 pl-3 pr-16 text-xs md:text-sm text-primaryFocus text-left z-10"
                        >
                          {gc.totalChanges}
                        </td>

                        <td
                          scope="col"
                          className="py-2 pl-3 pr-16 text-xs md:text-sm text-primaryFocus text-left z-10"
                        >
                          {gc.totalWritten}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <EmptyTableDataView
      iconName="GithubLogo"
      heading="No Contributions"
      subHeading="Get started by committing your codes to git."
    />
  );
};

export default GitContributionTable;

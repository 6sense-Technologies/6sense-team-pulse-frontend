import EmptyTableDataView from "@/app/components/UI/EmptyTableDataView";
import IconComponent from "@/app/components/UI/IconComponent";
import { COLOR_PRIMARY } from "@/app/utils/colorUtils";
import { cn } from "@/app/utils/tailwindMerge";
import { IGitContribution } from "@/types/types";
import { Spinner } from "@phosphor-icons/react";
import Link from "next/link";

interface IGitContributionObject {
  gitContributions: IGitContribution[];
  loading: boolean;
}

const GitContributionTable = (param: IGitContributionObject): JSX.Element => {
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
            <div className="">
              <table className="min-w-full divide-y divide-gray-300 mt-2 mb-10">
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

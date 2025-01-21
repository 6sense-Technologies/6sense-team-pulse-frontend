"use client";
import { Button } from "@/components/ButtonComponent";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import { Input } from "@/components/ui/input";
import React from "react";
import Searchbar from "../_components/searchbar";
import { Dropdown } from "@/components/dropdown";
import { ProjectTable } from "../_components/projectTable";

const projects = [
  {
    projectName: "Project Alpha",
    managementTools: "Jira",
    teamSize: 10,
  },
  {
    projectName: "Project Beta",
    managementTools: "Trello",
    teamSize: 8,
  },
  {
    projectName: "Project Gamma",
    managementTools: "Asana",
    teamSize: 12,
  },
  {
    projectName: "Project Delta",
    managementTools: "Monday.com",
    teamSize: 6,
  },
  {
    projectName: "Project Epsilon",
    managementTools: "ClickUp",
    teamSize: 15,
  },
  {
    projectName: "Project Zeta",
    managementTools: "Basecamp",
    teamSize: 9,
  },
  {
    projectName: "Project Eta",
    managementTools: "Wrike",
    teamSize: 11,
  },
  {
    projectName: "Project Theta",
    managementTools: "Smartsheet",
    teamSize: 7,
  },
  {
    projectName: "Project Iota",
    managementTools: "Notion",
    teamSize: 14,
  },
  {
    projectName: "Project Kappa",
    managementTools: "Airtable",
    teamSize: 5,
  },
];

const ProjectList = () => {
  return (
    <div className="w-full">
      <div className="pl-4 pr-[14px] w-full">
        <GlobalBreadCrumb
          initialData="Projects"
          initalLink="/projects"
          secondayData="List"
          secondayLink="/projects"
        />
        <div className="flex flex-col md:flex-row justify-between gap-y-3 md:gap-y-0 item-start md:items-end w-full">
          <Searchbar
            placeholder="Search by project name"
            name="search"
            btntext="Search"
            className="mt-4 gap-x-2"
            variant="light"
          />
          <Dropdown />
        </div>
        <div className="pt-4">
          <ProjectTable
            totalCountAndLimit={{ totalCount: 5, size: 10 }}
           projects={projects ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

import { z } from "zod";

export const MemberSchema = z
  .object({
    designation: z.string().min(1, "Designation is required"),
    projects: z
      .array(
        z.object({
          _id: z.string(),
          tool: z.string(),
          toolURL: z.string().optional(),
          name: z.string(),
          createdAt: z.string().optional(),
          updatedAt: z.string().optional(),
          __v: z.number().optional(),
        })
      )
      .min(1, "At least one project is required"),
    jiraId: z.string().optional(),
    trelloId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const jiraProjects = data.projects.filter(
      (project) => project.tool === "jira"
    );
    const trelloProjects = data.projects.filter(
      (project) => project.tool === "trello"
    );

    if (jiraProjects.length > 0 && !data.jiraId) {
      ctx.addIssue({
        path: ["jiraId"],
        message: "Jira ID is required for selected Jira projects!",
        code: z.ZodIssueCode.custom,
      });
    }
    if (trelloProjects.length > 0 && !data.trelloId) {
      ctx.addIssue({
        path: ["trelloId"],
        message: "Trello ID is required for selected Trello projects!",
        code: z.ZodIssueCode.custom,
      });
    }
  });
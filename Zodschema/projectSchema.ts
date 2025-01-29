import { z } from "zod";

export const ProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required." })
    .min(1, { message: "Project name is required." }),
  tools: z
    .array(
      z.object({
        toolName: z.string({ required_error: "Tool name is required." }).min(1, { message: "Tool name is required." }),
        toolUrl: z.string({ required_error: "Workspace URL is required." }).url({ message: "Workspace URL is required." }),
      })
    )
    .min(1, { message: "Minimum one tool must be selected." }),
});
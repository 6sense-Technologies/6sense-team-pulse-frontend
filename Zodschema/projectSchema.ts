import { z } from "zod";

export const ProjectSchema = z
  .object({
    Name: z
      .string({ required_error: 'Project name is required.' })
      .min(1, { message: 'Project name is required.' }),

  });

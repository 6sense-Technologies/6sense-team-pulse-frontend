import { z } from "zod";

export const GrowthDetailSchema = z.object({
  action: z.string().min(1, "activity is required!"),
});

export const GrowthSchema = z.object({
  goal: z.string().min(1, "Goal is required!"),
});

import { z } from "zod";

export const BugReportSchema = z.object({
    noOfBug: z
        .string() // Accept input as a string initially
        .min(1, "No. of bug is required.") // Ensure the field is not empty
        .transform((value) => { return Number(value) }) // Convert the string to a number
        .refine((value) => { return !isNaN(value) && value > 0 && Number.isInteger(value) }, {
            message: "No. of bug must be a positive integer."
        }),
    token: z
        .string()
        .min(1, "Token is required."), // Minimum length 1 ensures non-empty
    comment: z
        .string()
        .optional()
});
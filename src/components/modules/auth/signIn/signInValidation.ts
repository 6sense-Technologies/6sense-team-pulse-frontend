import { z } from "zod";

export const LoginSchema = z.object({
  emailAddress: z.string({ required_error: "Email is required" }).email("Incorrect email.").min(1, { message: "Email is required." }),
  password: z.string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
});

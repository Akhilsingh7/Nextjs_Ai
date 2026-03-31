import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 character")
  .max(20, "Username must not be more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username ust not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ message: "Invalid email adress" }),
  password: z.string().min(6, "Passowr dmust be atlesst 6 character"),
});

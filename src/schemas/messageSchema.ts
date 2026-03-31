import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be of atleast 10 character" })
    .max(300, { message: "content cannot be of more than 300 character" }),
});

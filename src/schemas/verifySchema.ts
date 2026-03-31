import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "Vaerification code must be of 6 digits"),
});

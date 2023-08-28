import { z, TypeOf } from "zod";

const fileUpLoadSchema = z.object({
  body: z
    .object({
      filename: z
        .string({ required_error: "First name is required" })
        .min(2, "First name must be at least 2 characters long")
        .max(64, "First name must be at most 64 characters long"),
      folderId: z.optional(z.number()),
      fileOwner :z.number({required_error: "File owner is required"}),
    })
});

export type FileUploadInput = TypeOf<typeof fileUpLoadSchema>["body"];
export { fileUpLoadSchema };

import { z, TypeOf } from "zod";

const folderCreationSchema = z.object({
  body: z
    .object({
      foldername: z
        .string({ required_error: "Folder name is required" })
        .min(2, "Folder name must be at least 2 characters long")
        .max(64, "Folder name must be at most 64 characters long"),
      parentId: z.optional(z.number()),
      folderOwner :z.number({required_error: "Folder owner is required"}),
    })
});

export type FolderCreationInput = TypeOf<typeof folderCreationSchema>["body"];
export { folderCreationSchema };

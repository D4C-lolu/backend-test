import express from "express";
import FolderController from "../controllers/folder";
import isUser from "../middleware/requireUser.middleware";
import validateResource from "../middleware/validator.middleware";
import { folderCreationSchema } from "../schemas/folder.schema";

const router = express.Router();

router.post(
  "/new",
  isUser,
  validateResource(folderCreationSchema),
  FolderController.createFolder
);

router.get(
  "/:id",
  isUser,
  FolderController.getFolderById
);

router.get("children/:id", isUser, FolderController.getFolderChildren);

router.get("/files/:id", isUser, FolderController.getFolderFiles);

router.delete(
  "/delete/:id",
  isUser,
  FolderController.deleteFolder
);

export default router;
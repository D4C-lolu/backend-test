import express from "express";
import FileController from "../controllers/file";
import isUser from "../middleware/requireUser.middleware";
import isAdmin from "../middleware/requireAdmin.middleware";

const router = express.Router();

router.post(
  "/upload",
  isUser,
  FileController.uploadFile
);

router.get(
  "/download/:filepath",
  isUser,
  FileController.downloadFile
);

router.delete(
  "/delete/:filepath",
  isUser,
  FileController.deleteFile
);

router.get("/", isUser,isAdmin, FileController.getUserFiles);

router.get("/:id", isUser, FileController.getFileById);

router.get("/user/:id", isUser, FileController.getUserFiles);

router.post("/flag/:id", isAdmin, FileController.flagFile);

router.delete("/flag/:id", isAdmin, FileController.deleteFile);

export default router;
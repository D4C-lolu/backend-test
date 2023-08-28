/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import FileService from "../../services/file.service";
import { uploadToS3, deleteFileFromS3, downloadFileFromS3 } from "../../utils/awsUtil";
import UserService from "../../services/user.service";
import FileReviewService from "../../services/fileReview.service";
import FolderService from "../../services/folder.service";
import logger from "../../utils/logger";

class FileController {
  static uploadFile = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File not found" });
      }

      if (req.user?.id !== req.body.fileOwner) {
        return res
          .status(401)
          .json({ message: "Active user does not match file owner" });
      }

      const isOwner = await FolderService.checkIfFolderBelongsToUser(
        req.body.fileOwner,
        req.body.folderId
      );
      if (!isOwner) {
        return res.status(403).json({
          message: "You do not have permission to upload to this folder",
        });
      }

      uploadToS3.single("file")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err });
        }

        const returnedFile = req.file as Express.MulterS3.File;

        const fileData = {
          filename: returnedFile!.originalname,
          filetype: returnedFile!.mimetype as string,
          filesize: returnedFile!.size,
          key: returnedFile!.key,
          location: returnedFile!.location,
          fileOwner: req.body.fileOwner,
          folderId: req.body.folderId,
        };
        await FileService.createFile(fileData);
        res.status(201).json({ message: "File uploaded successfully" });
      });
    } catch (error) {
      logger.error("Error uploading file:", error);
      res
        .status(500)
        .json({ message: "An error occurred while uploading the file" });
    }
  };

  static getAllFiles = async (req: Request, res: Response) => {
    try {
      const files = await FileService.getAllFiles();
      res.status(200).json(files);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };


  static getFileById = async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.id, 10);
      const file = await FileService.getFileById(fileId);
      if (file) {
        const activeUser = req.user?.id as number;
        const result = await UserService.isAdminOrOwner(file.fileOwner, activeUser);
        if (!result) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(file);
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static getUserFiles = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const activeUser = req.user?.id as number;

      const result = await UserService.isAdminOrOwner(userId, activeUser);
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const files = await FileService.getUserFiles(userId);
      if (files) {
        res.status(200).json(files);
      } else {
        res.status(404).json({ message: "Files not found" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static deleteFile = async (req: Request, res: Response) => {
    try {
      
      const activeUser = req.user?.id as number;
      const filepath = req.params.filepath;
      const file = await FileService.getFileByKey(filepath);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      const result = await !UserService.isAdminOrOwner(file.fileOwner, activeUser);
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await deleteFileFromS3(req, filepath);
      await FileService.deleteFile(filepath);
      res.status(204).end();
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static downloadFile = async (req: Request, res: Response) => {
    try {

      const filepath = req.params.filepath;
      
      const file = await FileService.getFileByKey(filepath);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const activeUser = req.user?.id as number;

      const result = await UserService.isAdminOrOwner(file.fileOwner, activeUser);
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await downloadFileFromS3(req, res, filepath);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static flagFile = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const fileId = parseInt(req.params.id, 10);
      const file = await FileService.getFileById(fileId);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const activeUser = req.user?.id as number;

      await FileReviewService.createFileReview({
        fileId: fileId,
        userId: activeUser,
      });
      res.status(200).json({ message: "File flagged" });
    } catch (error) {
      logger.error("Error flagging file:", error);
      return res.status(400).json({ message: error });
    }
  };

  static async deleteFileReview(req: Request<{ id: string }>, res: Response) {
    try {
      const fileId = parseInt(req.params.id, 10);
      const activeUser = req.user?.id as number;
      const result = await ! FileReviewService.checkIfOwner(activeUser, fileId);
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await FileReviewService.deleteFileReview(fileId);
      res.status(200).json({ message: "File review deleted" });
    } catch (error) {
      logger.error("Error deleting file review:", error);
      return res.status(400).json({ message: error });
    }
  }
}

export default FileController;

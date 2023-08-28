/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import FolderService from "../../services/folder.service";
import UserService from "../../services/user.service";
import FileService from "../../services/file.service";

class FolderController {
  static async createFolder(req: Request, res: Response) {
    try {
      const { foldername, folderOwner, parentId } = req.body;
      const activeUser = req.user?.id as number;

      if (activeUser !== folderOwner) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const folderData = {
        foldername,
        folderOwner,
        parentId,
      };

      const createdFolder = await FolderService.createFolder(folderData);
      return res.status(201).json(createdFolder);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  static async getFolderById(req: Request, res: Response) {
    try {
      const folderId = parseInt(req.params.id, 10);
      const folder = await FolderService.getFolderById(folderId);

      if (!folder) {
        res.status(404).json({ message: "Folder not found" });
      } else {
        const activeUser = req.user?.id as number;
        const result = await UserService.isAdminOrOwner(
          folder.folderOwner,
          activeUser
        );
        if (!result) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(folder);
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async getFolderChildren(req: Request, res: Response) {
    try {
      const folderId = parseInt(req.params.id, 10);
      const activeUser = req.user?.id as number;
      const folder = await FolderService.getFolderById(folderId);
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
      const result = await UserService.isAdminOrOwner(
        folder.folderOwner,
        activeUser
      );
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const children = await FolderService.getFolderChildren(folderId);
      return res.status(200).json(children);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  static async getFolderFiles(req: Request, res: Response) {
    try {
      const folderId = parseInt(req.params.id, 10);
      const activeUser = req.user?.id as number;
      const folder = await FolderService.getFolderById(folderId);
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
      const result = await UserService.isAdminOrOwner(
        folder.folderOwner,
        activeUser
      );
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const files = await FileService.getFolderFiles(folderId);
      return res.status(200).json(files);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  static async deleteFolder(req: Request, res: Response) {
    try {
      const folderId = parseInt(req.params.id, 10);
      const activeUser = req.user?.id as number;
      const folder = await FolderService.getFolderById(folderId);
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      const result = await UserService.isAdminOrOwner(
        folder.folderOwner,
        activeUser
      );
      if (!result) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await FolderService.deleteFolder(folderId);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

export default FolderController;


import { Folder } from "../models";
import File, {  FileAttributes, FileCreationAttributes } from "../models/file.model";
import { FileStatus } from "../types";

class FileService {
  static async getAllFiles() {
    try {
      const files = await File.findAll();
      return files;
    }
    catch (error) {
      throw new Error(`Error fetching all files: ${error}`);
    }
  }
  
  static async createFile(fileData: Omit<FileCreationAttributes, "status">): Promise<File> {
    try {

      //User must have a root folder to upload files
      const userRootFolder = await Folder.findOne({
        where: {
          folderOwner: fileData.fileOwner,
          foldername: fileData.fileOwner.toString(),
          parentId: undefined
        },  
      });

      if (!userRootFolder) {
        throw new Error("User root folder not found");
      }

      const userFolderId = fileData.folderId === null ? userRootFolder.id : fileData.folderId;

      const createdFile = await File.create({
        ...fileData,
        status: FileStatus.SAFE,
        folderId: userFolderId,
      });
      return createdFile;
    } catch (error) {
      throw new Error(`Error creating file: ${error}`);
    }
  }

  static async getFileByKey(key: string):  Promise<File | null> {
    try {
      const file = await File.findOne({
        where: {
          key,
        },
      }); 
      return file;
    }
    catch (error) {
      throw new Error(`Error fetching file by key: ${error}`);
    }
  }


  static async getFileById(id: number): Promise<File | null> {
    try {
      const file = await File.findByPk(id);
      return file;
    } catch (error) {
      throw new Error(`Error fetching file by ID: ${error}`);
    }
  }

  static async getUserFiles(id: number): Promise<File[] | null> {
    try {
      const files = await File.findAll({
        where: {
          fileOwner: id,
        },
      });
      return files;
    } catch (error) {
      throw new Error(`Error fetching user files: ${error}`);
    }
  }


  static async getFolderFiles(id: number): Promise<File[] | null> {
    try {
      const files = await File.findAll({
        where: {
          folderId: id,
        },
      });
      return files;
    } catch (error) {
      throw new Error(`Error fetching folder files: ${error}`);
    }
  }

  static async updateFile(id: number, updates: Partial<FileAttributes>): Promise<File | null> {
    try {
      const [rowsAffected, updatedFiles] = await File.update(updates, {
        where: { id },
        returning: true,
      });
      return rowsAffected === 1 ? updatedFiles[0] : null;
    } catch (error) {
      throw new Error(`Error updating file: ${error}`);
    }
  }

  static async deleteFile(key: string): Promise<void> {
    try {
      await File.destroy({ where: { key } });
    } catch (error) {
      throw new Error(`Error deleting file: ${error}`);
    }
  }
}

export default FileService;

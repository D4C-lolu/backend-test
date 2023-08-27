import Folder, {  FolderAttributes, FolderCreationAttributes } from "../models/folder.model";
class FolderService {
  static async createFolder(folderData: FolderCreationAttributes): Promise<Folder> {
    try {
      const createdFolder = await Folder.create(folderData);
      return createdFolder;
    } catch (error) {
      throw new Error(`Error creating folder: ${error}`);
    }
  }

  static async getFolderById(id: number): Promise<Folder | null> {
    try {
      const folder = await Folder.findByPk(id);
      return folder;
    } catch (error) {
      throw new Error(`Error fetching folder by ID: ${error}`);
    }
  }

  static async updateFolder(id: number, updates: Partial<FolderAttributes>): Promise<Folder | null> {
    try {
      const [rowsAffected, updatedFolders] = await Folder.update(updates, {
        where: { id },
        returning: true,
      });
      return rowsAffected === 1 ? updatedFolders[0] : null;
    } catch (error) {
      throw new Error(`Error updating folder: ${error}`);
    }
  }

  static async deleteFolder(id: number): Promise<void> {
    try {
      await Folder.destroy({ where: { id } });
    } catch (error) {
      throw new Error(`Error deleting folder: ${error}`);
    }
  }
}

export default FolderService;

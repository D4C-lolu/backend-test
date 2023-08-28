import Folder, {
  FolderAttributes,
  FolderCreationAttributes,
} from "../models/folder.model";




class FolderService {
  static async createFolder(
    folderData: FolderCreationAttributes
  ): Promise<Folder> {
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

  static async updateFolder(
    id: number,
    updates: Partial<FolderAttributes>
  ): Promise<Folder | null> {
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

  static async checkIfFolderBelongsToUser(
    userId: number,
    folderId: number
  ): Promise<boolean> {
    try {
      const folder = await Folder.findByPk(folderId);
      return folder?.folderOwner === userId;
    } catch (error) {
      throw new Error(`Error fetching folder by ID: ${error}`);
    }
  }

  static async buildPathString(folderId: number): Promise<string> {
    try {
      let pathString = "";
      let currentFolder = await Folder.findByPk(folderId);
      while (currentFolder?.parentId) {
        pathString = `${currentFolder.foldername}/${pathString}`;
        currentFolder = await Folder.findByPk(currentFolder.parentId);
      }
      return pathString;
    } catch (error) {
      throw new Error(`Error fetching folder by ID: ${error}`);
    }
  }

  static async getFolderChildren(folderId: number): Promise<Folder[] | null> {
    try {
      const folders = await Folder.findAll({
        where: {
          parentId: folderId,
        },
      });
      return folders;
    } catch (error) {
      throw new Error(`Error fetching folder children: ${error}`);
    }
  }
}

export default FolderService;

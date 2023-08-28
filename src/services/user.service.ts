/* eslint-disable @typescript-eslint/no-unused-vars */
import User, { UserAttributes } from "../models/user.model";
import File from "../models/file.model";
import Folder from "../models/folder.model";
import { UserRole } from "../types";
import logger from "../utils/logger";

class UserService {
  static async getUserById(
    id: number
  ): Promise<Partial<UserAttributes> | null> {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      logger.error("Error fetching user:", error);
      return null;
    }
  }

  static async getAllUsers(): Promise<UserAttributes[]> {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      logger.error("Error fetching all users:", error);
      return [];
    }
  }

  static async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        logger.info("User not found");
        return false;
      }

      await user.destroy();
      return true;
    } catch (error) {
      logger.error("Error deleting user:", error);
      return false;
    }
  }

  static async updateUserRole({
    id,
    role,
  }: {
    id: number;
    role: UserRole;
  }): Promise<Partial<UserAttributes> | null> {
    try {
      const foundUser = await User.findByPk(id);

      if (!foundUser) {
        logger.info("User not found");
        return null;
      }

      const [rowsAffected, updatedUsers] = await User.update(
        { role },
        {
          where: { id },
          returning: true,
        }
      );
      return rowsAffected === 1 ? updatedUsers[0] : null;
    } catch (error) {
      throw new Error(`Error updating folder: ${error}`);
    }
  }

  static async isFileOwner(userId: number, fileId: number): Promise<boolean> {
    try {
      const file = await File.findByPk(fileId);
      return file?.fileOwner === userId;
    } catch (error) {
      logger.error("Error checking if user is file owner:", error);
      return false;
    }
  }

  static async isFolderOwner(
    userId: number,
    folderId: number
  ): Promise<boolean> {
    try {
      const folder = await Folder.findByPk(folderId);
      return folder?.folderOwner === userId;
    } catch (error) {
      logger.error("Error checking if user is folder owner:", error);
      return false;
    }
  }

  static async isAdminOrOwner(
    userId: number,
    activeUser: number
  ): Promise<boolean> {
    const user = await User.findByPk(activeUser);
    if (user?.role === UserRole.ADMIN || user?.id === userId) {
      return true;
    }
    return false;
  }
}

export default UserService;

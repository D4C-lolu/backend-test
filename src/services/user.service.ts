/* eslint-disable @typescript-eslint/no-unused-vars */
import User, { UserAttributes } from "../models/user.model";


class UserService {
  static async getUserById(id: number): Promise<Partial<UserAttributes> | null> {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  static async getAllUsers(): Promise<UserAttributes[]> {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  static async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        console.log("User not found");
        return false;
      }

      await user.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}

export default UserService;

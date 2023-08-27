import { Request, Response } from "express";
import UserService from "../../services/user.service";


class UserController {
  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    const id = typeof userId === "string" ? parseInt(userId, 10) : userId;  
    try {
      const user = await UserService.getUserById(id);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const userId = req.params.id; 
    
    const id = typeof userId === "string" ? parseInt(userId, 10) : userId; 
    try {
      const deletionSuccessful = await UserService.deleteUser(id);

      if (deletionSuccessful) {
        res.status(204).send(); 
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}


export default UserController;

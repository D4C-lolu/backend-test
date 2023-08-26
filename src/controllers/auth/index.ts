import {Request, Response } from "express";
import AuthService from "../../services/auth.service";
import { LogInInput, SignUpInput } from "../../schemas/auth.schema";


class AuthController {
  
  static async signUp(req: Request<unknown,unknown, SignUpInput>, res:Response) {
    try {
      const userData = req.body;
      const newUser = await AuthService.signUp(userData);

      if (newUser) {
        return res.status(201).json({ message: "Signup successful" });
      } else {
        return res.status(400).json({ message: "Email is already in use" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  static async login(req:Request<unknown, unknown, LogInInput>, res: Response) {
    try {
      const { email, password } = req.body;
      const userWithoutPassword = await AuthService.logIn(email, password);

      if (userWithoutPassword) {
        return res.status(200).json(userWithoutPassword);
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}


export default AuthController;

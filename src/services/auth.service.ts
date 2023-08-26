/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcrypt";
import User, { UserAttributes } from "../models/user.model";
import config from "../config";
import { UserRole } from "../types";
import { SignUpInput } from "../schemas/auth.schema";
const bcryptSalt = config().auth.bcryptSalt;

class AuthService {

  static async  signUp(userData:  SignUpInput ): Promise<Partial<UserAttributes> | null> {
    try {
     
      const hashedPassword = await bcrypt.hash(userData.password, bcryptSalt);

      const newUser = await User.create({
        ...userData,
        role: UserRole.USER,
        password: hashedPassword,
      });

      const { password:_, ...user } = newUser.get();

      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      return null;
    }
  }

  static async logIn(email: string, password: string): Promise<Partial<UserAttributes> | null> {
    try {
    
      const user = await User.findOne({ where: { email } });

      if (!user) {
        console.log("User not found");
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("Incorrect password");
        return null;
      }

      const { password:_, ...userObj } = user.get();

      return userObj;
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  }
}

export default AuthService;

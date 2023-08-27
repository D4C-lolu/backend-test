import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/auth.service";
import { LogInInput, SignUpInput } from "../../schemas/auth.schema";
import passport from "../../utils/passportStrategy";

class AuthController {
  static async signUp(
    req: Request<unknown, unknown, SignUpInput>,
    res: Response
  ) {
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

  static async login(
    req: Request<unknown, unknown, LogInInput>,
    res: Response,
    next: NextFunction
  ) {
    passport.authenticate("local", (error, user) => {
      if (error) {
        return res.status(500).json({ message: "Authentication error." });
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Successful authentication, log in the user
      req.login(user, (loginError) => {
        if (loginError) {
          return res.status(500).json({ message: "Login error." });
        }

        return res.status(200).json({ message: "Logged in successfully." });
      });
    })(req, res, next); // Call the middleware
  }

  static async logout(req: Request, res: Response) {
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    return res.status(200).json({ message: "Logout successful" });
  }
}

export default AuthController;

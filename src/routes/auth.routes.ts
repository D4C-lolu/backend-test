import express from "express";
import AuthController from "../controllers/auth";
import validateResource from "../middleware/validator.middleware";
import { logInSchema, signUpSchema } from "../schemas/auth.schema";


const router = express.Router();

router.post(
  "/signup",
  validateResource(signUpSchema),
  AuthController.signUp
);

router.post(
  "/login",
  validateResource(logInSchema),
  AuthController.login
);

export default router;
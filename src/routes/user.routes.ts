import express from "express";
import UserController from "../controllers/user";
import isAdmin from "../middleware/requireAdmin.middleware";
import isUser from "../middleware/requireUser.middleware";


const router = express.Router();

router.get("/:id",isUser, UserController.getUserById);
router.get("/", isUser, UserController.getAllUsers);
router.delete("/:id",isUser, isAdmin,UserController.deleteUser);

export default router;
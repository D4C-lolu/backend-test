import express from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import file from "./file.routes";
import folder from "./folder.routes"; 

const router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/file", file);
router.use("/folder", folder);


export default router;

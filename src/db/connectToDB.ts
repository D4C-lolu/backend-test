import { Sequelize } from "sequelize";
import config from "../config";
import logger from "../utils/logger";
import User from "../models/user.model";
import { UserRole } from "../types";
import bcrypt from "bcrypt";
import { Folder } from "../models";

const dbName = config().db.dbName;
const dbUsername = config().db.userName;
const dbPassword = config().db.password;
const host = config().db.host;

const dbInstance = new Sequelize(dbName, dbUsername, dbPassword, {
  host,
  dialect: "postgres",
});

async function connectToDatabase(): Promise<void> {
  try {
    await dbInstance.authenticate();
    const admin_password = config().adminPassword;
    const bcryptSalt = config().auth.bcryptSalt;
    const hashedPassword = await bcrypt.hash(admin_password, bcryptSalt);
    const adminEmail = config().adminEmail;
    dbInstance
      .sync()
      .then(() => {
        logger.info("Database synced");

        // User.create({
        //   firstname: "admin",
        //   lastname: "user",
        //   email: adminEmail,
        //   password: hashedPassword,
        //   role: UserRole.ADMIN,
        // });
        // Folder.create({
        //   foldername: "root",
        //   folderOwner: 1,
        //   parentId: undefined
        // });
      })
      .catch((err) => {
        logger.error("Error syncing database", err);
      });
    await 
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}

export { dbInstance, connectToDatabase };

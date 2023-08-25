import { Sequelize } from "sequelize";
import config from "../config";

const dbName = config().db.dbName;
const dbUsername = config().db.userName;
const dbPassword = config().db.password;
const host = config().db.host;

const dbInstance = new Sequelize(dbName, dbUsername, dbPassword, {
  host,
  dialect: "postgres"
});

async function connectToDatabase(): Promise<void> {
  try {
    await dbInstance.authenticate();
    await dbInstance.sync({force: true});
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { dbInstance, connectToDatabase};
import dotenv from "dotenv";

dotenv.config();

export default ()=>({
  port : parseInt(process.env.PORT!, 10),
  nodeEnv : process.env.NODE_ENV!,
  db : {
    userName: process.env.DB_USERNAME!,
    password :process.env.DB_PASSWORD!,
    dbName : process.env.DB_NAME!,
    host: process.env.DB_HOST!,
  }
});

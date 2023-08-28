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
  },
  logDir : process.env.LOG_DIR!,
  maxAllowableRate : parseInt(process.env.MAX_ALLOWABLE_RATE!, 10),
  auth : {
    sessionSecret: process.env.SESSION_SECRET!,
    sessionTTL : parseInt(process.env.SESSION_TTL!, 10),
    bcryptSalt : parseInt(process.env.BCRYPT_SALT_ROUNDS!, 10),
  }, 
  redis : {
    host : process.env.REDIS_HOST!,
    port : parseInt(process.env.REDIS_PORT!, 10),
    password : process.env.REDIS_PASSWORD!,
  },
  aws : {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    bucketName: process.env.AWS_BUCKET_NAME!,
  },
  adminPassword : process.env.ADMIN_PASSWORD!,
  adminEmail: process.env.ADMIN_EMAIL!,
});

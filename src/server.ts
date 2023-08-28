import express, { Request } from "express";
import http from "http";
import config from "./config";
import { connectToDatabase } from "./db/connectToDB";
import session from "express-session";
import passport from "./utils/passportStrategy";
import { redisStore } from "./utils/redisStore";
import routes from "./routes";
import { v4 as uuidv4 } from "uuid";
import logRequest from "./middleware/logRequest.middleware";
import rateLimiter from "./middleware/limiter.middleware";
import logger from "./utils/logger";

const PORT = config().port;

const app = express();


app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(express.json());

app.use(logRequest);

app.use(
  session({
    store: redisStore,
    genid: (req:Request) => {
      logger.info(req.sessionID);
      return uuidv4();
    },
    name: "sid",
    secret: config().auth.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: config().auth.sessionTTL, // session max age in milliseconds
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(rateLimiter);

//TODO: remove this
app.use((req, res, next) => {
  // logger setup etc
  logger.info("SessionID", req.sessionID? req.sessionID : "no sessionID");
  next();
});

app.use("/api/v1", routes);

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  await connectToDatabase();
  server.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}}`);
  });
};

startServer();

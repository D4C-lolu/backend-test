import express from "express";
import http from "http";
import config from "./config";
import { connectToDatabase } from "./db/connectToDB";
import session from "express-session";
import passport from "./utils/passportStrategy";
import { redisStore } from "./utils/redisStore";
import routes from "./routes";

const PORT = config().port;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(
  session({
    store: redisStore,
    secret: config().auth.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,  // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: config().auth.sessionTTL, // session max age in milliseconds
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const server = http.createServer(app);

const startServer = async (): Promise<void> => {     
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}}`);
  });


}; 

startServer();
import express from "express";
import http from "http";
import config from "./config";
import { connectToDatabase } from "./db/connectToDB";

const PORT = config().port;

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());

const server = http.createServer(app);

const startServer = async (): Promise<void> => {     
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}}`);
  });


}; 

startServer();
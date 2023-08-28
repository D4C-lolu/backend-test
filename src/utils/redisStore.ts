import RedisStore from "connect-redis";
import {createClient} from "redis";
import config from "../config";
import logger from "./logger";


const password = config().redis.password;
const host = config().redis.host;
const port = config().redis.port;
// Initialize client.
const redisClient = createClient({
  password: password,
  socket: {
    host,
    port
  }
});
redisClient.connect().catch(logger.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient
});

export { redisStore };


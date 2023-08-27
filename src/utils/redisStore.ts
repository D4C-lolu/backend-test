import RedisStore from "connect-redis";
import {createClient} from "redis";
import config from "../config";


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
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient
});

export { redisStore };


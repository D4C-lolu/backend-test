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

//redis://default:yuHOjiJufz94l4MJlOC6uIGsTmukDuUu@redis-11521.c12.us-east-1-4.ec2.cloud.redislabs.com:11521

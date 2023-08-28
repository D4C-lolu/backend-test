import { NextFunction, Request, Response } from "express";
import { Options, rateLimit } from "express-rate-limit";

import logger from "../utils/logger";
import config from "../config";

const maxAllowableRate = config().maxAllowableRate;

const rateLimitExceededHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
  options: Options
) => {
  logger.log({
    level: "warn",
    message: `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
  });
  res.status(options.statusCode).send(options.message);
};

const createRateLimiter = (message: string) => {
  return rateLimit({
    windowMs: 60 * 1000,
    max: maxAllowableRate,
    message: message,
    handler: rateLimitExceededHandler,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};
const  rateLimiter = createRateLimiter(
  "Too many requests from this IP, please try again after a 60 second pause"
);


export default rateLimiter;

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const formatLog = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const { ip, method, originalUrl } = request;
  const userAgent = request.get("user-agent") || "";

  response.on("finish", () => {
    const { statusCode } = response;
    const contentLength = response.get("content-length");

    logger.log({
      level: "info",
      message: `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
    });
  });

  next();
};

export default formatLog;

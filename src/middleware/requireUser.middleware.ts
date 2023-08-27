import { Request, Response, NextFunction } from "express";

function isUser(req: Request, res: Response, next: NextFunction) {

  if (req.isAuthenticated()) {
    next(); 
  } else {
    res.status(401).json({ message: "Unauthorized. Please sign in" }); 
  }
}

export default isUser;
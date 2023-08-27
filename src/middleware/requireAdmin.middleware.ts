import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types";

function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  
  if (user && user.role === UserRole.ADMIN) {
    next(); 
  } else {
    res.status(403).json({ message: "Access denied. Admin role required." }); 
  }
}

export default isAdmin;
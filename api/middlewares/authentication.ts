import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path !== '/login' && req.path !== '/refresh') {
    const token = req.headers['authorization'];

    if (token &&  typeof token === 'string') {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY_FOR_JWT as string, function(error, decoded) {
        if (error) {
          res.status(403).json({message: "Provided token is incorrect or out of date. Authentication failed!!!"})
        } else {
          next();
        }
      })
    } else {
      res.status(401).json({message: "Unauthorized access. Appropriate token is needed!!!"})
    }
  } else {
    next();
  }
}





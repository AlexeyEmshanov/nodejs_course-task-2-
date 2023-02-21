import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export function authenticationWithJWTMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path !== '/auth') {
    console.log("AUTH", req.url)
    const token = req.headers['x-access-token'];

    if (token &&  typeof token === 'string') {
      jwt.verify(token, 'XYZsecret12345', function(error, decoded) {
        if (error) {
          throw new Error('Provided token is incorrect or out of date. Authentication failed!!!')
          res.status(403).json({message: "Failed to authenticate token"})
        } else {
          next()
        }
      })
    } else {
      throw new Error('Unauthorized access. Appropriate token is needed!!!')
      res.status(401).json({message: "Unauthorized access. Appropriate token is needed!!!"})
    }
  } else {
    next();
  }
}





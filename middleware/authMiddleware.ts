import {Request , Response , NextFunction } from "express";
import prismadb from "../config/prismadb";
import jwt from 'jsonwebtoken'

export const authMiddleware = async(req:Request , res:Response , next: NextFunction) => {
   try {
      const auth = req.headers?.authorization;
      if(!auth) {
          return res.status(403).json({
              ok : false,
              msg : "user not authorized",
             
          })
      }
      
      const jwtSecret = process.env.JWT_SECRET || "my-jwt-secret";
      const data = jwt.verify(auth , jwtSecret);
      
      if(typeof data === 'string'){
          return res.status(403).end();
      }
     

      const isUser = await prismadb.user.findUnique({
          where : {
              id : data.id
          }
      })
       
      // const id1 = String(id);
      console.log(isUser);
      req.headers["user"] = data.id;
      next();
      
     } catch (error) {
       console.log(error);
       return res.status(403).json({
          ok : false,
          msg : "error in authentication",
          error
       })
     }
}
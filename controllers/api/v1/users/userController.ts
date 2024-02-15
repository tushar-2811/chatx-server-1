import { Request , Response } from "express";
import prismadb from "../../../../config/prismadb";

const prisma = prismadb;

// get all users
export const UsersController = async(req: Request , res:Response) => {
     try {
        const allUsers = await prisma.user.findMany({
             select : {
                id : true,
                username : true,
                email : true,
                profilePicture : true
             }
        });
        
        return res.status(201).json({
            ok : true,
            msg : "all users",
            allUsers
        })
        
     } catch (error) {
        console.log("error in getting all users");
        return res.status(403).json({
            ok : false,
            msg : "error in getting all users",
            error
        })
     }
}



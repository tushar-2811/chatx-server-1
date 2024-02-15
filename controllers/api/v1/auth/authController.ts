import {Request , Response} from 'express'
import brcypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SignInSchema, SignUpSchema } from '../../../../config/auth'
import envConfig from '../../../../config/envConfig'
import prismadb from '../../../../config/prismadb'

const prisma = prismadb;


export const userRegisterController = async(req: Request , res:Response) => {
    try {
        const {username , email , password} = req.body;
        const parsedInput = SignUpSchema.safeParse({
            username , email , password
        })

        if(!parsedInput.success) {
            return res.status(401).json({
                ok : false,
                msg : "please provide valid credentials",
                error : parsedInput.error
            })
        }

        // check if there exist already an account by same username or email

        const existingUserByEmail = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(existingUserByEmail){
            return res.status(401).json({
                ok : false ,
                msg : "user already exist with this email"
            })
        }

        const existingUserByUsername = await prisma.user.findUnique({
            where : {
                username : username
            }
        })

        if(existingUserByUsername) {
            return res.status(401).json({
                ok : false ,
                msg : "user already exist with this username"
            })
        }
        
        const hashedPassword = await brcypt.hash(password , 12);
        const newUser = await prisma.user.create({
            data : {
                username : username,
                email : email,
                hashedPassword : hashedPassword
            }
        })

        return res.status(201).json({
            ok : true,
            msg : "Account Created",
            user : {
                username : newUser.username,
                email : newUser.email
            }
        })
        
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok : false,
            msg : "error in sign up",
            error
        })
    }
}


// sign-in
export const userLoginController = async(req: Request , res: Response) => {
     try {
        const {username , password} = req.body;
        const parsedInput = SignInSchema.safeParse({
            username , password
        })

        if(!parsedInput.success) {
            return res.status(401).json({
                ok : false,
                msg : "Please Enter valid credentials",
                error : parsedInput.error
            })
        }

        const existingUserByUsername = await prisma.user.findUnique({
            where : {
                username : username
            }
        })

        if(!existingUserByUsername || !existingUserByUsername.hashedPassword) {
            return res.status(401).json({
                ok : "false",
                msg : "user not found"
            })
        }

        const isPasswordSame = await brcypt.compare(password , existingUserByUsername.hashedPassword);

        if(!isPasswordSame) {
            return res.status(401).json({
                ok : false,
                msg : "wrong password"
            })
        }

        const token = jwt.sign({_id : existingUserByUsername.id} , envConfig.jwt_secret , {expiresIn : "24h"} );

        return res.status(201).json({
            ok : true,
            msg : "successful",
            token : token,
            user : {
                username : existingUserByUsername.username,
                id : existingUserByUsername.id
            }
        })
        
     } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok : false,
            msg : "error in sign in",
            error
        })
     }
}
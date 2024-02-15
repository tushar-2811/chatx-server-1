import { NextFunction, Request , Response } from "express";
import prismadb from "../../../../config/prismadb";

// add new message to db
export const sendMessageController = async(req: Request , res:Response ,next : NextFunction) => {
    try {
        const {chatId} = req.params;
        const {fromUserId , toUserId , messageContent} = req.body;

        if(!messageContent || !chatId || !fromUserId) {
            return res.status(501).json({
                ok : false,
                msg : "required data is missing"
            })
        }

        const newMessage = await prismadb.message.create({
            data : {
                body : messageContent,
                conversationId : chatId,
                senderId : fromUserId
            },
            include : {
                sender : {
                    select : {
                        username : true
                    }
                }
            }
        })

        const existingConversation = await prismadb.conversation.findUnique({
            where : {
                id : chatId
            }
        })

       const messageIds = existingConversation?.messagesIds || [];
       await prismadb.conversation.update({
            where : {
                id : chatId
            },
            data : {
                messagesIds : [...messageIds , newMessage.id]
            }
        })

        return res.status(201).json({
            ok : true,
            msg : "new messsage created",
            newMessage
        })
        
    } catch (error) {
        console.log("error while adding message to db" , error);
        next(error);
    }
}

// get all messages for a chat
export const getAllMessagesController = async(req:Request , res:Response) => {
      try {
        const {chatId} = req.params;

        const existingConversation = await prismadb.conversation.findUnique({
            where : {
                id : chatId
            },
            include : {
                messages : {
                    include : {
                        sender : {
                            select : {
                                username : true
                            }
                        }
                    }
                }
            }
        })

        return res.status(201).json({
            ok : true,
            msg : "all messages",
            conversationMessages : existingConversation?.messages
        })
      } catch (error) {
         console.log("error in fetching all messages of a chat" , error);
         return res.status(501).json({
            ok : false,
            msg : "error in getting messages",
            error
         })
      }
}
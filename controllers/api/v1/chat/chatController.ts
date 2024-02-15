import  { Request , Response } from "express";
import prismadb from "../../../../config/prismadb";


// access chat of two users
export const accessChatController = async(req:Request , res:Response) => {
    try {
        const {currentUserId , anotherUserId} = req.params;

        if(!currentUserId || !anotherUserId) {
            return res.status(401).json({
                ok : false,
                msg : "UserId's not present"
            })
        }

        let existingChat = await prismadb.conversation.findFirst({
            where : {
                AND : {
                    userIds : {
                        hasEvery : [currentUserId , anotherUserId]
                    }
                }
            },
            include : {
                users : {
                    select : {
                        id: true,
                        username : true,
                        profilePicture : true,
                        
                    }
                }
            }
               
        });



        if (existingChat) {
            const anotherUser = existingChat.users.filter((user:any) => {
                return user.id !== currentUserId
            })
            const data = {
                convoId : existingChat?.id,
                anotherUser : anotherUser[0]     
            }
            return res.status(201).json({
                ok : true,
                newChatCreated : false,
                msg : "chat exist already",
                chats : data
            }) 
        }

       const newChat  = await prismadb.conversation.create({
            data: {
                users: {
                    connect: [
                        { id: currentUserId },
                        { id: anotherUserId }
                    ]
                },
                userIds : [currentUserId , anotherUserId]
            },
            include : {
                users : {
                    select : {
                        id: true,
                        username : true,
                        profilePicture : true,
                        
                    }
                }
            }
        });

        const anotherUser = newChat.users.filter((user:any) => {
            return user.id !== currentUserId
        })
        const data = {
            convoId : newChat?.id,
            anotherUser : anotherUser[0]     
        }
        return res.status(201).json({
            ok : true,
            newChatCreated : true,
            msg : "new Chat created",
            chats : data
        }) 

       
    
        
    } catch (error) {
        console.log("error in accessing chat" , error);
        return res.status(501).json({
            ok : false , 
            msg : "error in accessing chat",
            error
        })
    }
}




// fetch all chats for a user (conversation Id's and another user )
export const getChatController = async(req:Request , res: Response) => {
    try {
        const {currentUserId} = req.params;

        const existingUser = await prismadb.user.findUnique({
            where : {
                id : currentUserId
            },
            include : {
                conversations : {
                    include : {
                        users : {
                            select : {
                                id: true,
                                username : true,
                                profilePicture : true,
                                
                            }
                        }
                    }
                }
            }
        })

        

        if(!existingUser) {
            return res.status(401).json({
                ok : false ,
                msg : "No user found"
            })
        }

        const existingConversationData = existingUser.conversations.map((convo: any) => {
             const anotherUser = convo.users.filter((user:any) => {
                return user.id !== currentUserId
            })
            return {
                convoId : convo.id,
                anotherUser : anotherUser[0]
            }
        })

        return res.status(201).json({
            ok : true,
            msg : "all chats found",
            chats : existingConversationData
        })

    } catch (error) {
        console.log('error' , error);
        return res.status(500).json({
             ok : false,
             msg : "error in getting chats",
             error 
        })
    }
}
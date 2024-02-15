import { Router } from "express";
import {  accessChatController, getChatController } from "../../../../controllers/api/v1/chat/chatController";
const chatRouter = Router();

chatRouter.get('/get-chats/:currentUserId/:anotherUserId' , accessChatController);
chatRouter.get("/my-chats/:currentUserId" , getChatController);


export default chatRouter;
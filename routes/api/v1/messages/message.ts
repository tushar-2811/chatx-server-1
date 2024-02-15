import {Router} from 'express'
import { getAllMessagesController, sendMessageController } from '../../../../controllers/api/v1/message/messageController';

const messageRouter = Router();

messageRouter.post("/send-new-message/:chatId" , sendMessageController);
messageRouter.get("/all-messages/:chatId" , getAllMessagesController);

export default messageRouter;

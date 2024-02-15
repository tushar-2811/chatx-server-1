"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../../../../controllers/api/v1/message/messageController");
const messageRouter = (0, express_1.Router)();
messageRouter.post("/send-new-message/:chatId", messageController_1.sendMessageController);
messageRouter.get("/all-messages/:chatId", messageController_1.getAllMessagesController);
exports.default = messageRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../../../../controllers/api/v1/chat/chatController");
const chatRouter = (0, express_1.Router)();
chatRouter.get('/get-chats/:currentUserId/:anotherUserId', chatController_1.accessChatController);
chatRouter.get("/my-chats/:currentUserId", chatController_1.getChatController);
exports.default = chatRouter;

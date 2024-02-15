"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessagesController = exports.sendMessageController = void 0;
const prismadb_1 = __importDefault(require("../../../../config/prismadb"));
// add new message to db
const sendMessageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { fromUserId, toUserId, messageContent } = req.body;
        if (!messageContent || !chatId || !fromUserId) {
            return res.status(501).json({
                ok: false,
                msg: "required data is missing"
            });
        }
        const newMessage = yield prismadb_1.default.message.create({
            data: {
                body: messageContent,
                conversationId: chatId,
                senderId: fromUserId
            },
            include: {
                sender: {
                    select: {
                        username: true
                    }
                }
            }
        });
        const existingConversation = yield prismadb_1.default.conversation.findUnique({
            where: {
                id: chatId
            }
        });
        const messageIds = (existingConversation === null || existingConversation === void 0 ? void 0 : existingConversation.messagesIds) || [];
        yield prismadb_1.default.conversation.update({
            where: {
                id: chatId
            },
            data: {
                messagesIds: [...messageIds, newMessage.id]
            }
        });
        return res.status(201).json({
            ok: true,
            msg: "new messsage created",
            newMessage
        });
    }
    catch (error) {
        console.log("error while adding message to db", error);
        next(error);
    }
});
exports.sendMessageController = sendMessageController;
// get all messages for a chat
const getAllMessagesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const existingConversation = yield prismadb_1.default.conversation.findUnique({
            where: {
                id: chatId
            },
            include: {
                messages: {
                    include: {
                        sender: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(201).json({
            ok: true,
            msg: "all messages",
            conversationMessages: existingConversation === null || existingConversation === void 0 ? void 0 : existingConversation.messages
        });
    }
    catch (error) {
        console.log("error in fetching all messages of a chat", error);
        return res.status(501).json({
            ok: false,
            msg: "error in getting messages",
            error
        });
    }
});
exports.getAllMessagesController = getAllMessagesController;

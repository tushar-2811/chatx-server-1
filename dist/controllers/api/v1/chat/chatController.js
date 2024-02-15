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
exports.getChatController = exports.accessChatController = void 0;
const prismadb_1 = __importDefault(require("../../../../config/prismadb"));
// access chat of two users
const accessChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId, anotherUserId } = req.params;
        if (!currentUserId || !anotherUserId) {
            return res.status(401).json({
                ok: false,
                msg: "UserId's not present"
            });
        }
        let existingChat = yield prismadb_1.default.conversation.findFirst({
            where: {
                AND: {
                    userIds: {
                        hasEvery: [currentUserId, anotherUserId]
                    }
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    }
                }
            }
        });
        if (existingChat) {
            const anotherUser = existingChat.users.filter((user) => {
                return user.id !== currentUserId;
            });
            const data = {
                convoId: existingChat === null || existingChat === void 0 ? void 0 : existingChat.id,
                anotherUser: anotherUser[0]
            };
            return res.status(201).json({
                ok: true,
                newChatCreated: false,
                msg: "chat exist already",
                chats: data
            });
        }
        const newChat = yield prismadb_1.default.conversation.create({
            data: {
                users: {
                    connect: [
                        { id: currentUserId },
                        { id: anotherUserId }
                    ]
                },
                userIds: [currentUserId, anotherUserId]
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    }
                }
            }
        });
        const anotherUser = newChat.users.filter((user) => {
            return user.id !== currentUserId;
        });
        const data = {
            convoId: newChat === null || newChat === void 0 ? void 0 : newChat.id,
            anotherUser: anotherUser[0]
        };
        return res.status(201).json({
            ok: true,
            newChatCreated: true,
            msg: "new Chat created",
            chats: data
        });
    }
    catch (error) {
        console.log("error in accessing chat", error);
        return res.status(501).json({
            ok: false,
            msg: "error in accessing chat",
            error
        });
    }
});
exports.accessChatController = accessChatController;
// fetch all chats for a user (conversation Id's and another user )
const getChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId } = req.params;
        const existingUser = yield prismadb_1.default.user.findUnique({
            where: {
                id: currentUserId
            },
            include: {
                conversations: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            }
                        }
                    }
                }
            }
        });
        if (!existingUser) {
            return res.status(401).json({
                ok: false,
                msg: "No user found"
            });
        }
        const existingConversationData = existingUser.conversations.map((convo) => {
            const anotherUser = convo.users.filter((user) => {
                return user.id !== currentUserId;
            });
            return {
                convoId: convo.id,
                anotherUser: anotherUser[0]
            };
        });
        return res.status(201).json({
            ok: true,
            msg: "all chats found",
            chats: existingConversationData
        });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({
            ok: false,
            msg: "error in getting chats",
            error
        });
    }
});
exports.getChatController = getChatController;

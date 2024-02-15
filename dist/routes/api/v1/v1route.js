"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth/auth"));
const user_1 = __importDefault(require("./users/user"));
const chats_1 = __importDefault(require("./chats/chats"));
const message_1 = __importDefault(require("./messages/message"));
const V1Router = (0, express_1.Router)();
V1Router.use("/auth", auth_1.default);
V1Router.use("/users", user_1.default);
V1Router.use("/chats", chats_1.default);
V1Router.use("/messages", message_1.default);
exports.default = V1Router;

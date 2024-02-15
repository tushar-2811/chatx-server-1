"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, {
        message: "Name is too short !"
    }).max(255),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5, {
        message: "Password too short !"
    }).max(255),
});
exports.SignInSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, {
        message: "Name is too short !"
    }).max(255),
    password: zod_1.z.string().min(5, {
        message: "Password too short !"
    }).max(255),
});

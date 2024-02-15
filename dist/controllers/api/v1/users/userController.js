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
exports.UsersController = void 0;
const prismadb_1 = __importDefault(require("../../../../config/prismadb"));
const prisma = prismadb_1.default;
// get all users
const UsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                profilePicture: true
            }
        });
        return res.status(201).json({
            ok: true,
            msg: "all users",
            allUsers
        });
    }
    catch (error) {
        console.log("error in getting all users");
        return res.status(403).json({
            ok: false,
            msg: "error in getting all users",
            error
        });
    }
});
exports.UsersController = UsersController;

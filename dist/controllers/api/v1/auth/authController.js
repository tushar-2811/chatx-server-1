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
exports.userLoginController = exports.userRegisterController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../../../../config/auth");
const envConfig_1 = __importDefault(require("../../../../config/envConfig"));
const prismadb_1 = __importDefault(require("../../../../config/prismadb"));
const prisma = prismadb_1.default;
const userRegisterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const parsedInput = auth_1.SignUpSchema.safeParse({
            username, email, password
        });
        if (!parsedInput.success) {
            return res.status(401).json({
                ok: false,
                msg: "please provide valid credentials",
                error: parsedInput.error
            });
        }
        // check if there exist already an account by same username or email
        const existingUserByEmail = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUserByEmail) {
            return res.status(401).json({
                ok: false,
                msg: "user already exist with this email"
            });
        }
        const existingUserByUsername = yield prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (existingUserByUsername) {
            return res.status(401).json({
                ok: false,
                msg: "user already exist with this username"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const newUser = yield prisma.user.create({
            data: {
                username: username,
                email: email,
                hashedPassword: hashedPassword
            }
        });
        return res.status(201).json({
            ok: true,
            msg: "Account Created",
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: "error in sign up",
            error
        });
    }
});
exports.userRegisterController = userRegisterController;
// sign-in
const userLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const parsedInput = auth_1.SignInSchema.safeParse({
            username, password
        });
        if (!parsedInput.success) {
            return res.status(401).json({
                ok: false,
                msg: "Please Enter valid credentials",
                error: parsedInput.error
            });
        }
        const existingUserByUsername = yield prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!existingUserByUsername || !existingUserByUsername.hashedPassword) {
            return res.status(401).json({
                ok: "false",
                msg: "user not found"
            });
        }
        const isPasswordSame = yield bcrypt_1.default.compare(password, existingUserByUsername.hashedPassword);
        if (!isPasswordSame) {
            return res.status(401).json({
                ok: false,
                msg: "wrong password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ _id: existingUserByUsername.id }, envConfig_1.default.jwt_secret, { expiresIn: "24h" });
        return res.status(201).json({
            ok: true,
            msg: "successful",
            token: token,
            user: {
                username: existingUserByUsername.username,
                id: existingUserByUsername.id
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: "error in sign in",
            error
        });
    }
});
exports.userLoginController = userLoginController;

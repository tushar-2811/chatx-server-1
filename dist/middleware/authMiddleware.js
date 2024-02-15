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
exports.authMiddleware = void 0;
const prismadb_1 = __importDefault(require("../config/prismadb"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const auth = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!auth) {
            return res.status(403).json({
                ok: false,
                msg: "user not authorized",
            });
        }
        const jwtSecret = process.env.JWT_SECRET || "my-jwt-secret";
        const data = jsonwebtoken_1.default.verify(auth, jwtSecret);
        if (typeof data === 'string') {
            return res.status(403).end();
        }
        const isUser = yield prismadb_1.default.user.findUnique({
            where: {
                id: data.id
            }
        });
        // const id1 = String(id);
        console.log(isUser);
        req.headers["user"] = data.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: "error in authentication",
            error
        });
    }
});
exports.authMiddleware = authMiddleware;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig = {
    jwt_secret: String(process.env.JWT_SECRET)
};
exports.default = envConfig;

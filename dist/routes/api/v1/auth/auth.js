"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../../../controllers/api/v1/auth/authController");
const AuthRouter = (0, express_1.Router)();
// To Register New User
AuthRouter.post("/sign-up", authController_1.userRegisterController);
// to Login into already existing account
AuthRouter.post("/sign-in", authController_1.userLoginController);
exports.default = AuthRouter;

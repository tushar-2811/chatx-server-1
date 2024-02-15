import { Router } from "express";
import { userLoginController, userRegisterController } from "../../../../controllers/api/v1/auth/authController";
const AuthRouter = Router();

// To Register New User
AuthRouter.post("/sign-up" , userRegisterController);

// to Login into already existing account
AuthRouter.post("/sign-in" , userLoginController);

export default AuthRouter;
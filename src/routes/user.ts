import express from "express";
import signupController from "../controller/User/signupController";
import signinController from "../controller/User/signinController";
import validateToken from "../middleware/validateToken";
import refreshTokenController from "../controller/User/refreshTokenController";
import verifyInviteController from "../controller/User/verifyInviteController";
import inviteUserController from "../controller/User/inviteUserController";

const userRouter = express.Router();

userRouter.post("/signup", validateToken, signupController);

userRouter.post("/signin", validateToken, signinController);

userRouter.get("/refreshToken", validateToken, refreshTokenController);

userRouter.post("/invite/verify", validateToken, verifyInviteController);

userRouter.post("/invite", validateToken, inviteUserController);

export default userRouter;

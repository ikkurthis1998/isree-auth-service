import express from "express";
import signupController from "../controller/User/signupController";
import signinController from "../controller/User/signinController";
import validateToken from "../middleware/validateToken";
import refreshTokenController from "../controller/User/refreshTokenController";

const userRouter = express.Router();

userRouter.post("/signup", validateToken, signupController);

userRouter.post("/signin", validateToken, signinController);

userRouter.get("/refreshToken", validateToken, refreshTokenController);

export default userRouter;

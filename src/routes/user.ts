import express from "express";
import signupController from "../controller/User/signupController";
import signinController from "../controller/User/signinController";

const userRouter = express.Router();

userRouter.post("/signup", signupController);

userRouter.post("/signin", signinController);

export default userRouter;

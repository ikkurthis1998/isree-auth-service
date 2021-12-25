import express from "express";
import signupController from "../controller/User/signupController";
import signinController from "../controller/User/signinController";
import validateToken from "../middleware/validateToken";

const userRouter = express.Router();

userRouter.post("/signup", validateToken, signupController);

userRouter.post("/signin", validateToken, signinController);

export default userRouter;

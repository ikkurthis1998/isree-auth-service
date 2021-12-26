import express from "express";
import getBusinessUsersController from "../controller/Business/getBusinessUsersController";
import getClientUsersController from "../controller/Business/getClientUsersController";
import validateToken from "../middleware/validateToken";

const businessRouter = express.Router();

businessRouter.get("/clients", validateToken, getClientUsersController);

businessRouter.get("/users", validateToken, getBusinessUsersController);

export default businessRouter;

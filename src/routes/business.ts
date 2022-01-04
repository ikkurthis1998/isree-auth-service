import express from "express";
import getBusinessUsersController from "../controller/Business/getBusinessUsersController";
import getClientUsersController from "../controller/Business/getClientUsersController";
import assignUserRoleController from "../controller/Business/assignUserRoleController";
import validateToken from "../middleware/validateToken";
import validateHeaders from "../middleware/validateHeaders";

const businessRouter = express.Router();

businessRouter.get("/clients", validateHeaders, getClientUsersController);

businessRouter.get("/users", validateHeaders, getBusinessUsersController);

businessRouter.post(
	"/user/assignRole",
	validateHeaders,
	assignUserRoleController
);

export default businessRouter;

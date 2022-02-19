import { User } from "@prisma/client";
import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	created,
	internalError,
	unAuthorized
} from "../../utils/httpStatusCodes";
import createUser from "../utils/user/createUser";
import createUserRoles from "../utils/userRole/createUserRoles";
import getUserRoles from "../utils/userRole/getUserRoles";

const addBusinessUserController = async (req: Request, res: Response) => {
	const functionName = "addBusinessUserController";
	const traceId = uuid();
	try {
		const { user, business } = req as any;

		if (
			!user.roles.includes("ADMIN") &&
			!user.roles.includes("DEVELOPER")
		) {
			console.log(
				`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Unauthorized`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Unauthorized"
			});
		}

		const { email, key, firstName, lastName, roles } = req.body;

		const { status, message, data } = await createUser({
			firstName,
			lastName,
			email,
			key,
			traceId
		});

		if (status === badRequest) {
			console.log(
				`${functionName} - ${traceId} - ${status} - Bad Request - ${message}`
			);
			return res.status(status).json({
				status,
				message,
				data
			});
		}

		const dashboardUser = data as User;

		await createUserRoles({
			userId: dashboardUser.id,
			roles,
			traceId
		});

		const rolesAssigned = (
			await getUserRoles({
				userId: user.id,
				traceId
			})
		).map((role) => role.role);

		const userData = {
			id: dashboardUser.id,
			firstName: dashboardUser.firstName,
			lastName: dashboardUser.lastName,
			email: dashboardUser.email,
			emailVerified: dashboardUser.emailVerified,
			phone: dashboardUser.phone,
			phoneVerified: dashboardUser.phoneVerified,
			profilePicture: dashboardUser.profilePicture,
			rolesAssigned
		};
		console.log(
			`${functionName} - ${traceId} - 201 - Created - Dashboard User created successfully`
		);
		return res.status(created).json({
			status: created,
			message: "Dashboard User created successfully",
			data: userData
		});
	} catch (error) {
		console.log(
			`${functionName} - ${traceId} - 500 - Internal Error - ${error.message}`
		);
		return res.status(internalError).json({
			status: internalError,
			message: error.message,
			data: null
		});
	}
};

export default addBusinessUserController;

import { Business, Role, User } from "@prisma/client";
import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { AuthUser } from "../../middleware/types";
import { internalError, ok, unAuthorized } from "../../utils/httpStatusCodes";
import getUser from "../utils/user/getUser";
import createUserRoles from "../utils/userRole/createUserRoles";
import getUserRoles from "../utils/userRole/getUserRoles";

const assignUserRoleController = async (req: Request, res: Response) => {
	const functionName = "assignUserRoleController";
	const traceId = uuid();
	try {
		const { user, business } = req as {
			user?: AuthUser;
			business?: Business;
		};

		if (!user || !business) {
			console.log(
				`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Unauthorized`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Unauthorized",
				data: null
			});
		}

		// if (
		// 	!user.roles.includes("ADMIN") &&
		// 	!user.roles.includes("DEVELOPER")
		// ) {
		// 	console.log(
		// 		`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Unauthorized`
		// 	);
		// 	return res.status(unAuthorized).json({
		// 		status: unAuthorized,
		// 		message: "Unauthorized"
		// 	});
		// }

		let { email, roles } = req.body;

		const userToBeAssignedRoles = await getUser({
			email,
			traceId
		});

		if (userToBeAssignedRoles.business.id !== business.id) {
			console.log(
				`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Unauthorized`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Unauthorized",
				data: null
			});
		}

		const userId = userToBeAssignedRoles.id;

		const assignedRoles = (
			await getUserRoles({
				userId,
				traceId
			})
		).map((role) => role.role);

		roles = roles.filter((role: Role) => !assignedRoles.includes(role));

		await createUserRoles({
			userId,
			roles,
			traceId
		});

		const rolesAssigned = (
			await getUserRoles({
				userId,
				traceId
			})
		).map((role) => role.role);

		console.log(
			`${functionName} - ${traceId} - ${ok} - Ok - User roles assigned`
		);

		return res.status(ok).json({
			status: ok,
			message: "User roles assigned",
			data: {
				userId,
				email,
				roles: rolesAssigned
			}
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

export default assignUserRoleController;

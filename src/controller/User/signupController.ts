import { User } from "@prisma/client";
import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	conflict,
	created,
	internalError
} from "../../utils/httpStatusCodes";
import createUser from "../utils/user/createUser";
import createUserRole from "../utils/userRole/createUserRole";
import getUserRoles from "../utils/userRole/getUserRoles";
import getUser from "../utils/user/getUser";

const signupController = async (req: Request, res: Response) => {
	const functionName = "signupController";
	const traceId = uuid();

	try {
		const token = req.headers.token as string;
		const { firstName, lastName, email, key } = req.body;

		const existingUser = await getUser({ email, traceId });

		if (existingUser) {
			console.log(
				`${functionName} - ${traceId} - 409 - Conflict - User already exists`
			);
			return res.status(conflict).json({
				status: conflict,
				message: "User already exists",
				data: null
			});
		}

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

		const user = data as User;

		await createUserRole({
			userId: user.id,
			role: "USER",
			traceId
		});

		const roles = (
			await getUserRoles({
				userId: user.id,
				traceId
			})
		).map((role) => role.role);

		const userData = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			emailVerified: user.emailVerified,
			phone: user.phone,
			phoneVerified: user.phoneVerified,
			profilePicture: user.profilePicture,
			roles
		};

		console.log(
			`${functionName} - ${traceId} - 201 - Created - User created successfully`
		);
		return res.status(created).json({
			status: created,
			message: "User created successfully",
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

export default signupController;

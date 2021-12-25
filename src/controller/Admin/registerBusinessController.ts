import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	conflict,
	created,
	internalError
} from "../../utils/httpStatusCodes";
import createBusiness from "../utils/business/createBusiness";
import getBusiness from "../utils/business/getBusiness";
import connectBusinessUser from "../utils/connectBusinessUser";
import createUser from "../utils/user/createUser";
import getUser from "../utils/user/getUser";
import { User } from "@prisma/client";
import createUserRole from "../utils/userRole/createUserRole";
import getRoles from "../utils/userRole/getUserRoles";

const registerCompanyController = async (req: Request, res: Response) => {
	const functionName = "registerCompanyController";
	const traceId = uuid();

	try {
		const {
			user: { firstName, lastName, email, key },
			business: { name, code }
		} = req.body;

		const existingUser = await getUser({ email, traceId });

		if (existingUser) {
			const existingBusiness = await getBusiness({
				code,
				traceId
			});

			if (existingBusiness) {
				console.log(
					`${functionName} - ${traceId} - 409 - Conflict - Business with given code already exists`
				);
				return res.status(conflict).json({
					status: conflict,
					message: "Business with given code already exists",
					data: null
				});
			}

			const newBusiness = await createBusiness({
				name,
				code,
				traceId
			});

			const connectedUser = await connectBusinessUser({
				userId: existingUser.id,
				businessId: newBusiness.id,
				traceId
			});

			await createUserRole({
				userId: connectedUser.id,
				role: "ADMIN",
				traceId
			});

			const roles = (
				await getRoles({
					userId: connectedUser.id,
					traceId
				})
			).map((role) => role.role);

			const user = {
				id: connectedUser.id,
				firstName: connectedUser.firstName,
				lastName: connectedUser.lastName,
				email: connectedUser.email,
				emailVerified: connectedUser.emailVerified,
				phone: connectedUser.phone,
				phoneVerified: connectedUser.phoneVerified,
				profilePicture: connectedUser.profilePicture,
				roles
			};

			return res.status(created).json({
				status: created,
				message: "Business created",
				data: {
					business: newBusiness,
					user
				}
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

		const newUser = data as User;

		const existingBusiness = await getBusiness({
			code,
			traceId
		});

		if (existingBusiness) {
			console.log(
				`${functionName} - ${traceId} - 409 - Conflict - Business with given code already exists`
			);
			return res.status(conflict).json({
				status: conflict,
				message: "Business with given code already exists",
				data: null
			});
		}

		const newBusiness = await createBusiness({
			name,
			code,
			traceId
		});

		const connectedUser = await connectBusinessUser({
			userId: newUser.id,
			businessId: newBusiness.id,
			traceId
		});

		await createUserRole({
			userId: connectedUser.id,
			role: "ADMIN",
			traceId
		});

		const roles = (
			await getRoles({
				userId: connectedUser.id,
				traceId
			})
		).map((role) => role.role);

		const user = {
			id: connectedUser.id,
			firstName: connectedUser.firstName,
			lastName: connectedUser.lastName,
			email: connectedUser.email,
			emailVerified: connectedUser.emailVerified,
			phone: connectedUser.phone,
			phoneVerified: connectedUser.phoneVerified,
			profilePicture: connectedUser.profilePicture,
			roles
		};

		return res.status(created).json({
			status: created,
			message: "Business created",
			data: {
				business: newBusiness,
				user
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

export default registerCompanyController;

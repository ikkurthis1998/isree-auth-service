import { User } from "@prisma/client";
import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	conflict,
	created,
	internalError,
	notFound,
	ok,
	unAuthorized
} from "../../utils/httpStatusCodes";
import createUser from "../utils/user/createUser";
import getUserRoles from "../utils/userRole/getUserRoles";
import getUser from "../utils/user/getUser";
import createUserRoles from "../utils/userRole/createUserRoles";
import { AuthApplication } from "../../middleware/types";
import verifyInvite from "../utils/invite/verifyInvite";

const signupController = async (
	req: Request & { application: AuthApplication },
	res: Response
) => {
	const functionName = "signupController";
	const traceId = uuid();

	try {
		const { application } = req;

		const { firstName, lastName, email, key, inviteCode } = req.body;

		if (application.type === "DASHBOARD" && !inviteCode) {
			console.log(
				`${functionName} - ${traceId} - 400 - Bad Request - Missing invite code`
			);
			return res.status(badRequest).json({
				status: badRequest,
				message: "Missing invite code",
				data: null
			});
		}

		const existingUser = await getUser({ email, traceId });

		if (existingUser) {
			console.log(
				`${functionName} - ${traceId} - 409 - Conflict - Email already exists`
			);
			return res.status(conflict).json({
				status: conflict,
				message: "Email already exists",
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

		await createUserRoles({
			userId: user.id,
			roles: ["USER"],
			traceId
		});

		if (inviteCode) {
			let invite = await prisma.invite.findUnique({
				where: {
					code: inviteCode
				}
			});

			if (!invite) {
				console.log(
					`${functionName} - ${traceId} - 404 - Not Found - Invite not found`
				);
				return res.status(notFound).json({
					status: notFound,
					message: "Invite not found",
					data: null
				});
			}

			const applicationId = invite.applicationId;

			if (application.id !== applicationId) {
				console.log(
					`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Invite not for this application`
				);
				return res.status(unAuthorized).json({
					status: unAuthorized,
					message: "Invite not for this application",
					data: null
				});
			}

			const { status, message, data } = await verifyInvite({
				inviteCode,
				traceId
			});

			if (status !== ok) {
				console.log(
					`${functionName} - ${traceId} - ${status} - ${message}`
				);
				return res.status(status).json({
					status,
					message,
					data
				});
			}
		}

		const roles = (
			await getUserRoles({
				userId: user.id,
				traceId
			})
		).map((role) => role.role);

		// if (application.type === "DASHBOARD") {
		// 	await prisma.user.update({
		// 		where: {
		// 			id: user.id
		// 		},
		// 		data: {
		// 			business: {
		// 				connect: {
		// 					id: application.business.id
		// 				}
		// 			}
		// 		}
		// 	});
		// }

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				applications: {
					connect: {
						id: application.id
					}
				}
			}
		});

		const finalUser = await getUser({ email, traceId });

		const userData = {
			id: finalUser.id,
			firstName: finalUser.firstName,
			lastName: finalUser.lastName,
			email: finalUser.email,
			emailVerified: finalUser.emailVerified,
			phone: finalUser.phone,
			phoneVerified: finalUser.phoneVerified,
			profilePicture: finalUser.profilePicture,
			roles,
			business: finalUser.business,
			applications: finalUser.applications
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

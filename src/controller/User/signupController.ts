import { Application, Business, Role, User, UserRole } from "@prisma/client";
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

		if (!inviteCode) {
			console.log(
				`${functionName} - ${traceId} - 400 - Bad Request - Missing invite code`
			);
			return res.status(badRequest).json({
				status: badRequest,
				message: "Missing invite code",
				data: null
			});
		}

		let user = await getUser({ email, traceId });

		if (user) {
			console.log(
				`${functionName} - ${traceId} - 409 - Conflict - Email already exists`
			);
			return res.status(conflict).json({
				status: conflict,
				message: "Email already exists",
				data: null
			});
		}

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
		const inviteEmail = invite.email;

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

		if (inviteEmail !== email) {
			console.log(
				`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Invite not for this email`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invite not for this email",
				data: null
			});
		}

		const createUserResponse = await createUser({
			firstName,
			lastName,
			email,
			key,
			traceId
		});

		if (createUserResponse.status === badRequest) {
			console.log(
				`${functionName} - ${traceId} - ${createUserResponse.status} - Bad Request - ${createUserResponse.message}`
			);
			return res
				.status(createUserResponse.status)
				.json(createUserResponse);
		}

		user = createUserResponse.data as User & {
			roles: UserRole[];
			applications: Application[];
			business: Business;
		};

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

		await createUserRoles({
			userId: user.id,
			roles: ["USER"],
			traceId
		});

		const roles = (
			await getUserRoles({
				userId: user.id,
				traceId
			})
		).map((role) => role.role);

		user = (await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				applications: {
					connect: {
						id: application.id
					}
				}
			},
			include: {
				applications: true,
				business: true,
				roles: true
			}
		})) as User & {
			roles: UserRole[];
			applications: Application[];
			business: Business;
		};

		const userData = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			emailVerified: user.emailVerified,
			phone: user.phone,
			phoneVerified: user.phoneVerified,
			profilePicture: user.profilePicture,
			roles,
			business: user.business,
			applications: user.applications
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

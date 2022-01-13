import { User } from "@prisma/client";
import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	created,
	internalError,
	unAuthorized
} from "../../utils/httpStatusCodes";
import getUser from "../utils/user/getUser";

const inviteBusinessUser = async (req: Request, res: Response) => {
	const functionName = "inviteBusinessUser";
	const traceId = uuid();
	try {
		const { user, application } = req as any;

		console.log(application);
		if (!user.roles.includes("ADMIN")) {
			console.log(
				`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Unauthorized`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Unauthorized",
				data: null
			});
		}

		const { email, role } = req.body;

		const existingUser = await getUser({ email, traceId });

		if (existingUser && existingUser.business.id) {
			console.log(
				`${functionName} - ${traceId} - ${badRequest} - BadRequest - User already has a business`
			);
			return res.status(badRequest).json({
				status: badRequest,
				message: "User already has a business",
				data: null
			});
		}

		const invite = await prisma.invite.create({
			data: {
				email,
				business: {
					connect: {
						id: application.business.id
					}
				},
				application: {
					connect: {
						id: application.id
					}
				},
				role,
				inviteType: "BUSINESS",
				inviteExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
			}
		});

		console.log(
			`${functionName} - ${traceId} - 201 - Created - Dashboard User created successfully`
		);
		return res.status(created).json({
			status: created,
			message: "Dashboard User created successfully",
			data: invite
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

export default inviteBusinessUser;

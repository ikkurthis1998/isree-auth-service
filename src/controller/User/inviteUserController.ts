import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { AuthApplication } from "../../middleware/types";
import {
	badRequest,
	created,
	internalError,
	unAuthorized
} from "../../utils/httpStatusCodes";
import getUser from "../utils/user/getUser";
import { prisma } from "../../utils/prisma";

const inviteUserController = async (
	req: Request & { application: AuthApplication },
	res: Response
) => {
	const functionName = "inviteUserController";
	const traceId = uuid();
	try {
		const { application } = req;

		const { email } = req.body;

		const existingUser = await getUser({ email, traceId });

		if (
			existingUser &&
			existingUser.applications.some((app) => app.id === application.id)
		) {
			console.log(
				`${functionName} - ${traceId} - ${badRequest} - BadRequest - User already has access to application`
			);
			return res.status(badRequest).json({
				status: badRequest,
				message: "User already has access to application",
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
				role: "USER",
				inviteType: "USER",
				inviteExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
			}
		});

		console.log(
			`${functionName} - ${traceId} - 201 - Created - User invite created successfully`
		);
		return res.status(created).json({
			status: created,
			message: "User invite created successfully",
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

export default inviteUserController;

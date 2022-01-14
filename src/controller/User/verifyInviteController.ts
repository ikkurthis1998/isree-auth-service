import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { AuthApplication } from "../../middleware/types";
import {
	badRequest,
	created,
	internalError,
	notFound,
	ok,
	unAuthorized
} from "../../utils/httpStatusCodes";
import verifyInvite from "../utils/invite/verifyInvite";
import getUser from "../utils/user/getUser";

const verifyInviteController = async (
	req: Request & {
		application: AuthApplication;
	},
	res: Response
) => {
	const functionName = "verifyInviteController";
	const traceId = uuid();

	try {
		const { application } = req;

		const { code } = req.body;

		let invite = await prisma.invite.findUnique({
			where: {
				code
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
			inviteCode: code,
			traceId
		});

		if (status === ok) {
			await prisma.user.update({
				where: {
					email: invite.email
				},
				data: {
					applications: {
						connect: {
							id: application.id
						}
					}
				}
			});
		}

		console.log(`${functionName} - ${traceId} - ${status} - ${message}`);
		return res.status(status).json({
			status,
			message,
			data
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

export default verifyInviteController;

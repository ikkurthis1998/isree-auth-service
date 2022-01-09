import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";
import { getAccessToken, verifyRefreshToken } from "../../utils/jwt";
import getBusinessToken from "../utils/business/getBusinessToken";
import getUser from "../utils/user/getUser";

const refreshTokenController = async (req: Request, res: Response) => {
	const functionName = "refreshTokenController";
	const traceId = uuid();

	try {
		const refreshToken = req.headers.refreshtoken as string;

		const payload = verifyRefreshToken(refreshToken) as JwtPayload;

		const email = payload.email;

		const user = await getUser({
			email,
			traceId
		});

		const details = {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			emailVerified: user.emailVerified,
			phone: user.phone,
			phoneVerified: user.phoneVerified,
			roles: user.roles,
			profilePicture: user.profilePicture,
			business: user.business,
			applications: user.applications
		};

		const accessToken = getAccessToken(details);

		console.log(`${functionName} - ${traceId} - 200 - OK - User signed in`);
		return res.status(ok).json({
			status: ok,
			message: "User signed in successfully",
			data: {
				details,
				refreshToken,
				accessToken
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

export default refreshTokenController;

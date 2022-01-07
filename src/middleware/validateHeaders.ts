import { NextFunction, Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, unAuthorized } from "../utils/httpStatusCodes";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { prisma } from "../utils/prisma";
import { verifyAccessToken } from "../utils/jwt";

const validateHeaders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const functionName = "validateHeaders";
	const traceId = uuid();

	try {
		const token = req.headers.token as string;

		const authorization = req.headers.authorization as string;

		if (!token) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Token not found`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Token not found",
				data: null
			});
		}

		if (!authorization) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Authorization not found`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Authorization not found",
				data: null
			});
		}

		const bearerToken = authorization.split(" ");

		if (bearerToken[0] !== "Bearer" || bearerToken.length !== 2) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invalid token",
				data: null
			});
		}

		const tokenToVerify = bearerToken[1];

		const secret = fs.readFileSync(
			path.resolve(__dirname, "../certs/public.pem")
		);

		const user = verifyAccessToken(tokenToVerify) as JwtPayload;

		req["user"] = user;

		const application = await prisma.application.findUnique({
			where: {
				token
			}
		});

		if (!application) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invalid token",
				data: null
			});
		}

		if (application && application.businessId !== user.business.id) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invalid token",
				data: null
			});
		}

		req["application"] = application;

		console.log(`${functionName} - ${traceId} - 200 - OK - Token verified`);
		next();
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

export default validateHeaders;

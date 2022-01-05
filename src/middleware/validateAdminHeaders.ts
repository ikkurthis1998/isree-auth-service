import { NextFunction, Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, unAuthorized } from "../utils/httpStatusCodes";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { prisma } from "../utils/prisma";

const validateAdminHeaders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const functionName = "validateAdminHeaders";
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

		const user = jwt.verify(tokenToVerify, secret) as JwtPayload;

		req["user"] = user;

		const business = await prisma.business.findUnique({
			where: {
				token
			}
		});

		if (!business) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invalid token",
				data: null
			});
		}

		if (business.code !== "isree-auth-service") {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invalid token",
				data: null
			});
		}

		if (business.id !== user.business.id) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Invalid token",
				data: null
			});
		}

		console.log(`${functionName} - ${traceId} - 200 - OK - Token verified`);
		req["business"] = business;
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

export default validateAdminHeaders;

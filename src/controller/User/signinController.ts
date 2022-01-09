import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { decryptData } from "../../utils/crypto";
import {
	accessDenied,
	internalError,
	notFound,
	ok
} from "../../utils/httpStatusCodes";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import getUser from "../utils/user/getUser";
import getUserRoles from "../utils/userRole/getUserRoles";
import getBusinessToken from "../utils/business/getBusinessToken";
import getBusiness from "../utils/business/getBusiness";
import { Application, Role, User } from "@prisma/client";
import { getAccessToken, getRefreshToken } from "../../utils/jwt";

const signinController = async (req: Request, res: Response) => {
	const functionName = "signinController";
	const traceId = uuid();

	try {
		const { email, key } = req.body;

		const existingUser = await getUser({ email, traceId });

		if (existingUser) {
			const data = decryptData(existingUser.userData, key);
			if (data && data.length > 0) {
				const userData = JSON.parse(data);
				if (userData) {
					const details = {
						id: existingUser.id,
						username: existingUser.username,
						firstName: existingUser.firstName,
						lastName: existingUser.lastName,
						email: existingUser.email,
						emailVerified: existingUser.emailVerified,
						phone: existingUser.phone,
						phoneVerified: existingUser.phoneVerified,
						roles: existingUser.roles,
						profilePicture: existingUser.profilePicture,
						business: existingUser.business,
						applications: existingUser.applications
					};

					const accessToken = getAccessToken(details);
					const refreshToken = getRefreshToken({
						email: details.email
					});

					console.log(
						`${functionName} - ${traceId} - 200 - OK - User signed in`
					);
					return res.status(ok).json({
						status: ok,
						message: "User signed in successfully",
						data: {
							details,
							refreshToken,
							accessToken
						}
					});
				}
			}

			console.log(
				`${functionName} - ${traceId} - 401 - Access Denied - Invalid key`
			);
			return res.status(accessDenied).json({
				status: accessDenied,
				message: "Invalid key",
				data: null
			});
		}

		console.log(
			`${functionName} - ${traceId} - 404 - Not Found - User not found`
		);
		return res.status(notFound).json({
			status: notFound,
			message: "User not found",
			data: null
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

export default signinController;

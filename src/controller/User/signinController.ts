import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { decryptData, encryptData } from "../../utils/crypto";
import {
	accessDenied,
	conflict,
	created,
	internalError,
	notFound,
	ok
} from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const signinController = async (req: Request, res: Response) => {
	const functionName = "signinController";
	const traceId = uuid();

	try {
		const { email, password } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (existingUser) {
			const data = decryptData(existingUser.userData, password);
			if (data && data.length > 0) {
				const userData = JSON.parse(data);
				if (userData) {
					const secret = fs.readFileSync(
						path.resolve(__dirname, "../../certs/private.pem")
					);
					const roles = await prisma.userRole.findMany({
						where: {
							user: {
								id: existingUser.id
							}
						}
					});

					const details = {
						id: existingUser.id,
						username: existingUser.username,
						firstName: existingUser.firstName,
						lastName: existingUser.lastName,
						email: existingUser.email,
						emailVerified: existingUser.emailVerified,
						phone: existingUser.phone,
						phoneVerified: existingUser.phoneVerified,
						roles: roles.map((role) => role.role),
						profilePicture: existingUser.profilePicture
					};

					const accessToken = jwt.sign(details, secret, {
						expiresIn: "1h",
						algorithm: "RS256"
					});
					return res.status(ok).json({
						status: ok,
						message: "User signed in successfully",
						data: {
							details,
							accessToken
						}
					});
				}
			}

			return res.status(accessDenied).json({
				status: accessDenied,
				message: "Incorrect password",
				data: null
			});
		}

		return res.status(notFound).json({
			status: notFound,
			message: "User with given email does not exist",
			data: null
		});
	} catch (error) {
		console.log(`${functionName} ${traceId} ${error.message}`);
		return res.status(internalError).json({
			status: internalError,
			message: error.message,
			data: null
		});
	}
};

export default signinController;

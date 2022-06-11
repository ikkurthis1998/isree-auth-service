import { JwtPayload } from "jsonwebtoken";
import { unAuthorized } from "../../utils/httpStatusCodes";
import { verifyAccessToken } from "../../utils/jwt";

export const validateHeaders = async ({ token, authorization, traceId }) => {
    const functionName = "validateHeaders";
    try {
        if (!token) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Token not found`
			);
            return {
                error: {
                    status: unAuthorized,
                    message: "Token not found",
                    data: null
                }
            }
		}

		if (!authorization) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Authorization not found`
			);
            return {
                error: {
                    status: unAuthorized,
                    message: "Authorization not found",
                    data: null
                }
            }
		}

		const bearerToken = authorization.split(" ");

		if (bearerToken[0] !== "Bearer" || bearerToken.length !== 2) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
            return {
                error: {
                    status: unAuthorized,
                    message: "Invalid token",
                    data: null
                }
            }
		}

		const tokenToVerify = bearerToken[1];

		const user = verifyAccessToken(tokenToVerify) as JwtPayload;

		const application = await prisma.application.findUnique({
			where: {
				token
			},
			include: {
				business: true
			}
		});

		if (!application) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
            return {
                error: {
                    status: unAuthorized,
                    message: "Invalid token",
                    data: null
                }
            }
		}

		if (application && application.businessId !== user.business.id) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
			);
            return {
                error: {
                    status: unAuthorized,
                    message: "Invalid token",
                    data: null
                }
            }
		}

		console.log(`${functionName} - ${traceId} - 200 - OK - Token verified`);
        return {
            data: {
                user,
                application
            }
        }
    } catch (error) {
        console.log(`${functionName} - ${traceId} - 500 - Internal Error - ${error.message}`);
        return {
            error
        };
    }
}
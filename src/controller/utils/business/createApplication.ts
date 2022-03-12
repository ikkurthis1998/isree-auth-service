import { AppType } from "@prisma/client";
import { encryptData } from "../../../utils/crypto";
import { badRequest, created } from "../../../utils/httpStatusCodes";
import checkKeyStrength from "../checkKeyStrength";
import { prisma } from "../../../utils/prisma";

const createApplication = async ({
	name,
	type,
	key,
	businessId,
	traceId
}: {
	name: string;
	type: AppType;
	key: string;
	businessId: string;
	traceId: string;
}) => {
	const functionName = "createApplication";
	try {
		const { score, feedback } = checkKeyStrength({
			key,
			traceId
		});

		if (score <= 2) {
			console.log(
				`${functionName} - ${traceId} - Key is not strong enough`
			);
			return {
				status: badRequest,
				message: "Key is not strong enough",
				data: {
					score,
					feedback
				}
			};
		}

		const appData = encryptData(
			JSON.stringify({
				name,
				type
			}),
			key
		);

		const application = await prisma.application.create({
			data: {
				name,
				type,
				appData,
				business: {
					connect: {
						id: businessId
					}
				}
			}
		});

		console.log(
			`${functionName} - ${traceId} - Application created successfully`
		);
		return {
			status: created,
			message: "Application created successfully",
			data: application
		};
	} catch (error) {
		throw error;
	}
};

export default createApplication;

import { encryptData } from "../../../utils/crypto";
import { prisma } from "../../../utils/prisma";
import checkKeyStrength from "../checkKeyStrength";
import { badRequest, created } from "../../../utils/httpStatusCodes";

const createUser = async ({
	firstName,
	lastName,
	email,
	key,
	traceId
}: {
	firstName: string;
	lastName: string;
	email: string;
	key: string;
	traceId: string;
}) => {
	const functionName = "createUser";

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

		const userData = encryptData(
			JSON.stringify({
				firstName,
				lastName,
				email
			}),
			key
		);

		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				userData
			}
		});

		console.log(`${functionName} - ${traceId} - User created successfully`);
		return {
			status: created,
			message: "User created successfully",
			data: user
		};
	} catch (error) {
		throw error;
	}
};

export default createUser;

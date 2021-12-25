import { prisma } from "../../../utils/prisma";

const getUser = async ({
	email,
	traceId
}: {
	email: string;
	traceId: string;
}) => {
	const functionName = "getUser";

	try {
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			console.log(`${functionName} - ${traceId} - User not found`);
			return user;
		}

		console.log(`${functionName} - ${traceId} - User found`);
		return user;
	} catch (error) {
		throw error;
	}
};

export default getUser;

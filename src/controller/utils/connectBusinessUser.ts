import { prisma } from "../../utils/prisma";

const connectBusinessUser = async ({
	userId,
	businessId,
	traceId
}: {
	userId: string;
	businessId: string;
	traceId: string;
}) => {
	const functionName = "connectBusinessUser";

	try {
		const user = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				business: {
					connect: {
						id: businessId
					}
				}
			}
		});

		console.log(
			`${functionName} - ${traceId} - User connected to Business`
		);
		return user;
	} catch (error) {
		throw error;
	}
};

export default connectBusinessUser;

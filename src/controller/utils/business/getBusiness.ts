import { prisma } from "../../../utils/prisma";

const getBusiness = async ({
	code,
	traceId
}: {
	code: string;
	traceId: string;
}) => {
	const functionName = "getBusiness";

	try {
		const business = await prisma.business.findUnique({
			where: {
				code
			}
		});
		if (!business) {
			console.log(`${functionName} - ${traceId} - Business not found`);
			return business;
		}
		console.log(`${functionName} - ${traceId} - Business found`);
		return business;
	} catch (error) {
		throw error;
	}
};

export default getBusiness;

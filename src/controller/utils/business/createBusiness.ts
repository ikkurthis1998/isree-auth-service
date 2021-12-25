import { prisma } from "../../../utils/prisma";

const createBusiness = async ({
	name,
	code,
	traceId
}: {
	name: string;
	code: string;
	traceId: string;
}) => {
	const functionName = "createBusiness";

	try {
		const business = await prisma.business.create({
			data: {
				name,
				code
			}
		});

		console.log(`${functionName} - ${traceId} - Business created`);
		return business;
	} catch (error) {
		throw error;
	}
};

export default createBusiness;

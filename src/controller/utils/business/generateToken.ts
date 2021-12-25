import { customAlphabet } from "nanoid";

const generateToken = ({
	businessId,
	traceId
}: {
	businessId: string;
	traceId: string;
}) => {
	const functionName = "generateToken";

	const custom =
		businessId.split("-")[0] +
		businessId.split("-")[1] +
		businessId.split("-")[2] +
		businessId.split("-")[3] +
		businessId.split("-")[4];
	const token = customAlphabet(custom, 15)();

	console.log(`${functionName} - ${traceId} - Token generated`);
	return token;
};

export default generateToken;

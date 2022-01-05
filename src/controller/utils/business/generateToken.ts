import { customAlphabet } from "nanoid";

const generateToken = ({ id, traceId }: { id: string; traceId: string }) => {
	const functionName = "generateToken";

	const custom =
		id.split("-")[0] +
		id.split("-")[1] +
		id.split("-")[2] +
		id.split("-")[3] +
		id.split("-")[4];
	const token = customAlphabet(custom, 15)();

	console.log(`${functionName} - ${traceId} - Token generated`);
	return token;
};

export default generateToken;

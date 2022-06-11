import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";
import { validateHeaders } from "../utils/validateHeaders";

export const authenticateController = async (req: Request, res: Response) => {
    const functionName = "authenticateController";
    const traceId = uuid();
    console.log(`${functionName} - ${traceId} - Start`);
    try {

        const {
            request
        } = req.body;

        const headers = request && request.headers;

        const token = headers && headers.token;
        const authorization = headers && headers.authorization;

        const { data, error } = await validateHeaders({ token, authorization, traceId });

        if (error) {
            console.log(`${functionName} - ${traceId} - ${error.status} - ${error.message}`);
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                data: null
            });
        }

        console.log(`${functionName} - ${traceId} - 200 - OK`);
        return res.status(ok).json({
            status: ok,
            message: "Authentication successful",
            data: data
        });

    } catch (error) {
        console.log(
			`${functionName} - ${traceId} - 500 - Internal Error - ${error.message}`
		);
		return res.status(internalError).json({
			status: internalError,
			message: error.message,
			data: null
		});
    }
}
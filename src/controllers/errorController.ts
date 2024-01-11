import { Response } from "express";

type errorController = {
	returnInternalServerError: (error: Error, res: Response) => void;
};

export const returnInternalServerError = (error: Error, res: Response) => {
	const response = {
		status: "fail",
		message: error.message,
		stack: error.stack,
	};
	console.log(error);
	res.send(response);
};

export default {
	returnInternalServerError,
} as errorController;

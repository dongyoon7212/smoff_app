import { sendVerifyEmail } from "./types";
import { instance } from "./utils";

export const sendVerifyEmailRequest = async (data: sendVerifyEmail) => {
	try {
		const response = await instance.post("/mail/send", data);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

export const verifyEmailRequest = async (email: string) => {
	try {
		const response = await instance.get(`/auth/role/${email}`);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

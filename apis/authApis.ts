import { SignupData } from "./types";
import { instance } from "./utils";

export const emailCheckRequest = async (email: string) => {
	try {
		const response = await instance.get(`/auth/email/${email}`);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

export const usernameCheckRequest = async (username: string) => {
	try {
		const response = await instance.get(`/auth/username/${username}`);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

export const signupRequest = async (data: SignupData) => {
	try {
		const response = await instance.post("/auth/signup", data);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

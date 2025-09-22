import {
	changePasswordData,
	changeProfileImgData,
	updateUsernameData,
} from "./types";
import { instance } from "./utils";

export const updateUsernameRequest = async (data: updateUsernameData) => {
	try {
		const response = await instance.post("/account/change/username", data);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

export const changePasswordRequest = async (data: changePasswordData) => {
	try {
		const response = await instance.post("/account/change/password", data);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

export const changeProfileImgRequest = async (data: changeProfileImgData) => {
	try {
		const response = await instance.post(
			"/account/change/profileimg",
			data
		);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

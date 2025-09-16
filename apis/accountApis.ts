import { updateUsernameData } from "./types";
import { instance } from "./utils";

export const updateUsernameRequest = async (data: updateUsernameData) => {
	try {
		const response = await instance.post("/account/change/username", data);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

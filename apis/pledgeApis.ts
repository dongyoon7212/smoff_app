import { AddPledgeData } from "./types";
import { instance } from "./utils";
export const addPledgeRequest = async (data: AddPledgeData) => {
	try {
		const response = await instance.post("/pledge/add", data);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

export const getPledgeRequest = async (challengerId: number) => {
	try {
		const response = await instance.get(`/pledge/${challengerId}`);
		return response.data;
	} catch (error: any) {
		return error.response;
	}
};

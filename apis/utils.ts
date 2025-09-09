import axios from "axios";

export const instance = axios.create({
	baseURL: "http://192.168.0.72:8080",
	headers: {
		"Content-Type": "application/json",
	},
});

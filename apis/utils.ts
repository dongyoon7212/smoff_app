import { useAuth } from "@/stores/useAuth";
import axios from "axios";

export const instance = axios.create({
	baseURL: "http://192.168.0.10:8080",
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use((cfg) => {
	const token = useAuth.getState().accessToken; // ✅ zustand는 getState()로 동기 접근
	if (token) {
		cfg.headers = cfg.headers ?? {};
		cfg.headers["Authorization"] = `Bearer ${token}`;
	}
	return cfg;
});

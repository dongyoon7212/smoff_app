// lib/token.ts
import * as SecureStore from "expo-secure-store";

let memoryAccess: string | null = null;

export const tokenStore = {
	get: async () =>
		memoryAccess ??
		(memoryAccess = await SecureStore.getItemAsync("accessToken")),
	set: async (t: string) => {
		memoryAccess = t;
		await SecureStore.setItemAsync("accessToken", t);
	},
	clear: async () => {
		memoryAccess = null;
		await SecureStore.deleteItemAsync("accessToken");
	},
};

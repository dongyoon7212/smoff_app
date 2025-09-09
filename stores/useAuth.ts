// stores/useAuth.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserRole = {
	userRoleId: number;
	userId: number;
	roleId: number;
	createDt: string;
	updateDt: string;
	role: {
		roldId: number;
		roleName: string;
		roleNameKor: string;
	};
};
type User = {
	userId: number;
	email: string;
	username: string;
	age: number;
	profileImg: string;
	roleType: string;
	userRoles: UserRole[];
} | null;

type AuthState = {
	accessToken: string | null;
	user: User;
	hydrated: boolean;
	setAuth: (token: string, user?: User) => void;
	clearAuth: () => void;
	_setHydrated: (v: boolean) => void;
};

const storage = {
	getItem: async (name: string) => SecureStore.getItemAsync(name),
	setItem: async (name: string, value: string) =>
		SecureStore.setItemAsync(name, value),
	removeItem: async (name: string) => SecureStore.deleteItemAsync(name),
};

export const useAuth = create<AuthState>()(
	persist(
		(set, get) => ({
			accessToken: null,
			user: null,
			hydrated: false,
			setAuth: (token, user) =>
				set({ accessToken: token, user: user ?? get().user }),
			clearAuth: () => set({ accessToken: null, user: null }),
			_setHydrated: (v) => set({ hydrated: v }),
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => ({
				// JSON 래핑 (문자열 저장)
				getItem: async (k) => (await storage.getItem(k)) ?? null,
				setItem: async (k, v) => storage.setItem(k, v),
				removeItem: async (k) => storage.removeItem(k),
			})),
			partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
			// ✅ 하이드레이션 콜백으로 hydrated 플래그 세팅
			onRehydrateStorage: () => (state) => state?._setHydrated(true),
		}
	)
);

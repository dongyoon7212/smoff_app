// stores/useAuth.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 👇 오타 수정 (roldId -> roleId)
type UserRole = {
	userRoleId: number;
	userId: number;
	roleId: number;
	createDt: string;
	updateDt: string;
	role: {
		roleId: number;
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
	setUser: (
		patch:
			| Partial<NonNullable<User>>
			| ((u: NonNullable<User>) => NonNullable<User>)
	) => void; // 👈 추가
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

			// ✅ user만 안전하게 부분 업데이트
			setUser: (patch) =>
				set((s) => {
					if (!s.user) return {}; // 로그인 전이면 무시
					const next =
						typeof patch === "function"
							? patch(s.user as NonNullable<User>)
							: { ...(s.user as NonNullable<User>), ...patch };
					return { user: next };
				}),

			_setHydrated: (v) => set({ hydrated: v }),
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => ({
				getItem: async (k) => (await storage.getItem(k)) ?? null,
				setItem: async (k, v) => storage.setItem(k, v),
				removeItem: async (k) => storage.removeItem(k),
			})),
			partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
			onRehydrateStorage: () => (state) => state?._setHydrated(true),
		}
	)
);

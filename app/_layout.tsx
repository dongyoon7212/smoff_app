// app/_layout.tsx
import { useAuth } from "@/stores/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	Redirect,
	Stack,
	useRootNavigationState,
	useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

const client = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

function ThemedRoot() {
	const { theme } = useTheme();

	// --- auth / hydration ---
	const authed = useAuth((s) => !!s.accessToken);
	const user = useAuth((s) => s.user);
	const hydrated = useAuth((s) => s.hydrated);

	// roleId === 3 (임시/미인증) 포함 여부로 인증완료 판정
	const isVerified =
		Array.isArray(user?.userRoles) &&
		!user!.userRoles.some(
			(r: any) =>
				Number.parseInt(String(r?.role?.roleId).trim(), 10) === 3
		);

	// --- nav ready gating (루트 네비게이터가 준비된 뒤에만 Redirect 렌더) ---
	const navState = useRootNavigationState();
	const ready = !!navState?.key && hydrated; // zustand persist 복원 + 네비 준비 둘 다 OK일 때만

	// --- 현재 위치 파악 ---
	const segments = useSegments();
	const inAuth = segments[0] === "(auth)";
	const inTabs = segments[0] === "(tabs)";
	const atTabsLogin = inTabs && segments[1] === "login";

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg }}>
			<StatusBar style="auto" />
			<QueryClientProvider client={client}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="challenger/pledge" />
					<Stack.Screen name="supporter/link" />
					<Stack.Screen name="profile/edit-username" />
					<Stack.Screen name="profile/change-password" />
					<Stack.Screen name="+not-found" />
				</Stack>

				{/* 네비 준비 전: 오버레이 로딩만 */}
				{!ready && (
					<View
						style={{
							position: "absolute",
							inset: 0,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<ActivityIndicator />
					</View>
				)}

				{/* 네비 + 스토어 준비 후: 단일 Redirect 블록에서만 분기 */}
				{ready &&
					(() => {
						// 미로그인 → (tabs)/login 으로
						if (!authed && !inAuth)
							return <Redirect href="/(tabs)/login" />;

						// 로그인 + 인증완료 + (auth) 그룹 접근 시 → 탭 홈으로
						if (authed && isVerified && inAuth)
							return <Redirect href="/(tabs)" />;

						// 로그인 + (tabs)/login 이면 → 탭 홈으로
						if (authed && atTabsLogin)
							return <Redirect href="/(tabs)" />;

						return null;
					})()}
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
}

export default function RootLayout() {
	return (
		<ThemeProvider>
			<ThemedRoot />
		</ThemeProvider>
	);
}

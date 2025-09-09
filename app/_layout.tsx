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
	const segments = useSegments();
	const authed = useAuth((s) => !!s.accessToken);
	const hydrated = useAuth((s) => s.hydrated);
	console.log("authed:", authed);

	const nav = useRootNavigationState();
	const ready = !!nav?.key && hydrated; // zustand persist 복원 + 네비 준비

	{
		ready &&
			(() => {
				const inAuthGroup = segments[0] === "(auth)";
				const inTabsGroup = segments[0] === "(tabs)";
				const atTabsLogin = inTabsGroup && segments[1] === "login";

				// 1) 미인증인데 탭의 다른 화면에 있다 → 로그인 탭으로
				if (!authed && inTabsGroup && !atTabsLogin) {
					return <Redirect href="/(tabs)/login" />;
				}

				// 2) 인증됐고 (auth) 그룹에 있다 → 홈으로
				if (authed && inAuthGroup) {
					return <Redirect href="/(tabs)" />;
				}

				// 3) 인증됐고 (tabs)/login 에 있다 → 홈으로
				if (authed && atTabsLogin) {
					return <Redirect href="/(tabs)" />;
				}

				return null;
			})();
	}
	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg }}>
			<StatusBar style="auto" />
			<QueryClientProvider client={client}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="challenger/pledge" />
					<Stack.Screen name="supporter/link" />
					<Stack.Screen name="+not-found" />
				</Stack>

				{/* ⬇️ 네비 준비 전엔 네비게이터는 그대로 둔 채 로딩만 오버레이 */}
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

				{/* ⬇️ 준비된 후에만 Redirect 렌더 (사이드이펙트 대신 안전) */}
				{ready &&
					(() => {
						const inAuthGroup = segments[0] === "(auth)";
						if (!authed && !inAuthGroup)
							return <Redirect href="/(tabs)/login" />;
						if (authed && inAuthGroup)
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

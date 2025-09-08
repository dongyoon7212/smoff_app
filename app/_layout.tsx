// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// ⬇️ 우리가 만든 전역 테마 (theme/ 폴더에 두셨다면 경로는 ../theme/..)
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

const client = new QueryClient({
	defaultOptions: { queries: { retry: 1 } },
});

// 테마 값을 실제로 적용하는 래퍼
function ThemedRoot() {
	const { theme } = useTheme(); // light/dark 팔레트
	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg }}>
			{/* OS 테마 자동 반영: 다크면 밝은 텍스트, 라이트면 어두운 텍스트 */}
			<StatusBar style="auto" />
			<QueryClientProvider client={client}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="challenger/pledge" />
					<Stack.Screen name="supporter/link" />
					<Stack.Screen name="+not-found" />
				</Stack>
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

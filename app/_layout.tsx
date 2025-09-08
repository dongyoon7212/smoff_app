import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const client = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
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

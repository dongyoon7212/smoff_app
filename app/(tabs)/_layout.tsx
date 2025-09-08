import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabLayout() {
	const { theme } = useTheme();

	const isLoggedIn = false;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					backgroundColor: theme.tabBg,
					borderTopColor: theme.border,
				},
				tabBarActiveTintColor: theme.tabActive,
				tabBarInactiveTintColor: theme.tabInactive,
			}}
		>
			<Tabs.Screen name="index" options={{ title: "홈" }} />
			<Tabs.Screen name="history" options={{ title: "로그" }} />
			<Tabs.Screen name="savings" options={{ title: "저금통" }} />
			<Tabs.Screen
				name="my"
				options={{
					title: "마이페이지",
					href: isLoggedIn ? undefined : null,
				}}
			/>
			<Tabs.Screen
				name="login"
				options={{
					title: "로그인",
					href: isLoggedIn ? null : undefined,
				}}
			/>
		</Tabs>
	);
}

// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
export default function AuthLayout() {
	return (
		<Stack screenOptions={{ headerTitle: "" }}>
			<Stack.Screen name="role-select" options={{ title: "역할 선택" }} />
			<Stack.Screen
				name="signup-email"
				options={{ title: "이메일/비밀번호" }}
			/>
			<Stack.Screen
				name="signup-profile"
				options={{ title: "사용자 이름" }}
			/>
			<Stack.Screen
				name="verify-email"
				options={{ title: "이메일 인증" }}
			/>
		</Stack>
	);
}
